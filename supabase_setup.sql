-- Setup Users table
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'Viewer' CHECK (role IN ('Viewer', 'Author', 'Admin'))
);

-- Setup Posts table
CREATE TABLE public.posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  image_url TEXT,
  author_id UUID REFERENCES public.users(id) NOT NULL,
  summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Setup Comments table
CREATE TABLE public.comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  comment_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Users RLS Policies
CREATE POLICY "Public users are viewable by everyone."
  ON public.users FOR SELECT
  USING ( true );

CREATE POLICY "Users can update own profile."
  ON public.users FOR UPDATE
  USING ( auth.uid() = id );

-- Admins can update users
CREATE POLICY "Admins can update users."
  ON public.users FOR UPDATE
  USING ( EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'Admin') );

-- Posts RLS Policies
CREATE POLICY "Posts are viewable by everyone."
  ON public.posts FOR SELECT
  USING ( true );

CREATE POLICY "Authors can create posts."
  ON public.posts FOR INSERT
  WITH CHECK ( auth.uid() = author_id AND EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('Author', 'Admin')) );

CREATE POLICY "Authors can update own posts, Admins can update any."
  ON public.posts FOR UPDATE
  USING ( auth.uid() = author_id OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'Admin') );

CREATE POLICY "Authors can delete own posts, Admins can delete any."
  ON public.posts FOR DELETE
  USING ( auth.uid() = author_id OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'Admin') );

-- Comments RLS Policies
CREATE POLICY "Comments are viewable by everyone."
  ON public.comments FOR SELECT
  USING ( true );

CREATE POLICY "Any logged in user can insert comments."
  ON public.comments FOR INSERT
  WITH CHECK ( auth.uid() = user_id );

CREATE POLICY "Users can delete own comments, Admins can delete any."
  ON public.comments FOR DELETE
  USING ( auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'Admin') );

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, name, email, role)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.email, 'Viewer');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call handle_new_user on auth.users insert
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Setup Storage Bucket for Featured Images
INSERT INTO storage.buckets (id, name, public) VALUES ('featured-images', 'featured-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Access for featured images"
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'featured-images' );

CREATE POLICY "Authors and Admins can insert images"
  ON storage.objects FOR INSERT
  WITH CHECK ( bucket_id = 'featured-images' AND EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('Author', 'Admin')) );

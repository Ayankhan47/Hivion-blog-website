# 📚 Hivion - AI-Powered Blog Platform

Welcome to **Hivion**, a modern, feature-rich blog platform that combines beautiful design with intelligent content summarization. Discover and share articles automatically enhanced with AI-generated summaries.

**#Live Link**
"hivionblog-1n3k50710-khanayan97553-gmailcoms-projects.vercel.app"
#for Admin Access
Email ==> "admin123@gmail.com"
password ==> "Admin@123"
---
## 🚀 Getting Started as a User

### Viewing Articles
1. Visit the homepage to see featured blog posts
2. **Search** for topics using the search bar at the top
3. Click on any article card to read the full post and AI summary
4. Use **pagination** buttons to browse more posts

### Creating an Account
1. Click the **Register** link in the navbar
2. Enter your email and password
3. Complete the registration process
4. You're ready to start publishing!

### Logging In
1. Click **Login** in the navbar
2. Enter your credential
3. You'll be taken to your dashboard

### Publishing Your First Post
1. Click **New Post** in the navbar
2. Enter your article title and content
3. Upload an image (optional but recommended)
4. Click **Publish**
5. Your article will be summarized by AI automatically and appear on the homepage

### Engaging with Content
- **Search posts** using the search bar on the homepage
- **Read comments** to see what others think
- **Leave comments** on articles you find interesting
- **Edit your posts** anytime from your dashboard

---

## ✨ Key Features

### 📖 **Browse & Discover Articles**
- Browse a beautiful grid of blog posts with images and AI-generated summaries
- **Search functionality** to find articles by title
- **Pagination** for easy navigation through posts
- Each post displays author name and publication date

### 🤖 **AI-Powered Summarization**
- Every article is automatically summarized using **Google GenAI**
- Clear visual indicator showing "AI Summarized" content
- Save time by quickly understanding article content

### 👤 **User Authentication**
- Secure login and registration with **Supabase**
- Create your own account to start publishing
- Session management with server-side authentication

### ✍️ **Create & Edit Articles**
- Write new blog posts with a simple, intuitive editor
- Upload article images for visual appeal
- Edit your own articles anytime
- Automatic AI summarization for new posts

### 💬 **Community Engagement**
- Comment on articles to join the discussion
- Read insights from other users
- Build a community around topics you care about

### 🛡️ **Admin Controls**
- Admin panel to manage user roles and permissions
- Control access and moderate content
- User role management system

### 🎨 **Modern User Interface**
- Sleek, dark-themed design with glassmorphism effects
- Smooth animations and transitions
- Fully responsive - works perfectly on mobile, tablet, and desktop
- Built with **Tailwind CSS** for beautiful styling

---


## 🛠️ Installation & Development

### Prerequisites
- Node.js 18+ installed on your computer
- npm, yarn, pnpm, or bun package manager
- Git (optional, for version control)

### Setup Instructions

1. **Clone or download the project**
   ```bash
   git clone <repository-url>
   cd Hivion-Automation
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   - Create a `.env.local` file in the root directory
   - Add your Supabase credentials:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```
   - Add your Google GenAI API key:
     ```
     GOOGLE_API_KEY=your_google_api_key
     ```

4. **Set up the database**
   - Create a Supabase project at [supabase.com](https://supabase.com)
   - Run the migrations (instructions in `docs/` folder)
   - Ensure you have `posts`, `users`, and `comments` tables

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open in browser**
   - Navigate to [http://localhost:3000](http://localhost:3000)
   - You should see the homepage with blog posts

---

## 📁 Project Structure

```
Hivion-Automation/
├── src/
│   ├── app/               # Next.js app directory
│   │   ├── (auth)/       # Authentication pages (login, register)
│   │   ├── post/         # Post-related pages
│   │   ├── admin/        # Admin panel
│   │   ├── api/          # API routes
│   │   └── layout.tsx    # Main layout
│   ├── components/        # Reusable React components
│   │   └── Navbar.tsx    # Navigation component
│   └── utils/            # Utility functions
│       └── supabase/     # Supabase client setup
├── public/               # Static assets (images, icons)
├── package.json          # Project dependencies
├── tsconfig.json         # TypeScript configuration
└── tailwind.config.js    # Tailwind CSS configuration
```

---

## 🏗️ Building for Production

### Build the project
```bash
npm run build
```

### Start production server
```bash
npm start
```

---

## 🛠️ Technologies Used

- **Next.js 16** - Modern React framework
- **React 19** - UI library
- **TypeScript** - Type-safe JavaScript
- **Supabase** - Backend & database
- **Google GenAI** - AI summarization
- **Tailwind CSS** - Styling
- **Lucide React** - Beautiful icons

---

## 📝 Available Scripts

```bash
# Development server (hot reload)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run ESLint to check code quality
npm run lint
```

---

## 🤝 Contributing

We welcome contributions! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Make your changes
4. Commit (`git commit -m 'Add AmazingFeature'`)
5. Push to branch (`git push origin feature/AmazingFeature`)
6. Open a Pull Request

---

## 📖 Learn More

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features
- [Supabase Docs](https://supabase.com/docs) - Learn about Supabase
- [Tailwind CSS](https://tailwindcss.com/docs) - Styling documentation
- [Google GenAI API](https://ai.google.dev) - AI summarization API

---

## 🐛 Troubleshooting

### "Error loading posts"
- Ensure Supabase database is properly configured
- Check that environment variables are correctly set
- Verify database tables exist and have data

### Posts not being summarized
- Verify Google GenAI API key is correct
- Check API quota hasn't been exceeded
- Review API logs in Google Cloud Console

### Login/Registration not working
- Confirm Supabase credentials are correct
- Check that auth tables exist in database
- Verify email verification is not blocking access

---

## 📞 Support & Feedback

- Report bugs by opening an issue on GitHub
- Have questions? Check the discussions section
- Want to suggest a feature? We'd love to hear it!

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Happy blogging! 🎉** Start exploring amazing articles and share your thoughts with our community.

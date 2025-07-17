# 🎬 MovieFlix - React Movie Discovery App

A simple movie discovery app built with React 19, Vite, and Tailwind CSS. Search for movies and view trending titles using the TMDB API.

## 🌟 Live Demo

**🚀 [Visit Deployed Site](https://movie-flix-1.vercel.app/) 🚀**

![MovieFlix Preview](public/hero.png)

## ✨ Features
- 🔍 Search for movies in real-time
- 📈 View trending movies (based on your search history if using Appwrite)
- 📱 Responsive design
- ⚡ Fast performance with Vite

## 🛠️ Tech Stack
- React 19
- Vite
- Tailwind CSS v4
- TMDB API
- Appwrite (optional)

## 🚀 Quick Start

1. **Clone and install**
   ```bash
   git clone https://github.com/your-username/movieflix.git
   cd movieflix
   npm install
   ```

2. **Add your TMDB API key**
   
   Create `.env.local` file:
   ```env
   VITE_TMDB_API_KEY=your_api_key_here
   
   # Optional: For search analytics and trending based on searches
   # VITE_APPWRITE_PROJECT_ID=your_project_id
   # VITE_APPWRITE_DATABASE_ID=your_database_id  
   # VITE_APPWRITE_COLLECTION_ID=your_collection_id
   ```
   Get your API key from [TMDB](https://www.themoviedb.org/settings/api) | [Appwrite](https://appwrite.io/)

3. **Run the app**
   ```bash
   npm run dev
   ```

## 📦 Build for Production
```bash
npm run build
npm run preview
```

## 🌐 Deploy to Vercel
1. Push to GitHub
2. Connect repository to [Vercel](https://vercel.com)
3. Add `VITE_TMDB_API_KEY` environment variable
4. Deploy!

> **Note:** For production deployment, only add the TMDB API key. Appwrite variables are optional and only needed for local development with search analytics.

---
*Practice project for learning React and modern web development*

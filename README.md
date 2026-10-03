# 🔗 URL Shortener

A full-stack URL shortening application built with **React** and **FastAPI** that allows authenticated users to create, manage, and track shortened URLs.

Users can generate unique short URLs, optionally choose custom aliases, track clicks, manage their URLs through a dashboard, and automatically expire links after 30 days.

## 🚀 Live Demo

**Frontend:** https://urlshortener-frontend-1uyh.onrender.com

**Backend API:** https://urlshortener-api-jra0.onrender.com

## ✨ Features

- 🔐 User registration and JWT-based authentication
- 🔗 Create shortened URLs
- ✏️ Custom URL aliases
- ⏳ Automatic 30-day URL expiration
- 📊 Dashboard with URL and click statistics
- 👤 User profile
- 🗑️ Delete shortened URLs
- 🔑 Change password
- 📈 Track total clicks
- 🚫 Maximum of 20 stored URLs per user
- 🔄 Scheduled cleanup of expired URLs
- 📱 Responsive frontend
- ☁️ Deployed frontend and backend


## 🛠️ Tech Stack

### Frontend
- React
- React Router
- Axios
- Custom CSS

### Backend
- FastAPI
- SQLAlchemy
- Pydantic
- JWT Authentication
- pwdlib

### Database
- PostgreSQL
- Alembic

### Deployment & Infrastructure
- Render
- GitHub Actions
- Neon PostgreSQL


## ⚙️ How It Works

1. User creates an account and logs in.
2. The frontend sends the long URL to the FastAPI backend.
3. The backend validates the request and generates a unique short code or validates the requested custom alias.
4. The URL is stored in PostgreSQL with a 30-day expiration time.
5. Visiting the short URL resolves the stored URL.
6. The click count is updated and the user is redirected to the original URL.
7. Users can manage their URLs and view statistics from the dashboard.
8. Expired URLs are periodically removed using a GitHub Actions scheduled job.
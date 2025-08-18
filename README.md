<<<<<<< HEAD
# 🌟 LightUp - Catholic Youth Platform

> **Empowering Catholic youth to deepen their faith, build authentic community, and discover their purpose through meaningful connections and spiritual growth tools designed for the digital age.**

[![Next.js](https://img.shields.io/badge/Next.js-14.2.16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.3.1-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-orange?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-blue?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

## 🎯 **About LightUp**

LightUp is a modern, comprehensive platform designed specifically for Catholic youth to connect, grow in faith, and build meaningful relationships. Built with cutting-edge web technologies, it provides a safe, engaging digital space where young Catholics can explore their faith, connect with peers, and access spiritual resources.

## ✨ **Key Features**

### 🙏 **Spiritual Growth**
- **Daily Bible Verse** - Youth-focused scripture with daily rotation and relevant reflections
- **Faith Challenge** - Interactive quizzes covering Catholic teachings, saints, and faith fundamentals
- **FaithBot AI** - Intelligent AI assistant for faith-related questions and spiritual guidance
- **Prayer Wall** - Share prayer requests and pray for others in the community

### 👥 **Community & Connection**
- **Youth Group Finder** - Discover and connect with Catholic youth groups in your area
- **Parish Calendar** - Stay updated with local Catholic events and activities
- **Community Forums** - Engage in meaningful discussions about faith and life
- **Real-time Notifications** - Stay connected with your faith community

### 📱 **Modern User Experience**
- **Responsive Design** - Optimized for all devices (mobile, tablet, desktop)
- **Progressive Web App** - Install as a native app on your device
- **Dark/Light Themes** - Comfortable viewing in any lighting condition
- **Accessibility First** - Designed with inclusive design principles

## 🚀 **Technology Stack**

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Backend**: Supabase (Database, Authentication, Real-time)
- **UI Components**: Radix UI, Lucide Icons
- **Deployment**: Vercel
- **Package Manager**: pnpm

## 🏗️ **Architecture**

```
LightUp/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Protected dashboard
│   └── ...                # Other pages
├── components/            # Reusable UI components
├── lib/                   # Utilities and configurations
├── contexts/              # React contexts
└── hooks/                 # Custom React hooks
```

## 🚀 **Getting Started**

### **Prerequisites**
- Node.js 18+ 
- pnpm (recommended) or npm
- Supabase account

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/lightup-catholic-youth.git
   cd lightup-catholic-youth
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Fill in your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Set up database**
   - Run the SQL scripts in your Supabase SQL Editor:
     - `scripts/create-complete-database.sql`
     - `scripts/create-quiz-database.sql`

5. **Run development server**
   ```bash
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🧪 **Available Scripts**

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## 🌐 **Deployment**

### **Vercel (Recommended)**

1. **Push to GitHub**
2. **Connect to Vercel**
3. **Set environment variables**
4. **Deploy!**

### **Environment Variables for Production**
Set these in your Vercel dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_APP_URL`

## 🔒 **Security Features**

- **Row Level Security (RLS)** - Database-level access control
- **JWT Authentication** - Secure user sessions
- **Protected Routes** - Middleware-based route protection
- **Input Validation** - Zod schema validation
- **CORS Protection** - Secure API endpoints

## 📱 **Progressive Web App Features**

- **Offline Support** - Core functionality works without internet
- **Install Prompt** - Add to home screen
- **Push Notifications** - Stay updated with community activity
- **Background Sync** - Sync data when connection returns

## 🤝 **Contributing**

We welcome contributions from the Catholic community! Please read our contributing guidelines and code of conduct.

### **How to Contribute**
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 **Support & Community**

- **Discussions**: [GitHub Discussions](https://github.com/yourusername/lightup-catholic-youth/discussions)
- **Issues**: [GitHub Issues](https://github.com/yourusername/lightup-catholic-youth/issues)
- **Documentation**: [Wiki](https://github.com/yourusername/lightup-catholic-youth/wiki)

## 🌟 **Acknowledgments**

- **Next.js Team** - For the amazing framework
- **Supabase Team** - For the powerful backend platform
- **Catholic Community** - For inspiration and feedback
- **Open Source Contributors** - For the amazing tools we use

## 📊 **Project Status**

- **Version**: 3.0.0
- **Status**: Production Ready
- **Last Updated**: December 2024
- **Maintainers**: [Your Name/Team]

---

**Made with ❤️ for the Catholic Youth Community**

*"Let no one despise you for your youth, but set the believers an example in speech, in conduct, in love, in faith, in purity." - 1 Timothy 4:12*
=======
# LighUp
LightUp - Catholic Youth Platform | Faith, Community &amp; Spiritual Growth
>>>>>>> 29c04eed029736fbb3c3fa18e26970649a50c3fb

# TinyURL Clone with Advanced Analytics

A full-stack URL shortener application built with Node.js, Express, React, and MongoDB. This project allows users to create short URLs, track clicks, and analyze traffic with detailed analytics.

## 🚀 Features

- **URL Shortening**: Convert long URLs into short, shareable links
- **User Authentication**: Secure signup and login system
- **Link Management**: View, create, and manage your shortened URLs
- **Advanced Analytics**:
  - Track total clicks per link
  - Analyze traffic by day of week
  - Monitor performance with interactive charts
- **Targeted Links**: Create multiple redirects from a single short URL
- **Responsive Design**: Works on desktop and mobile devices

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Vite, Chart.js
- **Backend**: Node.js, Express
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Styling**: CSS Modules

## 📊 Analytics Dashboard

The application includes a comprehensive dashboard that shows:
- Total clicks per link
- Click distribution by day of week
- Target-specific analytics
- Interactive charts and visualizations

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB
- npm or yarn

### Installation
1. Clone the repository
   ```bash
   git clone https://github.com/YOUR_USERNAME/my-tinyurl-app.git
   cd my-tinyurl-app
   ```
2. Install dependencies:
   ```bash
   # Install client dependencies
   cd tinyurl-client
   npm install
   
   # Install server dependencies
   cd ../TinyUrlServer
   npm install
   ```
3. Set up environment variables:
   - Create `.env` files in both `tinyurl-client` and `TinyUrlServer` directories
   - See `.env.example` for required variables

4. Start the development servers:
   ```bash
   # In one terminal (backend)
   cd TinyUrlServer
   npm run dev
   
   # In another terminal (frontend)
   cd ../tinyurl-client
   npm run dev
   ```

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Happy URL shortening! 🚀

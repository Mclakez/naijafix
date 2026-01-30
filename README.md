# NaijaFix

A platform connecting Nigerians with trusted local service providers for home repairs, maintenance, and professional services.

## 📖 About The Project

NaijaFix is a web application designed to bridge the gap between homeowners and reliable service providers in Nigeria. Whether you need a plumber, electrician, carpenter, or any other professional service, NaijaFix makes it easy to find, book, and manage service requests in your local area.

### Key Features

- **Service Provider Directory** - Browse and search for verified professionals by category and location
- **Real-time Booking System** - Schedule appointments and get instant confirmation
- **User Reviews & Ratings** - Make informed decisions based on community feedback
- **Secure Messaging** - Communicate directly with service providers
- **Service Tracking** - Monitor the status of your requests from booking to completion
- **Mobile Responsive Design** - Access the platform seamlessly on any device

## 🛠️ Built With

### Frontend
- **HTML5** - Semantic markup structure
- **CSS3** - Custom styling and animations
- **JavaScript (ES6+)** - Interactive functionality
- **Tailwind CSS** - Utility-first styling framework

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **TypeScript** - Type-safe code (where applicable)

### Additional Tools
- **Git** - Version control
- **npm** - Package management

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher) - [Download here](https://nodejs.org/)
- npm (comes with Node.js)
- Git - [Download here](https://git-scm.com/)

### Installation

Follow these steps to get NaijaFix running on your local machine:

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/naijafix.git
   cd naijafix
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory and add:
   ```env
   PORT=3000
   DATABASE_URL=your_database_connection_string
   JWT_SECRET=your_secret_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:3000`

## 📁 Project Structure

```
naijafix/
├── public/              # Static files (images, icons, etc.)
│   ├── css/            # Compiled CSS files
│   ├── js/             # Client-side JavaScript
│   └── images/         # Image assets
├── src/                # Source files
│   ├── controllers/    # Request handlers
│   ├── models/         # Data models
│   ├── routes/         # API routes
│   ├── middleware/     # Custom middleware
│   ├── utils/          # Helper functions
│   └── views/          # HTML templates
├── config/             # Configuration files
├── tests/              # Test files
├── .env.example        # Environment variables template
├── .gitignore          # Git ignore rules
├── package.json        # Project dependencies
└── README.md           # This file
```

## 💻 Usage

### For Users

1. **Create an Account** - Sign up with your email and create a profile
2. **Search for Services** - Browse categories or search for specific services
3. **View Provider Profiles** - Check ratings, reviews, and service details
4. **Book a Service** - Select a date/time and confirm your booking
5. **Track Progress** - Monitor your service request status
6. **Leave a Review** - Share your experience after service completion

### For Service Providers

1. **Register as a Provider** - Apply to join the platform
2. **Complete Your Profile** - Add services, rates, and availability
3. **Receive Booking Requests** - Get notified of new opportunities
4. **Manage Appointments** - Accept or decline requests
5. **Build Your Reputation** - Collect reviews and grow your business

## 🎨 Design Philosophy

NaijaFix is built with **simplicity and usability** at its core:

- **Clean Interface** - No clutter, easy navigation
- **Mobile-First** - Optimized for smartphones first, then scaled up
- **Fast Loading** - Lightweight code, optimized images
- **Accessible** - Designed for users of all technical abilities
- **Local Context** - Tailored for Nigerian users and their needs

## 🔑 Key Technical Decisions

### Why Tailwind CSS?
Tailwind allows us to build custom designs quickly without writing tons of CSS. It keeps our styling consistent and makes the codebase easier to maintain.

### Why Express.js?
Express is lightweight, flexible, and has a huge ecosystem. It lets us build a robust backend without unnecessary complexity.

### Why TypeScript (where used)?
TypeScript helps catch errors early during development. It makes our code more predictable and easier to refactor as the project grows.

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Coding Standards

- Write clean, readable code
- Use meaningful variable and function names
- Comment complex logic
- Follow existing code style
- Test your changes before submitting

## 🐛 Known Issues

- Search functionality may be slow with large datasets (optimization in progress)
- Real-time notifications require page refresh (WebSocket integration planned)
- Mobile app version is under development

## 🗺️ Roadmap

### Phase 1 (Current)
- [x] Basic user registration and authentication
- [x] Service provider profiles
- [x] Booking system
- [ ] Payment integration

### Phase 2 (Planned)
- [ ] In-app messaging system
- [ ] Real-time notifications
- [ ] Advanced search filters
- [ ] Service provider verification system

### Phase 3 (Future)
- [ ] Mobile app (iOS & Android)
- [ ] Video consultation feature
- [ ] AI-powered service recommendations
- [ ] Multi-language support

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

**Your Name** - *Initial work* - [Your GitHub Profile](https://github.com/yourusername)

## 🙏 Acknowledgments

- Thanks to everyone who has contributed to this project
- Inspired by the need for reliable home services in Nigeria
- Built with the support of the Nigerian tech community

## 📞 Contact

Have questions or suggestions?

- **Email**: your.email@example.com
- **Twitter**: [@yourhandle](https://twitter.com/yourhandle)
- **Project Link**: [https://github.com/yourusername/naijafix](https://github.com/yourusername/naijafix)

## 🔧 Troubleshooting

### Common Issues

**Problem**: `npm install` fails
- **Solution**: Delete `node_modules` folder and `package-lock.json`, then run `npm install` again

**Problem**: Server won't start
- **Solution**: Check if another process is using port 3000. Change the PORT in your `.env` file

**Problem**: Database connection errors
- **Solution**: Verify your `DATABASE_URL` in the `.env` file is correct

---

Made with ❤️ for the Nigerian community

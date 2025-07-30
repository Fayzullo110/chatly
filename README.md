# Fyzoo

A modern, secure, and beautiful messaging platform for friends, teams, and communities.

## 🚀 Features

- 🔐 **Authentication**: Secure login and registration system with JWT
- 🌓 **Theme Switching**: Dark, light, and system theme support
- 💬 **Real-time Chat**: Instant messaging capabilities
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🎨 **Modern UI**: Beautiful Material-UI based interface
- 🔒 **Secure Backend**: Spring Boot with MySQL database

## 🛠 Tech Stack

### Frontend
- **React.js** - UI framework
- **Material-UI** - Component library
- **React Router** - Navigation
- **Axios** - HTTP client

### Backend
- **Spring Boot** - Java framework
- **MySQL** - Database
- **JWT** - Authentication
- **Maven** - Build tool

## 📁 Project Structure

```
fyzoo/
├── frontend/          # React.js frontend application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── contexts/       # React contexts (Auth, Theme)
│   │   ├── App.js         # Main app component
│   │   └── index.js       # App entry point
│   └── package.json
├── backend/           # Spring Boot backend application
│   ├── src/main/java/
│   │   └── com/fyzoo/    # Java source code
│   └── pom.xml           # Maven configuration
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v14 or higher)
- **Java 11** or higher
- **MySQL** database
- **npm** or **yarn**

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view the app.

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Configure your MySQL database in `src/main/resources/application.properties`

3. Run the Spring Boot application:
   ```bash
   ./mvnw spring-boot:run
   ```

4. The backend will be available at [http://localhost:8080](http://localhost:8080)

## 🔧 Development

### Frontend Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App

### Backend Scripts

- `./mvnw spring-boot:run` - Runs the Spring Boot application
- `./mvnw test` - Runs tests
- `./mvnw clean install` - Builds the project

## 🌐 API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /profile` - Get user profile

### Chat
- `GET /chatrooms` - Get chat rooms
- `POST /chatrooms` - Create chat room
- `GET /messages/{roomId}` - Get messages for a room
- `POST /messages` - Send a message

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Fayzullo** - [GitHub](https://github.com/Fayzullo110)

---

⭐ Star this repository if you found it helpful! 
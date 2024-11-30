# ChatX - Real-Time Chat Application

![ChatX Logo](path_to_logo.png)

ChatX is a modern, real-time chat application built with React and Firebase. It offers a seamless messaging experience with features like user authentication, real-time messaging, and profile customization.

## Features

### Authentication
- Email/Password authentication
- Google Sign-In integration
- Protected routes for authenticated users
- User session management

### Chat Features
- Real-time messaging
- One-on-one chat conversations
- Last seen status
- Online/Offline status
- Message timestamps
- Chat history

### User Profile
- Customizable display names
- Profile pictures (upload & update)
- User status management
- Privacy settings

### UI/UX
- Modern, responsive design
- Dark/Light mode support
- Clean and intuitive interface
- Mobile-friendly layout
- Real-time notifications

## Technologies Used

- **Frontend:**
  - React.js
  - React Router DOM
  - Styled Components
  - React Icons

- **Backend/Services:**
  - Firebase Authentication
  - Firebase Firestore
  - Firebase Storage
  - Firebase Analytics

- **Development Tools:**
  - Create React App
  - npm/yarn
  - Git

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- npm or yarn
- Git

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/chatx.git
cd chatx
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a Firebase project and obtain your configuration:
   - Go to the Firebase Console
   - Create a new project
   - Enable Authentication (Email/Password and Google Sign-In)
   - Enable Firestore Database
   - Enable Storage
   - Copy your Firebase configuration

4. Create a `.env` file in the root directory and add your Firebase configuration:
```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

5. Start the development server:
```bash
npm start
# or
yarn start
```

## Project Structure

```
src/
├── components/        # React components
├── contexts/         # Context providers
├── utils/            # Utility functions
├── assets/           # Static assets
├── firebase.js      # Firebase configuration
└── App.js           # Main application component
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Firebase team for providing excellent documentation
- React community for creating amazing libraries
- All contributors who have helped shape this project

## Contact

Your Name - [@yourusername](https://twitter.com/yourusername)

Project Link: [https://github.com/yourusername/chatx](https://github.com/yourusername/chatx) 

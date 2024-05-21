# Connectify

## Overview

Connectify is a comprehensive social networking platform where users have complete control over their content. The platform fosters engagement and interaction within the community by offering a rich set of features. Users can create, read, update, and delete (CRUD) their posts, interact with posts through likes and comments, connect with other users, and share posts on various platforms including WhatsApp, LinkedIn, Telegram, and Twitter. Additionally, users can view their own and their friends' profiles to stay connected.

## Features

- **CRUD Operations**: Users can create, read, update, and delete their posts.
- **Post Upload**: Users can upload posts such as text/image/video to share content with the community.
- **Chat feature** Integrated real-time chat functionality using Socket.io, enabling seamless communication among users.
- **Push Notifications**: Enhanced user experience with push notifications for post engagement and profile activity and have personalized feeds.
- **Post Interaction**: Users can interact with posts by liking, commenting, and connecting with other users.
- **Post Sharing**: Users can share posts on various platforms including WhatsApp, LinkedIn, Telegram, and Twitter.
- **Profile Viewing**: Users can view their own and their friends' profiles to stay connected.

- **Secure Access Measures**: Implemented secure access measures such as OTP-based login and JWT authentication to ensure data confidentiality.

## Tech Stack

- **Frontend**: React.js, Redux, Material UI
- **Backend**: Node.js, Express.js
- **Database**: MongoDB

## Getting Started

To get started with Connectify, follow these steps:

1. Clone the repository: `git clone <repository-url>`
2. Navigate to the project directory: `cd <project-directory>`
3. Navigate to the server directory: `cd server`
4. Create a `.env` file in the server directory.
5. Add the following environment variables to the `.env` file:

   ```
   MONGO_URI=<your-mongo-uri>
   PORT=3001
   JWT_SECRET="<your-jwt-secret>"
   EMAIL=<your-email>
   PASSWORD=<your-password>
   ```

   Replace `<your-mongo-uri>` with your MongoDB URI, `<your-jwt-secret>` with your JWT secret, `<your-email>` with your email, and `<your-password>` with your password.

6. Navigate back to the project root directory: `cd ..`
7. Install dependencies: `npm install`
8. Start the development server: `npm start`

Now, you can access Connectify at `http://localhost:3001`.

## How to Contribute

Contributions are welcome and encouraged. To contribute to the project, follow these steps:

1. Fork the repository
2. Create a new branch: `git checkout -b feature-name`
3. Make your changes and commit them: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgements

- [Material-UI](https://material-ui.com/)
- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [React.js](https://reactjs.org/)
- [Redux](https://redux.js.org/)
- [MongoDB](https://www.mongodb.com/)

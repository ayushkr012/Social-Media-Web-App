# Connectify

## Overview

Connectify is a social media platform designed for seamless interaction and real-time communication using Socket.io. Users can create posts with text, images, or videos, like and comment on posts, follow friends, and build personalized profiles. The platform features push notifications for engagement and activity updates, along with personalized feeds. Secure access is ensured through OTP, JWT, and Google-based authentication, making Connectify a comprehensive and secure environment for online social networking.

## Features

- **CRUD Operations**: Users can create, read, update, and delete their posts.
- **Post Upload**: Users can upload posts such as text, images, and videos to share content with the community.
- **Chat Feature**: Integrated real-time chat functionality using Socket.io, enabling seamless communication among users.
- **Push Notifications**: Enhanced user experience with push notifications for post engagement and profile activity, along with personalized feeds.
- **Post Interaction**: Users can interact with posts by liking, commenting, and connecting with other users.
- **Post Sharing**: Users can share posts on various platforms including WhatsApp, LinkedIn, Telegram, and Twitter.
- **Profile Viewing**: Users can view their own and their friends' profiles to stay connected.
- **Secure Access Measures**: Implemented secure access measures such as OTP-based login , JWT authentication and Google-based authentication to ensure data confidentiality.


## Tech Stack

- **Frontend**: React.js, Redux
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Cloud Storage**: Cloudinary
- **Real-Time Communication**: Socket.io

## Getting Started

To get started with Connectify, follow these steps:

1. Clone the repository:
    ```sh
    git clone <repository-url>
    ```
2. Navigate to the project directory:
    ```sh
    cd <project-directory>
    ```
3. Navigate to the server directory:
    ```sh
    cd server
    ```
4. Create a `.env` file in the server directory and add the following environment variables:
    ```plaintext
    MONGO_URI=<your-mongo-uri>
    PORT=3001
    JWT_SECRET=<your-jwt-secret>
    EMAIL=<your-email>
    PASSWORD=<your-password>
    CLOUD_NAME=<your-cloudinary-cloud-name>
    CLOUD_API_KEY=<your-cloudinary-api-key>
    CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>
    ```
5. Start the server:
    ```sh
    npm start
    ```
    Your server should now be running on the specified port.

6. Open another terminal and navigate to the client directory:
    ```sh
    cd client
    ```
7. Create a `.env.local` file in the client directory and add the following environment variables:
    ```plaintext
    REACT_APP_CLOUDINARY_API_KEY=<your-cloudinary-api-key>
    REACT_APP_BACKEND_URL=http://localhost:3001
    ```
8. Install dependencies:
    ```sh
    npm install
    ```
9. Start the client application:
    ```sh
    npm start
    ```
    You can now access Connectify at `http://localhost:3001`.

## How to Contribute

Contributions are welcome and encouraged! To contribute to the project, follow these steps:

1. Fork the repository.
2. Create a new branch:
    ```sh
    git checkout -b feature-name
    ```
3. Make your changes and commit them:
    ```sh
    git commit -m 'Add some feature'
    ```
4. Push to the branch:
    ```sh
    git push origin feature-name
    ```
5. Submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgements

- [Material-UI](https://material-ui.com/)
- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [React.js](https://reactjs.org/)
- [Redux](https://redux.js.org/)
- [MongoDB](https://www.mongodb.com/)
- [Nodemailer](https://nodemailer.com/)


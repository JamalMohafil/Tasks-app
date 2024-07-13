# Tasks Application

![Tasks Application](https://i.ibb.co/3WxJJ9s/tasks-application.png)

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Introduction
Welcome to the **Tasks Application** - a comprehensive solution for managing tasks, creating workspaces, and enabling seamless communication through real-time chat functionalities. Designed to enhance productivity and collaboration, this application is perfect for teams of all sizes.

This project was developed entirely by me, leveraging modern web technologies to provide a robust and user-friendly experience.

## Features
- **Task Management**: Create, assign, and track tasks with ease.
- **Workspace Creation**: Organize your projects into different workspaces.
- **Real-time Chat**: Communicate with your team members instantly.
- **User Authentication**: Secure login and registration.
- **Notifications**: Stay updated with real-time notifications.
- **Responsive Design**: Fully responsive and optimized for all devices.

## Tech Stack
The Tasks Application is built using a modern and efficient tech stack:
- **Front-end**: 
  - [Next.js 14](https://nextjs.org/)
  - [Tailwind CSS](https://tailwindcss.com/) for styling
  - Context API for state management
- **Back-end**:
  - [Node.js](https://nodejs.org/)
  - [Express.js](https://expressjs.com/)
  - [Socket.io](https://socket.io/) for real-time chat functionality
- **Database**:
  - [MongoDB](https://www.mongodb.com/) for data storage

## Installation

### Prerequisites
- Node.js (>=14.x)
- npm (>=6.x) or yarn (>=1.x)
- MongoDB (for the backend)

### Clone the Repository
```sh
git clone https://github.com/your-username/tasks-application.git
cd tasks-application
Front-end Setup
sh

cd front-end
npm install
# or
yarn install
Back-end Setup
sh

cd ../back-end
npm install
# or
yarn install
Environment Variables
Create a .env file in the back-end directory and add the following variables:

env

MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=5000
Usage
Running the Front-end
sh

cd front-end
npm run dev
# or
yarn dev
Running the Back-end
sh

cd back-end
npm start
# or
yarn start
Accessing the Application
Open your browser and go to http://localhost:3000 for the front-end and http://localhost:5000 for the back-end API.

Project Structure
lua

tasks-application/
├── front-end/
│   ├── public/
│   ├── src/
│   ├── .env
│   ├── package.json
│   └── ...
└── back-end/
    ├── models/
    ├── controllers/
    ├── routes/
    ├── .env
    ├── package.json
    └── ...
Contributing
Contributions are welcome! Please fork the repository and create a pull request with your changes. Ensure that your code follows the project's coding standards and conventions.

Steps to Contribute
Fork the repository.
Create a new branch (git checkout -b feature/your-feature).
Commit your changes (git commit -am 'Add your feature').
Push to the branch (git push origin feature/your-feature).
Create a new Pull Request.
License
This project is licensed under the MIT License - see the LICENSE file for details.

Contact
If you have any questions or need further assistance, feel free to contact me at jamalgoving@gmail.com

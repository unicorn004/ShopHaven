# ShopHaven

ShopHaven is a fully functional e-commerce website built with Node.js, Express, MongoDB, and EJS. The application features user authentication, product management, and secure payment processing using Razorpay and Google OAuth.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)

## Features

- User authentication using Google OAuth
- Product listing and management
- Shopping cart functionality
- Secure payment integration with Razorpay
- Admin dashboard for managing products and orders
- Responsive design for both desktop and mobile

## Technologies Used

- **Node.js**: JavaScript runtime for server-side development
- **Express**: Web application framework for Node.js
- **MongoDB**: NoSQL database for storing product and user information
- **EJS**: Templating engine for rendering HTML pages
- **Razorpay**: Payment gateway for handling transactions
- **Passport.js**: Middleware for authentication
- **Express-Session**: Middleware for session management
- **dotenv**: For managing environment variables
- **Cookie-Parser**: Middleware for cookie handling

## Installation

To set up the project locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/ShopHaven.git

2. Navigate into the project directory:
     cd ShopHaven

3. Install the required dependencies:
     npm install

4. Create a .env file in the root directory and add the necessary environment variables:
      SESSION_SECRET=your_session_secret
      MONGODB_URI=your_mongodb_connection_string
      GOOGLE_CLIENT_ID=your_google_client_id
      GOOGLE_CLIENT_SECRET=your_google_client_secret

5. Start the application:
    npm start

6. Open your browser and visit http://localhost:3000 to see the application in action.

## Usage
- Home Page: Browse products and add them to your cart.
- User Authentication: Sign up or log in using Google OAuth.
- Admin Dashboard: Manage products and orders through the admin routes.
- Checkout: Complete your purchase using Razorpay.

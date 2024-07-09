# Support Ticket Microservice

This is a microservice for managing customer support tickets. It includes features for creating, updating, deleting, and assigning tickets to users, as well as updating ticket statuses. The system uses MongoDB for data storage and includes JWT-based authentication with role-based access control. Users are notified of ticket assignments or status changes via email or real-time notifications using WebSockets.

## Features

- User registration and authentication
- Role-based access control (customers, agents, admins)
- Create, update, delete, and assign support tickets
- Update ticket statuses
- Notification system for ticket assignments and status changes
- API documentation using Swagger

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (version 14 or higher)
- [MongoDB](https://www.mongodb.com/)
- [Docker](https://www.docker.com/) (optional, for containerized deployment)
- [Docker Compose](https://docs.docker.com/compose/) (optional, for containerized deployment)

### Clone the Repository

```bash
git clone https://github.com/ahmedX999/customer-support-tickets-api.git
cd customer-support-tickets-api
```

### Set Up Environment Variables

Create a `.env` file in the root directory and add your environment variables:

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.lzabahv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your_jwt_secret_key
EMAIL_USER=your_email@email-provider.com
EMAIL_PASS=your_email_password
```

### Install Dependencies

```bash
npm install
```

### Running the Application

#### With Node.js

```bash
npm start
```

#### With Nodemon (for development)

```bash
npm run dev
```

#### With Docker Compose

Ensure Docker and Docker Compose are installed and set Environment Variables in docker-compose.yml . Then run:

```bash
docker-compose up --build -d
```

This command will build the Docker image and start the container.

## API Documentation

The API documentation is available at `/api-docs` once the server is running. It is generated using Swagger.


## Environment Variables

- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT authentication
- `EMAIL`: Email address for sending notifications
- `PASSWORD`: Email account password for sending notifications
- `PORT`: Port number on which the server runs (default is 5001)

## Deployment


### Vercel

1. **Install Vercel CLI:**

    ```bash
    npm install -g vercel
    ```

2. **Login to Vercel:**

    ```bash
    vercel login
    ```

3. **Deploy with Vercel:**

    ```bash
    vercel --prod
    ```

4. **Set Environment Variables in Vercel Dashboard:**

    - `MONGO_URI`
    - `JWT_SECRET`
    - `EMAIL_USER`
    - `EMAIL_PASS`

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any changes.


### Summary

- The `README.md` provides a comprehensive overview of the project, including setup, installation, and deployment instructions.
- It covers environment variables and provides detailed steps for running the application with Node.js, Nodemon, and Docker Compose.
- Deployment instructions for Heroku and Vercel are included, ensuring the application can be easily deployed and managed.
- API documentation information is provided to help users understand and interact with the API endpoints.

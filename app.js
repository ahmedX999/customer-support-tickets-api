const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Database connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

// Routes
const userRoutes = require('./routes/userRoutes');
const ticketRoutes = require('./routes/ticketRoutes');

app.use('/api/users', userRoutes);
app.use('/api/tickets', ticketRoutes);
app.get('/', (req, res) => {
  res.send('Welcome to the Support Ticket Service API');
});

// CDN CSS
const CSS_URL = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.3.0/swagger-ui.min.css";

// Swagger setup
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Support Ticket API',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Ticket: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Ticket ID',
            },
            title: {
              type: 'string',
              description: 'Title of the ticket',
            },
            description: {
              type: 'string',
              description: 'Description of the ticket',
            },
            status: {
              type: 'string',
              enum: ['open', 'pending', 'closed'],
              description: 'Status of the ticket',
            },
            assignedTo: {
              type: 'string',
              description: 'User ID the ticket is assigned to',
            },
            createdBy: {
              type: 'string',
              description: 'User ID who created the ticket',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation time of the ticket',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update time of the ticket',
            },
          },
          required: ['title', 'description', 'createdBy'],
        },
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'User ID',
            },
            name: {
              type: 'string',
              description: 'Name of the user',
            },
            email: {
              type: 'string',
              description: 'Email of the user',
            },
            password: {
              type: 'string',
              description: 'Password of the user',
            },
            role: {
              type: 'string',
              enum: ['customer', 'agent', 'admin'],
              description: 'Role of the user in the system',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation time of the user',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update time of the user',
            },
          },
          required: ['name', 'email', 'password', 'role'],
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./routes/*.js'], // files containing annotations as above
};

const swaggerSpec = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { customCss: CSS_URL }));

module.exports = app;

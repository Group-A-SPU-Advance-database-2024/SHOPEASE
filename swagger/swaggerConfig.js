// swagger/swaggerConfig.js
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Shopease API Documentation',
      version: '1.0.0',
      description: 'API documentation for Shopease application',
    },
    servers: [
      {
        url: 'http://localhost:3000', // Replace with your server URL
      },
    ],
  },
  apis: ['./routes/*.js'], // Path to the API route files
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

module.exports = {
  swaggerOptions,
  swaggerSpec,
  serveSwagger: swaggerUi.serve,
  setupSwagger: swaggerUi.setup(swaggerSpec),
};

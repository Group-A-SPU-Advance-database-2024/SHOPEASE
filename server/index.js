const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const productsRouter = require('../routes/products');
const db = require('./db'); // Adjust path if necessary
const killPort = require('kill-port');

const app = express();

// Middleware


app.use(bodyParser.json());
app.use(cors());

// Swagger configuration
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'ShopEase API',
            version: '1.0.0',
            description: 'API documentation for ShopEase',

        },
        servers: [
            {
                url: 'http://localhost:3000',
            },
        ],
    },
    apis: ['../routes/*.js'], // Adjust path to your route files
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
const PORT = process.env.PORT || 3000;

// Function to kill process using PORT
async function killProcessOnPort(port) {
    try {
        await killPort(port);
        console.log(`Existing process on port ${port} killed.`);
    } catch (err) {
        console.error(`Error killing process on port ${port}:`, err);
    }
}

// Kill existing process on PORT before starting server
killProcessOnPort(PORT).then(() => {
    // Serve Swagger UI at /api-docs endpoint
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    // Routes
    app.use('/api/products', productsRouter);

    // Start server
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
});

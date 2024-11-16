const swaggerJSDoc = require('swagger-jsdoc');


const swaggerDefinition = { 
    openapi: '3.0.0',
    info: {
        title: 'Backend API Testing for Assignment',
        version: '1.0.0',
        description: 'This is a REST API application made with Express. It retrieves data from MongoDB.'
    },
    servers: [
        {
            url: 'https://user-assignment.onrender.com'
        }
    ],
    components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
    },
    
};

const options = {
    swaggerDefinition,
    apis: ['./routes/*.js']
};

module.exports = swaggerJSDoc(options);

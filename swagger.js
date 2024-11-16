const swaggerJSDoc = require('swagger-jsdoc');


const swaggerDefinition = { 
    openapi: '3.0.0',
    info: {
        title: 'Express API for Assignment',
        version: '1.0.0',
        description: 'This is a REST API application made with Express. It retrieves data from MongoDB.'
    },
    servers: [
        {
            url: 'http://localhost:3000'
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

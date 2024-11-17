"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
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
exports.default = (0, swagger_jsdoc_1.default)(options);

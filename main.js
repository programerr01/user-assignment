const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require('./swagger');

require("dotenv").config();

const connectToDatabase= require("./lib/mongoose");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

connectToDatabase().then((res)=>{
    console.log("Connected to database");
})


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.use("/user",userRoutes);
app.use("/admin",adminRoutes);


app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
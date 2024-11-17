import express, { Request, Response } from "express";
const app = express();
import bodyParser from "body-parser";
import swaggerUi from "swagger-ui-express";
import swaggerSpec  from "./swagger";

import dotenv from "dotenv";
dotenv.config();
import connectToDatabase  from "./lib/mongoose";
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

connectToDatabase().then((res: any)=>{
    console.log("Connected to database");
})

app.get("/", (req: Request, res : Response) => {
    res.redirect("/docs");
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.use("/user",userRoutes);
app.use("/admin",adminRoutes);


app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
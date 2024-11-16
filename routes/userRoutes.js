const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authenticate = require("../lib/auth");
const Assignment = require("../models/Assignment");
const router = express.Router();


const SALT_ROUNDS = 10;

router.get("/", (req, res) => {
    res.send("Test Endpoint");
});

/**
 * @swagger
 * /user/signup:
 *   post:
 *     summary: User signup(Admin or User)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               isAdmin:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 */

router.post("/signup", async (req, res) => {
    const { email, password, isAdmin=false } = req.body;
    if (!email || !password) {
        return res.status(400).send({success:false,message:"Email and Password are required!"});
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).send({success:false,message:"Invalid email format"});
    }


    try {
        const existing_user = await User.findOne({ email });
        if(existing_user){
            return res.status(400).json({success:false,message:"User already exists"});
        }
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        const user = new User({ email, password: hashedPassword,isAdmin });
        await user.save();
        res.json({success:true,message:"User created successfully"});
    } catch (err) {
        res.status(500).json({success:false,message:"Some Issue, Please Try again later !"});
    }
});

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: User login(Admin or User)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User login successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 */
router.post("/login",async (req,res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send({success:false,message:"Email and Password are required!"});
    }
    try {
        const existing_user = await User.findOne({ email });
        if(!existing_user){
            return res.status(400).json({success:false,message:"Either email or password is incorrect"});
        }
        const isValid = await bcrypt.compare(password, existing_user.password);
        if(!isValid){
            return res.status(400).json({success:false,message:"Either email or password is incorrect"});
        }
        // send jwt token 
        const token = jwt.sign({ id: existing_user._id, isAdmin:existing_user.isAdmin }, (process.env.JWT_SECRET || "appCode23"), { expiresIn: "1h" });
        res.json({ success: true, message:"User login successfully", token });
    } catch (err) {
        res.status(500).json({success:false,message:"Some Issue, Please Try again later !"});
    }
})

/**
 * @swagger
 * /user/assignments:
 *   get:
 *     summary: Get pending assignments for the authenticated user
 *     description: Provide an Authentication Bearer Token in headers.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Assignments fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 assignments:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       user:
 *                         type: string
 *                       admin:
 *                         type: string
 *                       status:
 *                         type: string
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 */
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MzgzNTg5NThiMTE3NDk1ODBmNTgzYSIsImlzQWRtaW4iOmZhbHNlLCJpYXQiOjE3MzE3MzY5NzksImV4cCI6MTczMTc0MDU3OX0.vTd4cZKEr52IZYRiIVMW6zUdEk9UQ1nEoRSy3mk13xU
router.get('/assignments', authenticate, async (req, res) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = await jwt.verify(token, (process.env.JWT_SECRET || "appCode23"));
    
    if(decoded.isAdmin){
        return res.status(400).json({success:false,message:"Admin can't access this endpoint"});
    }
    try{
        const assignments = await Assignment.find({user:decoded.id,status:"pending"});
        res.json({success:true,message:"Assignments fetched successfully",assignments});
    }
    catch(err){
        console.log(err);
        res.status(500).json({success:false,message:"Some Issue, Please Try again later !"});
    }
});


/**
 * @swagger
 * /user/assignment:
 *   post:
 *     summary: Submit an assignment
 *     description: Provide an Authentication Bearer Token in headers.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the assignment
 *               admin:
 *                 type: string
 *                 description: Admin responsible for the assignment
 *     responses:
 *       200:
 *         description: Assignment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 */

router.post('/assignment', authenticate, async (req, res) => {
    const  { title,admin } = req.body;

    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = await jwt.verify(token, (process.env.JWT_SECRET || "appCode23"));
    try{
        const submitted_user = await User.findById(decoded.id);
        if(!submitted_user){
            return res.status(400).json({success:false,message:"User not found"});
        }
        if(submitted_user.isAdmin){
            return res.status(400).json({success:false,message:"Admin can't submit assignment"});
        }
        const admin_user = await User.findById(admin);
        if(!admin_user || (admin_user && !admin_user.isAdmin)){
            return res.status(400).json({success:false,message:"Admin not found"});
        }
    }
    catch(err){
        return res.status(400).json({success:false,message:"Invalid user"});
    }

    try{
        const assignment = new Assignment({ title, user: decoded.id, admin });
        await assignment.save();
        res.json({ success: true, message: "Assignment created successfully" });
    }
    catch(err){
        console.log(err)
        res.status(500).json({success:false,message:"Some Issue, Please Try again later !"});
    }
});

module.exports = router;
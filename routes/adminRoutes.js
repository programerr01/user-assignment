const express = require('express'); 
const authenticate = require('../lib/auth');
const jwt = require("jsonwebtoken");
const Assignment = require('../models/Assignment');
const router = express.Router();


router.get("/", (req, res) => { 
    res.send("Test Endpoint");
});

/**
 * @swagger
 * /admin/assignments:
 *   get:
 *     summary: Retrieve all assignments assigned to the authenticated admin
 *     tags: [Assignments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of assignments
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
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

router.get('/assignments', authenticate,async (req, res) => {   
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = await jwt.verify(token, (process.env.JWT_SECRET || "appCode23"));

    try{
        const assignments = await Assignment.find({admin:decoded.id,status:"pending"});
        res.json({success:true,message:"Assignments fetched successfully",assignments});
    }
    catch(err){
        console.log(err);
        res.status(500).json({success:false,message:"Some Issue, Please Try again later !"});
    }
});

/**
 * @swagger
 * /admin/assignment/{id}/{status}:
 *   post:
 *     summary: Accept or reject an assignment
 *     tags: [Assignments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The assignment ID
 *       - in: path
 *         name: status
 *         schema:
 *           type: string
 *         required: true
 *         description: The status to update (accept or reject)
 *     responses:
 *       200:
 *         descri qption: Assignment status updated successfully
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
 *         description: Invalid request or assignment not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post('/assignment/:id/:status', authenticate, async (req, res) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = await jwt.verify(token, (process.env.JWT_SECRET || "appCode23"));
    const { id, status } = req.params;

    if(!id || !status || (status !== "accept" && status !== "reject")){
        return res.status(400).json({success:false,message:"Invalid request"});
    }   

    try{
        const assignment = await Assignment.findOne({_id:id});
        if(!assignment){
            return res.status(400).json({success:false,message:"Assignment not found"});
        }
        if(assignment.admin.toString() !== decoded.id.toString()){
            return res.status(401).json({success:false,message:"You are not authorized to perform this action"});
        }
        assignment.status = status;
        await assignment.save();
        res.json({success:true,message:"Assignment status updated successfully"});
    }
    catch(err){
        console.log(err);
        res.status(500).json({success:false,message:"Some Issue, Please Try again later !"});
    }
});

module.exports = router;

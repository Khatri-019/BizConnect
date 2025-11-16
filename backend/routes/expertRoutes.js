// To Try -> custom middleware and pass it before going to a particular route 

import express from "express";
import Expert from "../models/expert.js";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    // Expert.find({}) fetches all documents in the 'experts' collection.
    const experts = await Expert.find({});

    // Send the fetched data back as a JSON response
    res.status(200).json(experts);
    // res.send(experts);
  } catch (error) {
    console.error(`Error fetching experts: ${error.message}`);
    res.status(500).json({ message: "Server Error: Could not fetch experts" });
  }
});

router.post("/", async (req, res) => {
  try {
    const newExpert = new Expert(req.body);

    // Save the new expert to the database
    const createdExpert = await newExpert.save();

    res.status(201).json(createdExpert);
    // res.send('Expert Created ');
  } catch (error) {
    console.error(`Error creating expert: ${error.message}`);
    res.status(500).json({ message: "Server Error: Could not create expert" });
  }
});


export default router

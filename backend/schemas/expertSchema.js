import mongoose from "mongoose";

const expertSchema = new mongoose.Schema(
  {
    _id : {
      type: String,
      required : [true, "Please add a id for expert"]
    },
    img: {
        type : String,
        required : [true, "Please add a image"]
    },
    name: {
      type: String,
      required: [true, "Please add a name"],
      trim: true,
    },
    industry: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    experienceYears: {
      type: Number,
      required: [true, "Please add years of experience"],
    },
    description: {
      type: String,
      trim: true,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
    },
    pricing: {
      type: Number,
      required: [true, "Please add a pricing value"],
    },
  },
  {
    // timestamps: true ,automatically adds 'createdAt' and 'updatedAt' fields
    timestamps: true,
  }
);

export default expertSchema;

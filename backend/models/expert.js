import mongoose from "mongoose";
import expertSchema from "../schemas/expertSchema.js";


const Expert = mongoose.model("Expert", expertSchema);
export default Expert;

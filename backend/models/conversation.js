import mongoose from "mongoose";
import conversationSchema from "../schemas/conversationSchema.js";

const Conversation = mongoose.model("Conversation", conversationSchema);
export default Conversation;


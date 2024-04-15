import express from "express";
import { newConversation, getConversation } from "../controllers/conversation.js";

const conversation = express.Router();

conversation.post('/add', newConversation);
conversation.post('/get', getConversation);

export default conversation;
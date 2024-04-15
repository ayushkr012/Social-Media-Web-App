import express from "express";
import { newMessage, getmsg } from "../controllers/message.js";

const msg = express.Router();

msg.post('/add', newMessage);
msg.get('/get/:id', getmsg);

export default msg;
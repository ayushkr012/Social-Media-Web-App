import Message from "../models/Message.js"
import Conversation from "../models/Conversation.js";

export const newMessage = async (request, response) => {
    try{
        const newmsg = new Message(request.body);
        await newmsg.save();
        await Conversation.findByIdAndUpdate(request.body.conversationId, { message: request.body.text});
        return response.status(200).json('Msg sent successfully');
    }catch(error){
        return response.status(500).json(error.message);
    }
}

export const getmsg = async(request,response) => {
    try{
        const msgs = await Message.find({ conversationId: request.params.id});
        return response.status(200).json(msgs);
    }catch(error){
        return response.status(500).json(error.message);
    }
}
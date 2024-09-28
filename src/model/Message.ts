import { Schema, model, Document } from "mongoose";


interface MessageAttributes extends Document {
  messageId: string;
  user: string;
  message: string;
}

const messageSchema = new Schema<MessageAttributes>({
  messageId: { type: String, required: true },
  user: { type: String, required: true },
  message: { type: String, required: true }
}, { timestamps: true });

const Message = model<MessageAttributes>("Message", messageSchema);

export default Message;

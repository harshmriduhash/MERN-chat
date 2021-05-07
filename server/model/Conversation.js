const mongoose = require("mongoose");

const MessageSchema = mongoose.Schema({
  sender: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  sent: {
    type: Date,
    default: Date.now(),
  },
});

const ConversationSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  recipients: [String],
  messages: [MessageSchema],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("conversation", ConversationSchema);

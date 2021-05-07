const express = require("express");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

const User = require("../model/User");
const Conversation = require("../model/Conversation");

// auth middleware will be used to verify the token and
// retrieve the user based on the token payload
const auth = require("../middleware/auth");

// route for user registration will be '/user/signup'
router.post("/signup", async (req, res) => {
  // Extract first name, last name, username, email,
  // and password from body of request
  const { firstName, lastName, username, email, password } = req.body;

  try {
    // Check if user with email already exists in database
    let userWithEmail = await User.findOne({ email });
    if (userWithEmail) {
      return res
        .status(400)
        .json({ message: "user with this email already exists" });
    }

    // Check if user with username already exists in database
    let userWithUsername = await User.findOne({ username });
    if (userWithUsername) {
      return res
        .status(400)
        .json({ message: "user with this username already exists" });
    }

    // If user does not exist, create new user
    let user = new User({
      firstName,
      lastName,
      username,
      email,
      password,
    });

    // Use bcrypt to encrypt the user password for storage in database
    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(password, salt);

    // Save new user (with encrypted password) to database
    await user.save();

    const payload = { user: { id: user.id } };

    // Sign payload into JSON Web Token set to expire in 1 hour
    // Will use token to retrieve signed in user
    jwt.sign(payload, "randomString", { expiresIn: "1h" }, (err, token) => {
      if (err) throw err;
      res.status(200).json({ token });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong with signup" });
  }
});

// route for user registration will be '/user/signin'
router.post("/signin", async (req, res) => {
  // Extract username and password from body of request
  const { email, password } = req.body;
  try {
    // Check if user exists in database
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "email not registered" });
    }

    // Compare password from body with password in database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "incorrect password" });
    }

    const payload = { user: { id: user.id } };

    // Sign payload into JSON Web Token set to expire in 1 hour
    // Will use token to retrieve signed in user
    jwt.sign(payload, "randomString", { expiresIn: "1h" }, (err, token) => {
      if (err) throw err;
      res.status(200).json({ token });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong with signin" });
  }
});

// route to retrieve user will be '/user/me'
router.get("/me", auth, async (req, res) => {
  try {
    // decoded user is getting fetched from middleware after token auth
    const user = await User.findById(req.user.id);
    res.status(200).json({ user });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "something went wrong fetching user" });
  }
});

// route to post contact will be '/user/contacts/:contact'
router.post("/contacts", auth, async (req, res) => {
  // Extract contact email from body of request
  const { email } = req.body;

  try {
    // Check if contact with email already exists in database
    const contactWithEmail = await User.findOne({ email });
    if (!contactWithEmail) {
      return res.status(404).json({ message: "user is not registered" });
    }

    // Get our user
    const user = await User.findById(req.user.id);

    // Check if are trying to add ourselves
    if (email === user.email) {
      return res.status(400).json({ message: "cannot add self as a contact" });
    }

    // Check if email already exists in contact list
    const isAlreadyContact = user.contacts.includes(email);
    if (isAlreadyContact) {
      return res.status(400).json({ message: "user is already a contact" });
    }

    // Set new contacts list that includes new email
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { contacts: [...user.contacts, email] },
      { new: true }
    );

    const updatedContacts = updatedUser.contacts;

    res.status(200).json({ updatedContacts });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "something went wrong adding new contact" });
  }
});

// route to delete contact will be '/user/contacts'
router.delete("/contacts/:contact", auth, async (req, res) => {
  // Get contact from params
  const { contact } = req.params;

  try {
    // Get our user
    const user = await User.findById(req.user.id);

    // Check if contact exists in contact list
    const isContact = user.contacts.includes(contact);
    if (!isContact) {
      return res.status(400).json({ message: `'${contact}' is not a contact` });
    }

    // Set new contacts list that does not include contact
    const index = user.contacts.indexOf(contact);
    if (index < 0) {
      return res
        .status(400)
        .json({ message: "something went wrong removing contact" });
    }

    user.contacts.splice(index, 1);

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { contacts: user.contacts },
      { new: true }
    );

    updatedContacts = updatedUser.contacts;

    res.status(200).json({ updatedContacts });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong removing contact" });
  }
});

// route to retrieve contact info will be '/user/contact/:contact'
router.get("/contact/:contact", auth, async (req, res) => {
  const { contact } = req.params;
  try {
    const contactUser = await User.findOne({ email: contact });
    if (!contactUser) {
      return res
        .status(404)
        .json({ message: `could not find contact info for '${contact}'` });
    }

    // Get our user
    const user = await User.findById(req.user.id);

    // Check if contact exists in contact list
    const isContact = user.contacts.includes(contact);
    if (!isContact) {
      return res.status(400).json({ message: `'${contact}' is not a contact` });
    }

    const contactInfo = {
      name: `${contactUser.firstName} ${contactUser.lastName}`,
      username: contactUser.username,
      email: contactUser.email,
    };
    res.status(200).json({ contactInfo });
  } catch (error) {
    console.log(error);
    res
      .status(404)
      .json({ message: "something went wrong fetching contact info" });
  }
});

// route for conversation post will be '/user/conversation'
router.post("/conversation", auth, async (req, res) => {
  const { name, recipients } = req.body;

  try {
    // Check that a conversation with name and recipients doesn't exist already
    const conversationByName = await Conversation.findOne({ name });
    if (conversationByName) {
      const isExistingConversation = arrayEquality(
        conversationByName.recipients,
        recipients
      );

      if (isExistingConversation) {
        return res.status(400).json({
          message: "conversation with given name and recipients already exists",
        });
      }
    }

    let newConversation = new Conversation({ name, recipients });

    const conversation = await newConversation.save();

    // Add conversation id to every recipient
    recipients.forEach(async (recipient) => {
      const recipientUser = await User.findOne({ email: recipient });
      await User.findByIdAndUpdate(recipientUser._id, {
        conversations: [...recipientUser.conversations, conversation._id],
      });
    });

    res.status(200).json({ conversation });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "something went wrong creating conversation" });
  }
});

// route to retrieve conversations with user will be '/user/conversations'
router.get("/conversations", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    const conversations = Promise.all(
      user.conversations.map(async (c) => {
        const conversation = await Conversation.findById(c);
        if (conversation) {
          const formattedConversation = {
            id: conversation._id,
            name: conversation.name,
          };
          return formattedConversation;
        }
      })
    ).then((result) => {
      res.status(200).json(result);
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "something went wrong fetching user" });
  }
});

// route for message post will be '/user/message'
router.post("/message", auth, async (req, res) => {
  const { request } = req.body;
  try {
    // Get conversation
    const conversation = await Conversation.findOne({
      _id: request.conversationId,
    });
    if (!conversation) {
      return res.status(404).json({
        message: "could not find the given conversation to add message",
      });
    }

    const updatedConversation = await Conversation.findByIdAndUpdate(
      conversation._id,
      { messages: [...conversation.messages, request.message] },
      { new: true }
    );

    if (!updatedConversation) {
      return res.status(400).json({
        message: "error occurred updating conversation with new message",
      });
    }

    res.status(200).json({ updatedConversation });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "something went wrong creating new message" });
  }
});

const arrayEquality = (a, b) => {
  if (a.length !== b.length) return false;

  a.sort();
  b.sort();

  return a.every((element, index) => {
    return element === b[index];
  });
};

// route to delete conversation will be '/user/conversation'
router.delete("/conversation/:conversationId", auth, async (req, res) => {
  // Get contact from params
  const { conversationId } = req.params;

  try {
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: "conversation does not exist" });
    }

    await Conversation.findByIdAndDelete(conversation._id);

    let updatedUser = null;

    // Remove conversation from each recipient's conversations list
    for (const recipient of conversation.recipients) {
      // Get user
      const user = await User.findOne({ email: recipient });
      if (user) {
        // Check if conversation exists in conversation list
        const conversationExists = user.conversations.includes(conversationId);
        if (conversationExists) {
          // Set new conversations list that does not include this conversation
          const index = user.conversations.indexOf(conversationId);
          if (index > -1) {
            user.conversations.splice(index, 1);
            const updatedRecipient = await User.findByIdAndUpdate(
              user._id,
              {
                conversations: user.conversations,
              },
              { new: true }
            );

            if (updatedRecipient.id === req.user.id) {
              updatedUser = updatedRecipient;
            }
          }
        }
      }
    }

    res.status(200).json({ updatedConversations: updatedUser.conversations });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "something went wrong removing conversation" });
  }
});

// route to retrieve contact info will be '/user/contact/:contact'
router.get("/conversation/:conversationId", auth, async (req, res) => {
  const { conversationId } = req.params;
  try {
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res
        .status(404)
        .json({ message: "could not find conversation info" });
    }

    // Get our user
    const user = await User.findById(req.user.id);

    // Check if conversation exists in conversation list
    const isConversation = user.conversations.includes(conversationId);
    if (!isConversation) {
      return res
        .status(400)
        .json({ message: "user is not a recipient in this conversation" });
    }

    res.status(200).json({ conversation });
  } catch (error) {
    console.log(error);
    res
      .status(404)
      .json({ message: "something went wrong fetching contact info" });
  }
});

module.exports = router;

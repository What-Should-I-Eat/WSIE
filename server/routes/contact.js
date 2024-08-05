const express = require('express');
const contactUsRouter = express.Router();
const mongoose = require("mongoose");
const ContactUs = require("../src/models/contactUsModel.js");

contactUsRouter.post('/create_message', async (req, res) => {
  try {
    const contactUs = new ContactUs({
      id: req.body.id,
      full_name: req.body.fullName,
      email: req.body.email,
      message: req.body.message
    });

    const savedMessage = await contactUs.save();
    if (savedMessage) {
      res.status(200).json({ success: "Successfully sent contact us message" });
    } else {
      res.status(500).json({ error: "Error occurred sending contact us message" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error occurred sending contact us message" });
  }
});

contactUsRouter.get('/get_messages', async (_, res) => {
  try {
    const messages = await mongoose.model("ContactUs").find({});
    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error occurred getting contact us message" });
  }
});

module.exports = contactUsRouter;

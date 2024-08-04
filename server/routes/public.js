const express = require('express');
const publicRouter = express.Router();
const mongoose = require("mongoose");
const User = require("../src/models/userModel.js");
const bcrypt = require('bcryptjs');

// Success / Error Logs
const INTERNAL_SERVER_ERROR = "Internal Server Error";
const USER_NOT_FOUND_ERROR = "User not found";

publicRouter.get('/clearUserDatabase', async (_, res) => {
  try {
    const cleared = await mongoose.model('User').deleteMany({});
    res.json(cleared);
  } catch (error) {
    console.log('Error clearing database: ', error);
    res.status(500).json({ error: 'error clearing database' });
  }
});

publicRouter.get("/users/getVerificationCode", async (_, res) => {
  try {
    const verificationCode = generateRandomVerificationCode();
    res.json(verificationCode);
  } catch (error) {
    console.error('Error fetching verification code: ', error);
    res.status(500).json({ error: INTERNAL_SERVER_ERROR });
  }
});

publicRouter.get('/users/requestInfoForPasswordReset', async (req, res) => {
  try {
    const email = req.query.email;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ error: USER_NOT_FOUND_ERROR });
    }

    const forgotUserInfo = {
      username: user.username,
      fullName: user.fullName,
      email: user.email,
    };

    res.json(forgotUserInfo);
  }
  catch (error) {
    console.error('Error finding this email: ', error);
    return res.status(500).json({ error: INTERNAL_SERVER_ERROR });
  }
});

publicRouter.put("/users/changePassword", async (req, res) => {
  try {
    let userToLower = req.body.username.toLowerCase();
    const user = await User.findOne({ username: userToLower });

    if (!user) {
      return res.status(404).json({ error: USER_NOT_FOUND_ERROR });
    }
    if (!user.verified) {
      return res.status(404).json({ error: 'User not validated' });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const passwordUpdate = { $set: { "password": hashedPassword, "incorrectPasswordAttempts": 0 } };
    const options = { upsert: true, new: true };

    const updatedPassword = await User.updateOne(user, passwordUpdate, options);
    res.json(updatedPassword);
  } catch (error) {
    console.error('Error changing password: ', error);
    res.status(500).json({ error: INTERNAL_SERVER_ERROR });
  }
});

publicRouter.post("/users/getUserEmail", async (req, res) => {
  try {
    let userToLower = req.body.username.toLowerCase();
    const user = await User.findOne({ username: userToLower });

    if (!user) {
      return res.status(404).json({ error: USER_NOT_FOUND_ERROR });
    }

    res.json(user);
  } catch (error) {
    console.error('Error finding user: ', error);
    res.status(500).json({ error: INTERNAL_SERVER_ERROR });
  }
});

function generateRandomVerificationCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

module.exports = publicRouter;

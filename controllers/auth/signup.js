const { Conflict } = require("http-errors");
const gravatar = require("gravatar");
const { v4 } = require("uuid");
const { User } = require("../../models");
const { sendEmail } = require("../../helpers");

const signup = async (req, res) => {
  const { name, email, password, subscription } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw new Conflict(`This ${email} in use`);
  }

  const avatarURL = gravatar.url(email, {}, true);
  const verificationToken = v4();

  const newUser = new User({
    name,
    email,
    password,
    subscription,
    avatarURL,
    verificationToken,
  });
  newUser.setPassword(password);
  await newUser.save();

  const letterTemplate = {
    to: email,
    subject: "Email confirmation",
    html: `<h3>Hello ${name} welcome you!</h3> <br/> <a target="_blank" style="text-decoration:none" href="http://localhost:3000/api/users/verify/${verificationToken}">
        <b>Please, click here for verify email.</b>
      </a>`,
  };
  await sendEmail(letterTemplate);

  res.status(201).json({
    status: "success",
    code: 201,
    message: `We're glad to welcome you ${name}!`,
    data: {
      user: {
        name,
        email,
        avatarURL,
        verificationToken,
      },
    },
  });
};

module.exports = signup;

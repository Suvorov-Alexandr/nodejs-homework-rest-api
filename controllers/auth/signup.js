const { Conflict } = require("http-errors");
const { User } = require("../../models");
const gravatar = require("gravatar");

const signup = async (req, res) => {
  const { name, email, password, subscription } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw new Conflict(`This ${email} in use`);
  }

  const avatarURL = gravatar.url(email, {}, true);
  const newUser = new User({ name, email, subscription, avatarURL });
  newUser.setPassword(password);
  newUser.save();

  res.status(201).json({
    status: "success",
    code: 201,
    message: `We're glad to welcome you ${name}!`,
    data: {
      user: {
        name,
        email,
        subscription,
        avatarURL,
      },
    },
  });
};

module.exports = signup;

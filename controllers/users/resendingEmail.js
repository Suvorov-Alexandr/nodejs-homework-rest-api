const { NotFound, BadRequest } = require("http-errors");
const { User } = require("../../models");
const { sendEmail } = require("../../helpers");

const resendingEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!email) {
    throw new BadRequest("Missing required field email");
  }

  if (!user) {
    throw NotFound("User not found");
  }

  if (user.verify) {
    throw new BadRequest("Verification has already been passed");
  }
  const { verificationToken } = user;

  const letterTemplate = {
    to: email,
    subject: "Confirm you email",
    html: `<a target="_blank" href="http://localhost:3000/api/users/verify/${verificationToken}">Please, confirm you email</a>`,
  };
  await sendEmail(letterTemplate);

  res.json({
    message: "Verification email sent",
  });
};

module.exports = resendingEmail;

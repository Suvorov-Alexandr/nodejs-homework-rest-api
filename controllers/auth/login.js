const { Unauthorized, Conflict } = require("http-errors");
const jwt = require("jsonwebtoken");
const { User } = require("../../models");
const { SECRET_KEY } = process.env;

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !user.verify || !user.comparePassword(password)) {
    throw new Unauthorized(
      "Email is wrong or not verify, or password is wrong"
    );
  }

  if (user.token) {
    throw new Conflict(`This user ${email} is already logged in`);
  }

  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
  await User.findByIdAndUpdate(payload.id, { token });

  res.json({
    status: "success",
    code: 200,
    message: `Welcome ${user.name}`,
    data: {
      token,
      user: {
        email,
        message: "Verification successful",
      },
    },
  });
};

module.exports = login;

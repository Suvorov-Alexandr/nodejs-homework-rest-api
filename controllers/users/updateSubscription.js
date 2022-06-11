const { BadRequest, NotFound } = require("http-errors");
const { User } = require("../../models");

const updateSubscription = async (req, res) => {
  const { id } = req.user;
  const { subscription } = req.body;
  const updatedSubscription = await User.findByIdAndUpdate(
    id,
    { subscription },
    { new: true }
  );

  if (!subscription) {
    throw new BadRequest("Missing subscription field");
  }

  if (!updatedSubscription) {
    throw new NotFound(`User with ID "${id}" not found.`);
  }

  res.json({
    status: "success",
    code: 200,
    message: "Subscription updated",
    data: {
      result: updatedSubscription,
    },
  });
};

module.exports = updateSubscription;

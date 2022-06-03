const { BadRequest, NotFound } = require("http-errors");
const { Contact } = require("../../models");

const updateStatusContact = async (req, res) => {
  const { id } = req.params;
  const { favorite } = req.body;
  const updatedStatus = await Contact.findByIdAndUpdate(
    id,
    { favorite },
    { new: true }
  );

  if (!favorite) {
    throw new BadRequest("Missing field favorite");
  }

  if (!updatedStatus) {
    throw new NotFound(`Contact with ID "${id}" not found.`);
  }

  res.json({
    status: "success",
    code: 200,
    message: "Status updated",
    data: {
      result: updatedStatus,
    },
  });
};

module.exports = updateStatusContact;

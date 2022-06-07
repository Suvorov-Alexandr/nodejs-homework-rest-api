const { NotFound } = require("http-errors");
const { Contact } = require("../../models");

const updateContact = async (req, res) => {
  const { id } = req.params;
  const updatedContact = await Contact.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  if (!updatedContact) {
    throw new NotFound(`Contact with ID "${id}" not found.`);
  }

  res.json({
    status: "success",
    code: 200,
    message: "Contact updated successfully",
    data: {
      result: updatedContact,
    },
  });
};

module.exports = updateContact;

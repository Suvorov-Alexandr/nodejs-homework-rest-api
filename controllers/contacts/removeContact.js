const { NotFound } = require("http-errors");
const { Contact } = require("../../models");

const removeContact = async (req, res) => {
  const { id } = req.params;
  const removedContact = await Contact.findByIdAndRemove(id);

  if (!removedContact) {
    throw new NotFound(`Contact with ID "${id}" not found.`);
  }

  res.json({
    status: "success",
    code: 200,
    message: "Contact successfully removed",
    data: {
      result: removedContact,
    },
  });
};

module.exports = removeContact;

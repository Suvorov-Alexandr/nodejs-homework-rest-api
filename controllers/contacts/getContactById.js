const { NotFound } = require("http-errors");
const { Contact } = require("../../models");

const getContactById = async (req, res) => {
  const { id } = req.params;
  const findedContact = await Contact.findById(id);

  if (!findedContact) {
    throw new NotFound(`Contact with ID "${id}" not found.`);
  }

  res.json({
    status: "success",
    code: 200,
    message: "Contact with such ID found.",
    data: {
      result: findedContact,
    },
  });
};

module.exports = getContactById;

const { Contact } = require("../../models");

const getAllContacts = async (_, res) => {
  const contacts = await Contact.find({}).sort({ name: 1 });

  res.json({
    status: "success",
    code: 200,
    message: "Contacts received",
    data: {
      result: contacts,
    },
  });
};

module.exports = getAllContacts;

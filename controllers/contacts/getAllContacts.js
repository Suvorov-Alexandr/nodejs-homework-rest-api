const { Contact } = require("../../models");

const getAllContacts = async (req, res) => {
  const { _id } = req.user;
  const { page = 1, limit = 20, favorite = null } = req.query;
  const skipped = (page - 1) * limit;
  const skip = skipped < 0 ? 0 : skipped;
  const limited = limit > 20 ? 20 : limit;

  const contacts = await Contact.find(
    {
      owner: _id,
      ...(favorite === "false" || favorite === "true" ? { favorite } : {}),
    },
    "",
    {
      skip,
      limit: Number(limited),
    }
  )
    .populate("owner", "_id name email subscription")
    .sort({ name: 1 });

  res.json({
    status: "success",
    code: 200,
    message: "Contacts received",
    data: {
      result: contacts,
    },
    skip,
    limit: Number(limit),
  });
};

module.exports = getAllContacts;

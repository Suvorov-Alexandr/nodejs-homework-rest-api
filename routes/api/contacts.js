const express = require("express");
const { NotFound, BadRequest } = require("http-errors");
const Joi = require("joi");
const router = express.Router();
const contactsOperations = require("../../models/contacts");

const contactSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "ua"] } })
    .required(),
  phone: Joi.string().min(4).required(),
});

router.get("/", async (_, res, next) => {
  try {
    const contacts = await contactsOperations.listContacts();

    res.status(200).json({
      status: "success",
      code: 200,
      message: "Contacts received",
      data: {
        result: contacts,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await contactsOperations.getContactById(id);

    if (!result) {
      throw new NotFound(`Contact with ID "${id}" not found.`);
    }

    res.json({
      status: "success",
      code: 200,
      message: "Contact with such ID found.",
      data: {
        result,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { error } = contactSchema.validate(req.body);

    if (error) {
      throw new BadRequest("Bad Request" + error);
    }
    const result = await contactsOperations.addContact(req.body);

    res.status(201).json({
      status: "success",
      code: 201,
      message: "Contact successfully created",
      data: {
        result,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await contactsOperations.removeContact(id);

    if (!result) {
      throw new NotFound(`Contact with ID "${id}" not found.`);
    }

    res.json({
      status: "success",
      code: 204,
      message: "Contact successfully removed",
      data: {
        result,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const { error } = contactSchema.validate(req.body);

    if (error) {
      error.status = 400;
      throw error;
    }
    const { id } = req.params;
    const result = await contactsOperations.updateContact(id, req.body);

    if (!result) {
      throw new NotFound(`Contact with ID "${id}" not found.`);
    }

    res.status(200).json({
      status: "success",
      code: 200,
      message: "Contact updated successfully",
      data: {
        result,
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

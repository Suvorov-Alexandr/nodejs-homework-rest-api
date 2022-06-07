const { Schema, model } = require("mongoose");
const Joi = require("joi");

const codeRegexp = /^[0-9]{9}$/;

const contactSchema = Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
      required: [true, "Set email for contact"],
    },
    phone: {
      type: String,
      required: [true, "Set phone for contact"],
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      match: codeRegexp,
    },
  },
  { versionKey: false, timestamps: true }
);

const joiSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(33)
    .regex(/^[a-zA-Z]+ [a-zA-Z]+$/i)
    .required(),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "ua"] } })
    .required(),
  phone: Joi.string().min(4).required(),
  favorite: Joi.bool(),
  code: Joi.string().pattern(codeRegexp),
});

const joiStatusSchema = Joi.object({
  favorite: Joi.bool().required(),
});

const Contact = model("contact", contactSchema);

module.exports = { Contact, joiSchema, joiStatusSchema };

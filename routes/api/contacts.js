const express = require("express");
const router = express.Router();
const { joiSchema, joiStatusSchema } = require("../../models/contact");
const { validation, ctrlWrapper } = require("../../middlewares");
const { contacts: ctrl } = require("../../controllers");

router.get("/", ctrlWrapper(ctrl.getAllContacts));

router.get("/:id", ctrlWrapper(ctrl.getContactById));

router.post("/", validation(joiSchema), ctrlWrapper(ctrl.addContact));

router.delete("/:id", ctrlWrapper(ctrl.removeContact));

router.put("/:id", validation(joiSchema), ctrlWrapper(ctrl.updateContact));

router.patch(
  "/:id/favorite",
  validation(joiStatusSchema),
  ctrlWrapper(ctrl.updateStatusContact)
);

module.exports = router;

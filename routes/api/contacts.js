const express = require("express");
const { joiSchema, joiStatusSchema } = require("../../models/contact");
const { auth, validation, ctrlWrapper } = require("../../middlewares");
const { contacts: ctrl } = require("../../controllers");
const router = express.Router();

router.get("/", auth, ctrlWrapper(ctrl.getAllContacts));

router.get("/:id", ctrlWrapper(ctrl.getContactById));

router.post("/", auth, validation(joiSchema), ctrlWrapper(ctrl.addContact));

router.delete("/:id", ctrlWrapper(ctrl.removeContact));

router.put("/:id", validation(joiSchema), ctrlWrapper(ctrl.updateContact));

router.patch(
  "/:id/favorite",
  validation(joiStatusSchema),
  ctrlWrapper(ctrl.updateStatusContact)
);

module.exports = router;

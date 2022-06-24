const { User } = require("../../models");
const path = require("path");
const fs = require("fs").promises;
const Jimp = require("jimp");

const avatarsDir = path.join(__dirname, "../../", "public", "avatars");

const updateAvatar = async (req, res) => {
  const isValidTypeFile = req.file;

  if (!isValidTypeFile) {
    res.status(415).json({
      status: 415,
      message: "File upload error, unsupported media type",
    });
    return false;
  }

  const { path: tempUpload, originalname } = req.file;
  const { _id: id } = req.user;
  const imageName = `${id}_${originalname}`;

  try {
    const resultUpload = path.join(avatarsDir, imageName);
    await fs.rename(tempUpload, resultUpload);
    const avatarURL = path.join("public", "avatars", imageName);
    const avatar = await Jimp.read(resultUpload);
    await avatar.resize(250, 250).quality(90).writeAsync(avatarURL);
    await User.findByIdAndUpdate(id, { avatarURL });

    if (isValidTypeFile) {
      res.json({ status: 200, message: "File downloaded", avatarURL });
      return true;
    }
  } catch (error) {
    await fs.unlink(tempUpload);
    throw error;
  }
};

module.exports = updateAvatar;

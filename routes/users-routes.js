const express = require("express");

const usersController = require("../controllers/users-controllers");
const fileUpload = require("../middleware/file-upload");
const router = express.Router();


router.post("/signup", usersController.signup);
router.post("/login", usersController.login);
router.post("/sendmail", usersController.send_mail);
router.post(
    "/uploadimage",
    fileUpload.single("image"),
    usersController.uploadImage
);
router.delete("/deleteimage", usersController.deleteImage);

module.exports = router;

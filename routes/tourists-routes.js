const express = require("express");

const touristsController = require("../controllers/tourist-controllers");
const fileUpload = require("../middleware/file-upload");
const router = express.Router();


router.get("/gettourists", touristsController.gettourists);
router.get("/:tid", touristsController.getTourist);
router.post("/savetourist", touristsController.savetourist);
router.patch("/updatetourist/:tid", touristsController.updateTourist);
router.post(
    "/uploadimage",
    fileUpload.single("image"),
    touristsController.uploadImage
);
router.post(
    "/uploadimages",
    touristsController.uploadImages
);
router.delete("/deleteimage", touristsController.deleteImage);
router.delete("/:tid", touristsController.deleteTourist);
router.patch("/savecomment/:tid", touristsController.saveComment);

router.patch("/updategallery", touristsController.updateGallery);

module.exports = router;


/*

{
    "tourists": [
        {
            "_id": "66502e8bcfda32beed52a1bc",
            "touristname": "Chuck Bartowski",
            "touristemail": "chuck@gmail.com",
            "touristcode": "1111111",
            "tour": [],
            "__v": 0,
            "id": "66502e8bcfda32beed52a1bc"
        },
        {
            "_id": "665089eaf348edc7db7f518b",
            "touristname": "Nihat Onal",
            "touristemail": "onal@gasd.com",
            "touristcode": "7c70d993",
            "image": "",
            "tour": [
                {
                    "id": "Nihat Onal",
                    "location": "Dubai",
                    "otel": "Aldai Resort Hotel",
                    "date": "2024-04",
                    "link": "http://localhost:3000/writecomment/Dubai/AldaiResortHotel",
                    "comment": ""
                }
            ],
            "__v": 0,
            "id": "665089eaf348edc7db7f518b"
        },
        {
            "_id": "66508a08f348edc7db7f518d",
            "touristname": "Nihat Onal",
            "touristemail": "onal@gasd.com",
            "touristcode": "1f487612",
            "image": "",
            "tour": [
                {
                    "id": "Nihat Onal",
                    "location": "Dubai",
                    "otel": "Aldai Resort Hotel",
                    "date": "2024-04",
                    "link": "http://localhost:3000/writecomment/Dubai/AldaiResortHotel",
                    "comment": ""
                }
            ],
            "__v": 0,
            "id": "66508a08f348edc7db7f518d"
        },
        {
            "_id": "66508afe5be7df10ef4e1d1e",
            "touristname": "dneemmasd",
            "touristemail": "onal@gmail.com",
            "touristcode": "bddf037c",
            "image": "",
            "tour": [
                {
                    "id": "dneemmasd",
                    "location": "asfasd",
                    "otel": "asdfasdas",
                    "date": "2024-01",
                    "link": "http://localhost:3000/writecomment/asfasd/asdfasdas",
                    "comment": ""
                }
            ],
            "__v": 0,
            "id": "66508afe5be7df10ef4e1d1e"
        },
        {
            "_id": "66508b1d5be7df10ef4e1d23",
            "touristname": "dneemmasd",
            "touristemail": "onaldebeme@gmail.com",
            "touristcode": "0821e6fb",
            "image": "",
            "tour": [
                {
                    "id": "dneemmasd",
                    "location": "asfasd",
                    "otel": "asdfasdas",
                    "date": "2024-01",
                    "link": "http://localhost:3000/writecomment/asfasd/asdfasdas",
                    "comment": ""
                }
            ],
            "__v": 0,
            "id": "66508b1d5be7df10ef4e1d23"
        },
        {
            "_id": "66508c015be7df10ef4e1d26",
            "touristname": "nihat",
            "touristemail": "nijas2@asd.asd",
            "touristcode": "73bd9f78",
            "image": "",
            "tour": [
                {
                    "id": "nihat",
                    "location": "denmem",
                    "otel": "lkiju",
                    "date": "2024-07",
                    "link": "http://localhost:3000/writecomment/denmem/lkiju",
                    "comment": ""
                }
            ],
            "__v": 0,
            "id": "66508c015be7df10ef4e1d26"
        }
    ]
}*/
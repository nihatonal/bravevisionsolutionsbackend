require("dotenv").config();
const { validationResult } = require("express-validator");
const multer = require('multer');
const HttpError = require("../models/http-error");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const https = require('https');
const { v4: uuidv4 } = require('uuid');
const Tourist = require("../models/tourist");
const fs = require('fs');

////////////////////
const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/images');
    },
    filename: (req, file, cb) => {
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, uuidv4() + '.' + ext);
    }
});
const multi_upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (
            file.mimetype == 'image/png' ||
            file.mimetype == 'image/jpeg' ||
            file.mimetype == 'image/jpg'
        ) {
            cb(null, true);
        } else {
            cb(null, false);
            const err = new Error('Only .jpg .jpeg .png images are supported!');
            err.name = 'ExtensionError';
            return cb(err);
        }
    },
}).array('uploadImages', 16);


const getTourist = async (req, res, next) => {
    const touristId = req.params.tid;

    let tourist;
    try {
        tourist = await Tourist.findById(touristId);
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not find a tourist.',
            500
        );
        return next(error);
    }

    if (!tourist) {
        const error = new HttpError(
            'Could not find place for the provided id.',
            404
        );
        return next(error);
    }

    res.json({ tourist: tourist.toObject({ getters: true }) });
};


const gettourists = async (req, res, next) => {
    let tourists;

    try {
        tourists = await Tourist.find({}, "-password");
    } catch (err) {
        const error = new HttpError(
            "Fetching tourists failed, please try again later.",
            500
        );
        return next(error);
    }
    res.json({ tourists: tourists.map((tourist) => tourist.toObject({ getters: true })) });
};

// create tourist
const savetourist = async (req, res, next) => {

    const { touristname, touristemail, touristphone, touristcode, image, images, country, country_id, city, otel, date, cost, link, comment } = req.body;
    // let existingUser;
    // try {
    //     existingUser = await Tourist.findOne({ touristemail: touristemail });
    // } catch (err) {
    //     const error = new HttpError(
    //         "Signing up failed, please try again later.",
    //         500
    //     );
    //     return next(error);
    // }
    // if (existingUser) {
    //     const error = new HttpError(
    //         "User exists already, please login instead.",
    //         422
    //     );
    //     return next(error);
    // }
    const createdTourist = new Tourist({
        touristname: touristname,
        touristemail: touristemail,
        touristphone: touristphone,
        touristcode: touristcode,
        image: image,
        images: [],
        country: country,
        country_id: country_id,
        city: city,
        otel: otel,
        date: date,
        cost: cost,
        link: link,
        comment: comment
    });

    try {
        await createdTourist.save();
    } catch (err) {
        const error = new HttpError("Failed, please try again.", 500);
        console.log(err);
        return next(error);
    }
    res.status(201).json({ tourist: createdTourist });
}

// updateTourist
const updateTourist = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError("Invalid inputs passed, please check your data.", 422)
        );
    }

    const { country, country_id, city, otel, date, cost } = req.body;
    const touristId = req.params.tid;

    let tourist;
    try {
        tourist = await Tourist.findById(touristId);
    } catch (err) {
        const error = new HttpError(
            "Something went wrong, could not find tourist.",
            500
        );
        return next(error);
    }
    tourist.country = country;
    tourist.country_id = country_id;
    tourist.city = city;
    tourist.otel = otel;
    tourist.date = date;
    tourist.cost = cost;



    try {
        await tourist.save();
    } catch (err) {
        const error = new HttpError(
            "Something went wrong, could not update user.",
            500
        );
        return next(error);
    }

    res.status(200).json({ tourist: tourist.toObject({ getters: true }) });
};

const uploadImage = async (req, res, next) => {

    try {
        const data = req.file;
        res.json({ message: "data recieved", data: data });
    } catch {
        res.status(500).send("error");
    }
};
const uploadImages = async (req, res, next) => {

    multi_upload(req, res, function (err) {

        try {
            const data = req.files;

            res.json({ message: "data recieved", data: data });
        } catch {
            res.status(500).send("error");
        }
    })
};

const deleteImage = async (req, res, next) => {
    const { image } = req.body;
    fs.unlink(image, (err) => {
        console.log(err);
    });

    res.status(200).json({ message: "Deleted image." });
};


const deleteTourist = async (req, res) => {

    const tId = req.params.tid;

    await Tourist.deleteOne({ _id: tId });

    res.status(200).json({ message: "Deleted Tourist." });
};

const saveComment = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError("Invalid inputs passed, please check your data.", 422)
        );
    }

    const { comment, image, images, touristcode } = req.body;
    const touristId = req.params.tid;

    let tourist;
    try {
        tourist = await Tourist.findById(touristId);
    } catch (err) {
        const error = new HttpError(
            "Something went wrong, could not find tourist.",
            500
        );
        return next(error);
    }
    if (tourist.touristcode !== touristcode) {
        const error = new HttpError(
            "Code is not correct",
            422
        );
        return next(error);
    }

    try {
        tourist.comment = comment;
        tourist.image = image;
        tourist.images = images;
    } catch (err) {
        const error = new HttpError(
            "Something went wrong, could not find tourist.",
            500
        );
        return next(error);
    }


    try {
        await tourist.save();
    } catch (err) {
        const error = new HttpError(
            "Something went wrong, could not update user.",
            500
        );
        return next(error);
    }

    res.status(200).json({ tourist: tourist.toObject({ getters: true }) });
};

const updateGallery = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError("Invalid inputs passed, please check your data.", 422)
        );
    }

    const { touristinfo } = req.body;

    let tourist;
    try {
        tourist = await Tourist.findById(touristinfo.id);
    } catch (err) {
        const error = new HttpError(
            "Something went wrong, could not find tourist.",
            500
        );
        return next(error);
    }
    tourist.images = touristinfo.images
    try {
        await tourist.save();
    } catch (err) {
        const error = new HttpError(
            "Something went wrong, could not update user.",
            500
        );
        return next(error);
    }

    res.status(200).json({ tourist: tourist.toObject({ getters: true }) });
};


exports.savetourist = savetourist;
exports.gettourists = gettourists;
exports.updateTourist = updateTourist;
exports.uploadImage = uploadImage;
exports.uploadImages = uploadImages;
exports.deleteImage = deleteImage;
exports.deleteTourist = deleteTourist;
exports.getTourist = getTourist;
exports.saveComment = saveComment;
exports.updateGallery = updateGallery;

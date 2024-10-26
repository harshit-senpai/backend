"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImage = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const s3 = new client_s3_1.S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
});
const uploadImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { filename, fileType } = yield req.body;
    if (typeof filename !== "string" || typeof fileType !== "string") {
        res.status(400).json({
            message: "Invalid or missing parameters",
        });
        return;
    }
    const key = `${Date.now()}-${filename}`;
    const command = new client_s3_1.PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: key,
        ContentType: fileType,
    });
    try {
        const signedUrl = yield (0, s3_request_presigner_1.getSignedUrl)(s3, command, { expiresIn: 3600 });
        res.status(200).json({
            data: {
                url: signedUrl,
                key,
            },
        });
    }
    catch (error) {
        console.log("[IMAGE_UPLOAD] Error: ", error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
});
exports.uploadImage = uploadImage;

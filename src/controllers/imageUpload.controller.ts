import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Request, Response } from "express";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

export const uploadImage = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { filename, fileType } = await req.body;

  if (typeof filename !== "string" || typeof fileType !== "string") {
    res.status(400).json({
      message: "Invalid or missing parameters",
    });
    return;
  }

  const key = `${Date.now()}-${filename}`;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: key,
    ContentType: fileType,
  });

  try {
    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
    res.status(200).json({
      data: {
        url: signedUrl,
        key,
      },
    });
  } catch (error) {
    console.log("[IMAGE_UPLOAD] Error: ", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

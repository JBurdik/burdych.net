import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  getS3Client,
  MINIO_BUCKET,
  MINIO_PUBLIC_URL,
  ALLOWED_IMAGE_TYPES,
  MAX_FILE_SIZE,
} from "../lib/minio";

const presignedUrlInput = z.object({
  filename: z.string().min(1),
  contentType: z.string().refine((type) => ALLOWED_IMAGE_TYPES.includes(type), {
    message: "Invalid file type. Allowed: jpg, png, gif, webp",
  }),
  fileSize: z.number().max(MAX_FILE_SIZE, {
    message: `File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB`,
  }),
});

function generateUniqueFilename(originalFilename: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const ext = originalFilename.split(".").pop() || "jpg";
  const baseName = originalFilename
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-zA-Z0-9-_]/g, "-")
    .substring(0, 50);
  return `${baseName}-${timestamp}-${random}.${ext}`;
}

export const getPresignedUploadUrl = createServerFn({ method: "POST" })
  .inputValidator((data: z.infer<typeof presignedUrlInput>) =>
    presignedUrlInput.parse(data),
  )
  .handler(async ({ data }) => {
    const { filename, contentType } = data;

    const objectName = generateUniqueFilename(filename);
    const s3Client = getS3Client();

    const command = new PutObjectCommand({
      Bucket: MINIO_BUCKET,
      Key: objectName,
      ContentType: contentType,
    });

    // Generate presigned PUT URL valid for 10 minutes
    const presignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 10 * 60,
    });

    const publicUrl = `${MINIO_PUBLIC_URL}/${objectName}`;

    return {
      presignedUrl,
      publicUrl,
      objectName,
    };
  });

export const deleteUploadedFile = createServerFn({ method: "POST" })
  .inputValidator((objectName: string) => z.string().min(1).parse(objectName))
  .handler(async ({ data: objectName }) => {
    const s3Client = getS3Client();

    const command = new DeleteObjectCommand({
      Bucket: MINIO_BUCKET,
      Key: objectName,
    });

    await s3Client.send(command);
    return { success: true };
  });

// Get presigned URL for viewing a private image (valid for 1 hour)
export const getPresignedViewUrl = createServerFn({ method: "POST" })
  .inputValidator((url: string) => z.string().min(1).parse(url))
  .handler(async ({ data: url }) => {
    // Extract object name from the URL
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split("/");
    // Remove bucket name from path if present
    const objectName = pathParts[pathParts.length - 1];

    const s3Client = getS3Client();

    const command = new GetObjectCommand({
      Bucket: MINIO_BUCKET,
      Key: objectName,
    });

    // Generate presigned GET URL valid for 1 hour
    const presignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 60 * 60,
    });

    return { presignedUrl };
  });

// Get presigned URLs for multiple images
export const getPresignedViewUrls = createServerFn({ method: "POST" })
  .inputValidator((urls: string[]) => z.array(z.string()).parse(urls))
  .handler(async ({ data: urls }) => {
    const s3Client = getS3Client();

    const presignedUrls = await Promise.all(
      urls.map(async (url) => {
        try {
          const urlObj = new URL(url);
          const pathParts = urlObj.pathname.split("/");
          const objectName = pathParts[pathParts.length - 1];

          const command = new GetObjectCommand({
            Bucket: MINIO_BUCKET,
            Key: objectName,
          });

          const presignedUrl = await getSignedUrl(s3Client, command, {
            expiresIn: 60 * 60,
          });

          return { original: url, presigned: presignedUrl };
        } catch {
          // If URL parsing fails, return original
          return { original: url, presigned: url };
        }
      }),
    );

    return { urls: presignedUrls };
  });

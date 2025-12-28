import { S3Client } from "@aws-sdk/client-s3";

// MinIO/S3 configuration
// API endpoint for S3 operations (presigned URLs, etc.)
export const MINIO_API_ENDPOINT =
  process.env.MINIO_API_ENDPOINT || "api.minio.burdych.net";
// Public endpoint for serving files (can be CDN or direct MinIO)
export const MINIO_PUBLIC_ENDPOINT =
  process.env.MINIO_PUBLIC_ENDPOINT || "api.minio.burdych.net";
export const MINIO_BUCKET = process.env.MINIO_BUCKET || "portfolio";
export const MINIO_PUBLIC_URL = `https://${MINIO_PUBLIC_ENDPOINT}/${MINIO_BUCKET}`;

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// S3 Client for MinIO (S3-compatible)
let _s3Client: S3Client | null = null;

export function getS3Client(): S3Client {
  if (_s3Client) return _s3Client;

  const accessKey = process.env.MINIO_ACCESS_KEY || "";
  const secretKey = process.env.MINIO_SECRET_KEY || "";
  const useSSL = process.env.MINIO_USE_SSL !== "false";

  _s3Client = new S3Client({
    endpoint: `${useSSL ? "https" : "http"}://${MINIO_API_ENDPOINT}`,
    region: "us-east-1", // MinIO ignores this but it's required
    credentials: {
      accessKeyId: accessKey,
      secretAccessKey: secretKey,
    },
    forcePathStyle: true, // Required for MinIO
  });

  return _s3Client;
}

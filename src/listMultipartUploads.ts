import {
  ListMultipartUploadsCommandOutput,
  ListMultipartUploadsCommand,
} from '@aws-sdk/client-s3';
import { s3Client } from './config';

/**
 * Process 2 - List all the Multipart Uploads
 * @param bucketName
 * @returns
 */
export async function listMultipartsUploads(
  bucketName: string,
): Promise<ListMultipartUploadsCommandOutput> {
  const listMultipartUpload = new ListMultipartUploadsCommand({
    Bucket: bucketName,
  });
  const listMultipartUploadResponse = await s3Client.send(listMultipartUpload);
  return listMultipartUploadResponse;
}

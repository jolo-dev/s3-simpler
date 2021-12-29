import { GetObjectCommand, GetObjectCommandInput } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Client } from './config';

export type PresignedUrl = GetObjectCommandInput & { expiresIn: number };

/**
 * Helper Process 4 - Generate a presigned URL
 * @param args of Type PresignedUrl
 * @returns
 */
export async function generatePresignedUrl(args: PresignedUrl) {
  const command = new GetObjectCommand(args);
  const { expiresIn } = args;
  // const object = await s3Client.send();
  const url = await getSignedUrl(s3Client, command, {
    expiresIn,
  });
  return url;
}

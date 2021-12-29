import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';
import { GetObjectCommand, GetObjectCommandInput } from '@aws-sdk/client-s3';
import { s3Client } from './config';

type BaucameraImage = {
  projectId: string;
  userId: string;
  fileName: string;
};
export type DownloadFromS3 = Omit<GetObjectCommandInput, 'Key'> & BaucameraImage;

/**
 * Download from S3 by a Baucamera Project
 * @param args of Type DownloadFromS3
 * @returns Promise<string>
 */
export async function downloadFromS3(args: DownloadFromS3) {
  const { projectId, userId, fileName, Bucket } = args;
  const Key = `${projectId}/${userId}/${fileName}`;
  const s3GetObjectInput: GetObjectCommandInput = {
    Bucket,
    Key,
  };
  try {
    const object = await s3Client.send(new GetObjectCommand(s3GetObjectInput));

    return await new Promise<string>((resolve) => {
      const body = object.Body as Readable;

      const tempFileName = path.join('/tmp/', fileName);
      const tempFile = fs.createWriteStream(Buffer.from(tempFileName));

      body.pipe(tempFile).on('finish', () => {
        resolve(tempFileName);
      }).on('open', () => {
        resolve(tempFileName);
      }).on('close', () => {
        console.log('close');
      });
    });
  } catch (error) {
    console.log(error);
    throw new Error(`Error for downloading from S3 Key: ${Key}`);
  }
}

import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';
import { GetObjectCommand, GetObjectCommandInput } from '@aws-sdk/client-s3';
import { s3Client } from './config';

/**
 * Download a file from S3 to a local directory.
 * @param {string} Bucket - The name of the bucket you want to download from
 * @param {string} Key - The name of the file you want to download
 * @param {string} [location=.] - The location where you want to download the file to.
 */
export async function downloadFromS3(Bucket: string, Key: string, location: string = '/tmp') {
  const s3GetObjectInput: GetObjectCommandInput = {
    Bucket,
    Key,
  };
  try {
    const object = await s3Client.send(new GetObjectCommand(s3GetObjectInput));

    return await new Promise<string>((resolve) => {
      const body = object.Body as Readable;

      const tempFileName = path.join(location, Key);
      const tempFile = fs.createWriteStream(Buffer.from(tempFileName));

      body.pipe(tempFile).on('open', () => {
        resolve(tempFileName);
      });
    });
  } catch (error) {
    console.log(error);
    throw new Error(`Error for downloading from S3 Key: ${Key}`);
  }
}

import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';
import { GetObjectCommand, GetObjectCommandInput } from '@aws-sdk/client-s3';
import { s3Client } from './config';

type BucketFile = {
	fileName: string;
};
export type DownloadFromS3 = Omit<GetObjectCommandInput, 'Key'> & BucketFile;

/**
 * Download from S3 by a key
 * @param args of Type DownloadFromS3
 * @returns Promise<string>
 */
export async function downloadFromS3(args: DownloadFromS3) {
	const { fileName, Bucket } = args;
	const Key = fileName;
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

			body.pipe(tempFile).on('open', () => {
				resolve(tempFileName);
			});
		});
	} catch (error) {
		console.log(error);
		throw new Error(`Error for downloading from S3 Key: ${Key}`);
	}
}

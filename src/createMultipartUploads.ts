import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import {
	CompletedPart,
	CreateMultipartUploadCommand,
	CreateMultipartUploadCommandInput,
	CreateMultipartUploadOutput,
	UploadPartCommand,
} from '@aws-sdk/client-s3';
import { SPLIT_SIZE, s3Client } from './config';

export type CreateMultipartUpload = Pick<
	Omit<CreateMultipartUploadCommandInput, 'Bucket'>, // to force bucket
	'Key' | 'Tagging'
> & { FilePath: string; Bucket: string };

export type MultipartUpload = CreateMultipartUpload & {
	Parts: fs.Dirent[];
	Multiparts: CreateMultipartUploadOutput;
};

/**
 * Whole Process 1 for creating and uploading Multipart Uploads
 * @param createMultipartUpload Argument from type CreateMultipartUpload
 * @returns Promise<CompletedPart[]>
 */
export async function multipartUpload(
	createMultipartUpload: CreateMultipartUpload,
) {
	const Multiparts = await createMultipartUploads(createMultipartUpload);
	const Parts = splitLargeFile(createMultipartUpload.FilePath);
	const args: MultipartUpload = {
		...createMultipartUpload,
		Parts,
		Multiparts,
	};
	const uploadParts = await uploadPart(args);
	return uploadParts;
}

/**
 * Process 1a - Creating MultipartUploads
 * @param args Arguments of type CreateMultipartUpload
 * @returns Promise<CreateMultipartUploadOutput>
 */
export async function createMultipartUploads(
	args: CreateMultipartUpload,
): Promise<CreateMultipartUploadOutput> {
	const multipart = new CreateMultipartUploadCommand(args);
	const multipartResponse = await s3Client.send(multipart);
	return multipartResponse;
}

/**
 * Process 1b - Split File to given SPLIT_SIZE (see config.ts)
 * @param filePath
 * @returns fs.Dirent[]
 */
export function splitLargeFile(filePath: string) {
	// Using Unix-Like command
	execSync(`openssl md5 -binary ${filePath}| base64`);
	execSync(`split -b ${SPLIT_SIZE} ${filePath} ${filePath}.part-`);
	const parts: fs.Dirent[] = fs
		.readdirSync(path.dirname(filePath), { withFileTypes: true })
		.filter((part: fs.Dirent) => part.name.includes('part'));
	return parts;
}

/**
 * Process 1c - Upload Part Command and return the complete part
 * @param args Arguments of type MultipartUpload
 * @returns CompletedPart
 */
export async function uploadPart(args: MultipartUpload) {
	const { Bucket, Key, Multiparts, FilePath, Parts } = args;

	// Promise.all will ensure that the UploadPartCommand is executed sequentiell
	return Promise.all(
		Parts.map(async (part: fs.Dirent, index) => {
			// biome-ignore lint/style/noParameterAssign: we need to assign the index
			index++;
			const uPart = new UploadPartCommand({
				Bucket,
				Key,
				PartNumber: index,
				UploadId: Multiparts.UploadId,
				Body: fs.readFileSync(`${path.dirname(FilePath)}/${part.name}`),
			});
			const uploadPartResponse = await s3Client.send(uPart);

			return {
				PartNumber: index,
				ETag: uploadPartResponse.ETag,
			} as CompletedPart;
		}),
	);
}

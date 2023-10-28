import {
	AbortMultipartUploadCommand,
	CompleteMultipartUploadCommand,
	CompletedMultipartUpload,
	CompletedPart,
	ListMultipartUploadsCommandOutput,
	MultipartUpload,
} from '@aws-sdk/client-s3';
import { s3Client } from './config';

export type Multipart = Omit<
	ListMultipartUploadsCommandOutput,
	'$metadata' | 'Uploads'
> & { Bucket: string; Uploads: MultipartUpload[] };
export type UploadMultipart = Multipart & {
	completedParts: CompletedPart[];
};

/**
 * Helper for process 3 Upload Multipart. If that fails, remove the MultiUploadParts
 * @param args from type UploadMultipart
 * @returns Promise<CompleteMultipartUploadCommandOutput[] | undefined>
 */
export async function uploadMultipart(args: UploadMultipart) {
	const { Uploads, completedParts, Bucket } = args;

	return Promise.all(
		[...new Set(Uploads)].map(async (uploads: MultipartUpload) => {
			const completedMultipartUpload: CompletedMultipartUpload = {
				Parts: completedParts,
			};
			const { Key, UploadId } = uploads;
			const completeMultipartUpload = new CompleteMultipartUploadCommand({
				Bucket,
				Key,
				UploadId,
				MultipartUpload: completedMultipartUpload,
			});
			const completeMultipartUploadResponse = await s3Client.send(
				completeMultipartUpload,
			);
			return completeMultipartUploadResponse;
		}),
	).catch(async (error) => {
		const multipart: Omit<UploadMultipart, 'completedParts'> = args;
		await abortMultipart(multipart);
		throw error;
	});
}

/**
 * Helper Method for Aborting MultipartUpload. Usage when Upload failed
 * @param bucketName
 * @param listMultipartUpload
 * @returns Promise<AbortMultipartUploadCommandOutput[]>
 */
export async function abortMultipart(args: Multipart) {
	const { Uploads, Bucket } = args;
	return Promise.all(
		[...new Set(Uploads)].map(async (uploads: MultipartUpload) => {
			const { Key, UploadId } = uploads;
			const abort = new AbortMultipartUploadCommand({
				Bucket,
				Key,
				UploadId,
			});
			return s3Client.send(abort);
		}),
	);
}

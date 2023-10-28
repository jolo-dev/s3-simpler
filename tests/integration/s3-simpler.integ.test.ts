import { existsSync } from 'fs';
import path from 'path';
import {
	CreateBucketCommand,
	DeleteBucketCommand,
	DeleteObjectCommand,
	GetObjectCommand,
	S3Client,
} from '@aws-sdk/client-s3';
import { downloadFromS3 } from '../../src/downloadFromS3';
import { uploadToS3 } from '../../src/uploadToS3';

describe.only('integration', () => {
	/*
	 * Make sure you provide the credentials
	 */
	const bucketName = 'super-random-test-bucket-12345';
	const s3 = new S3Client({ region: 'eu-central-1' });
	const fileName = 'tests/test.jpg';
	const dirname = path.dirname(__filename);
	const FilePath = path.join(dirname, '..', '..', fileName);

	beforeAll(async () => {
		const createBucketCommand = new CreateBucketCommand({
			Bucket: bucketName,
		});
		await s3.send(createBucketCommand);
	});

	it('should upload the test.jpg', async () => {
		// upload test.jpg
		const signedUrl = await uploadToS3({
			Bucket: bucketName,
			FilePath,
			Key: fileName,
		});
		console.log(signedUrl);
		setTimeout(async () => {
			// check if file was really uploaded
			const getObjectCommand = new GetObjectCommand({
				Bucket: bucketName,
				Key: fileName,
			});
			const result = await s3.send(getObjectCommand);

			expect(result.Body).not.toBeNull();
		}, 1000);
	});

	it('should download the test.jpg', async () => {
		setTimeout(async () => {
			await downloadFromS3({
				Bucket: bucketName,
				fileName,
			});

			expect(existsSync(path.join('/tmp', fileName))).toBeTruthy();
		}, 1000);
	});

	afterAll(async () => {
		const deleteObjectCommand = new DeleteObjectCommand({
			Bucket: bucketName,
			Key: fileName,
		});
		await s3.send(deleteObjectCommand);

		const deleteBucketCommand = new DeleteBucketCommand({
			Bucket: bucketName,
		});
		await s3.send(deleteBucketCommand);
	});
});

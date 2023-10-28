import { unlinkSync } from 'fs';
import path from 'path';
import {
	CompleteMultipartUploadCommand,
	CreateMultipartUploadCommand,
	ListMultipartUploadsCommand,
	S3Client,
	UploadPartCommand,
} from '@aws-sdk/client-s3';
import { mockClient } from 'aws-sdk-client-mock';
import { CreateMultipartUpload } from '../../src/createMultipartUploads';
import { uploadToS3 } from '../../src/uploadToS3';

vi.mock('../../src/generatePresignedUrl', () => ({
	...vi.importActual('../../src/generatePresignedUrl'),
	generatePresignedUrl: vi.fn().mockResolvedValue('testUrl'),
}));

const bucketName = 'unique-bucket-name';
const fileName = 'tests/test.jpg';
const Key = fileName;

const s3Mock = mockClient(S3Client);
const folder = path.dirname(__filename);

describe('s3Actions', () => {
	describe('uploadToS3', () => {
		const uploadToS3Args: CreateMultipartUpload = {
			Bucket: bucketName,
			FilePath: fileName,
			Key,
		};

		beforeEach(() => {
			s3Mock.reset();
		});

		it('should upload to S3', async () => {
			s3Mock.on(CreateMultipartUploadCommand).resolves({
				Bucket: bucketName,
				Key,
			});
			s3Mock.on(UploadPartCommand).resolves({
				ETag: '1234',
			});
			s3Mock.on(ListMultipartUploadsCommand).resolves({
				Uploads: [
					{
						Key,
						UploadId: '1111',
					},
				],
			});
			s3Mock.on(CompleteMultipartUploadCommand).resolves({
				Key,
			});

			const locationUrl = await uploadToS3(uploadToS3Args);
			expect(locationUrl).toEqual('testUrl');
		});

		it('should throw when one of the step failed', async () => {
			s3Mock.on(ListMultipartUploadsCommand).resolves({
				Uploads: [
					{
						Key,
						UploadId: '1111',
					},
				],
			});
			s3Mock.on(CreateMultipartUploadCommand).rejects();
			await expect(uploadToS3(uploadToS3Args)).rejects.toThrowError(
				`Error in uploadToS3 Key: ${Key}`,
			);
		});

		afterAll(() => {
			const multipart = path.join(folder, '..', '..', `${fileName}.part-aa`);
			if (!multipart) {
				return;
			} else {
				unlinkSync(multipart);
			}
		});
	});
});

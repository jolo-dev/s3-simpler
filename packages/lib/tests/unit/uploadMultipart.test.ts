import { CompleteMultipartUploadCommand, S3Client } from '@aws-sdk/client-s3';
import { mockClient } from 'aws-sdk-client-mock';
import { UploadMultipart, uploadMultipart } from '../../src/uploadMultipart';

const bucketName = 'bucketName';
const fileName = 'tests/test.jpg';
const key = fileName;

const s3Mock = mockClient(S3Client);

describe('s3Actions', () => {
	describe('uploadMultipart', () => {
		const uploadMultipartArgs: UploadMultipart = {
			Bucket: bucketName,
			Uploads: [{ UploadId: '1234', Key: key }],
			completedParts: [{ ETag: '9999', PartNumber: 1 }],
		};

		beforeEach(() => {
			s3Mock.reset();
		});

		it('should send CompleteMultipartUpload Command', async () => {
			s3Mock.on(CompleteMultipartUploadCommand).resolves({
				Bucket: bucketName,
				Key: key,
				Location: 'bla',
			});
			const response = await uploadMultipart(uploadMultipartArgs);
			expect(response?.[0].Bucket).toEqual(bucketName);
			expect(response?.[0].Key).toEqual(key);
			expect(response?.[0].Location).toEqual('bla');
		});

		it('should throw when CompleteMultipartUpload Command failed', async () => {
			s3Mock.on(CompleteMultipartUploadCommand).rejects();
			await expect(uploadMultipart(uploadMultipartArgs)).rejects.toThrowError();
		});
	});
});

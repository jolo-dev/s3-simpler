import { ListMultipartUploadsCommand, S3Client } from '@aws-sdk/client-s3';
import { mockClient } from 'aws-sdk-client-mock';
import { listMultipartsUploads } from '../../src/listMultipartUploads';

const bucketName = 'bucketName';

const s3Mock = mockClient(S3Client);

describe('s3Actions', () => {
	describe('listMultipartUploads', () => {
		beforeEach(() => {
			s3Mock.reset();
		});

		it('should list Multipart Uploads by given bucketname', async () => {
			s3Mock.on(ListMultipartUploadsCommand).resolves({
				Uploads: [{ UploadId: '1234' }],
			});
			const listParts = await listMultipartsUploads(bucketName);
			expect(listParts.Uploads?.[0].UploadId).toEqual('1234');
		});

		it('should throw when ListMultipartUpload failed', async () => {
			s3Mock.on(ListMultipartUploadsCommand).rejects();
			await expect(listMultipartsUploads(bucketName)).rejects.toThrowError();
		});
	});
});

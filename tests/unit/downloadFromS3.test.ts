import fs from 'fs';
import { Readable } from 'stream';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { mockClient } from 'aws-sdk-client-mock';
import { DownloadFromS3, downloadFromS3 } from '../../src/downloadFromS3';

const s3Mock = mockClient(S3Client);
const mockedStream = new Readable();
mockedStream._read = function () {
	/* do nothing */
};

const fileName = 'test.jpg';
const Key = fileName;

describe('s3Actions', () => {
	describe('downloadFromS3', () => {
		const downloadFromS3Args: DownloadFromS3 = {
			Bucket: 'bucketName',
			fileName,
		};

		beforeEach(() => {
			s3Mock.reset();
		});

		it('should download from S3', async () => {
			s3Mock.on(GetObjectCommand).resolves({
				ContentType: 'jpg',
				Body: mockedStream,
			});
			const data = await downloadFromS3(downloadFromS3Args);
			expect(data).toBe('/tmp/test.jpg');
		});

		it('should throw on GetObjectCommand', async () => {
			s3Mock.on(GetObjectCommand).rejects();
			await expect(downloadFromS3(downloadFromS3Args)).rejects.toThrowError(
				`Error for downloading from S3 Key: ${Key}`,
			);
		});

		afterAll(() => {
			fs.unlinkSync(`/tmp/${downloadFromS3Args.fileName}`);
		});
	});
});

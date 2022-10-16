import fs from 'fs';
import { Readable } from 'stream';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { mockClient } from 'aws-sdk-client-mock';
import {
  downloadFromS3,
} from '../../src/downloadFromS3';

const s3Mock = mockClient(S3Client);
var mockedStream = new Readable();
mockedStream._read = function () {
  /* do nothing */
};

const Bucket = 'bucketName';
const Key = 'test.jpg';

describe('s3Actions', () => {
  describe('downloadFromS3', () => {
    beforeEach(() => {
      s3Mock.reset();
    });

    it('should download from S3 in /tmp folder', async () => {
      s3Mock.on(GetObjectCommand).resolves({
        ContentType: 'jpg',
        Body: mockedStream,
      });
      const data = await downloadFromS3(Bucket, Key, '/tmp');
      expect(data).toBe('/tmp/test.jpg');
    });

    it('should download from S3 in /tmp folder', async () => {
      s3Mock.on(GetObjectCommand).resolves({
        ContentType: 'jpg',
        Body: mockedStream,
      });
      const data = await downloadFromS3(Bucket, Key);
      expect(data).toBe('/tmp/test.jpg');
    });

    it('should throw on GetObjectCommand', async () => {
      s3Mock.on(GetObjectCommand).rejects();
      await expect(downloadFromS3(Bucket, Key, '/tmp')).rejects.toThrowError(
        `Error for downloading from S3 Key: ${Key}`,
      );
    });

    afterAll(() => {
      fs.unlinkSync(`/tmp/${Key}`);
    });
  });
});

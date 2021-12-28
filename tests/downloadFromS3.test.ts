import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { mockClient } from 'aws-sdk-client-mock';
import { Readable } from 'stream';
import {
  downloadFromS3,
  DownloadFromS3,
} from '../../lib/s3Actions/downloadFromS3';
import fs from 'fs';

const s3Mock = mockClient(S3Client);
var mockedStream = new Readable();
mockedStream._read = function (size) {
  /* do nothing */
};

const projectId = 'testProject';
const userId = 'test005';
const fileName = 'test.jpg';
const Key = `${projectId}/${userId}/${fileName}`;

describe('s3Actions', () => {
  describe('downloadFromS3', () => {
    const downloadFromS3Args: DownloadFromS3 = {
      Bucket: 'bucketName',
      fileName,
      projectId,
      userId,
    };

    beforeEach(() => {
      s3Mock.reset();
    });

    it('should download from S3', async () => {
      s3Mock.on(GetObjectCommand).resolves({
        ContentType: 'jpg',
        Body: mockedStream,
      });
      downloadFromS3(downloadFromS3Args).then((data) => {
        expect(data).toBe('/tmp/test.jpg');
      });
    });

    it('should throw on GetObjectCommand', async () => {
      s3Mock.on(GetObjectCommand).rejects();
      await expect(downloadFromS3(downloadFromS3Args)).rejects.toThrowError(
        `Error for downloading from S3 Key: ${Key}`
      );
    });

    afterAll(() => {
      fs.rmSync(`/tmp/${downloadFromS3Args.fileName}`);
    });
  });
});

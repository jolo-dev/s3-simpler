import fs from 'fs';
import {
  S3Client,
  CreateMultipartUploadCommand,
  CompleteMultipartUploadCommand,
  ListMultipartUploadsCommand,
  UploadPartCommand,
} from '@aws-sdk/client-s3';
import { mockClient } from 'aws-sdk-client-mock';
import { CreateMultipartUpload } from '../src/createMultipartUploads';
import { uploadToS3 } from '../src/uploadToS3';

jest.mock('../src/generatePresignedUrl', () => ({
  ...jest.requireActual('../src/generatePresignedUrl'),
  generatePresignedUrl: jest.fn().mockResolvedValue('testUrl'),
}));

const bucketName = 'unique-bucket-name';
const fileName = 'test.jpg';
const projectId = 'testProject';
const userId = 'test005';
const Key = `${projectId}/${userId}/${fileName}`;

const s3Mock = mockClient(S3Client);

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
      fs.createWriteStream(fileName);
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
  });
});

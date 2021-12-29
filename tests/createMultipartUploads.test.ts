import { CreateMultipartUploadCommand, S3Client } from '@aws-sdk/client-s3';
import { mockClient } from 'aws-sdk-client-mock';
import {
  createMultipartUploads,
  CreateMultipartUpload,
} from '../src/createMultipartUploads';

const bucketName = 'bucketName';
const fileName = 'test.jpg';
const projectId = 'testProject';
const userId = 'test005';
const key = `${projectId}/${userId}/${fileName}`;

const s3Mock = mockClient(S3Client);

describe('s3Actions', () => {
  describe('createMultipartUploads', () => {
    const createMultipartUpload: CreateMultipartUpload = {
      Bucket: bucketName,
      Key: key,
      FilePath: fileName,
      Tagging: 'bla',
    };

    beforeEach(() => {
      s3Mock.reset();
    });

    it('should create MultipartUploads', async () => {
      s3Mock.on(CreateMultipartUploadCommand).resolves({
        Bucket: bucketName,
        Key: key,
      });
      const response = await createMultipartUploads(createMultipartUpload);
      expect(response.Bucket).toBe(bucketName);
      expect(response.Key).toBe(key);
    });

    it('should throw when create Multipart failed', async () => {
      s3Mock.on(CreateMultipartUploadCommand).rejects();
      await expect(
        createMultipartUploads(createMultipartUpload),
      ).rejects.toThrowError();
    });
  });
});

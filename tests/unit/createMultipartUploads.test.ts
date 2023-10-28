import { existsSync, unlinkSync } from 'fs';
import path from 'path';
import { CreateMultipartUploadCommand, S3Client, CreateMultipartUploadOutput, UploadPartCommand } from '@aws-sdk/client-s3';
import { mockClient } from 'aws-sdk-client-mock';
import {
  createMultipartUploads,
  CreateMultipartUpload,
  uploadPart,
  splitLargeFile,
  MultipartUpload,
} from '../../src/createMultipartUploads';

const bucketName = 'bucketName';
const fileName = 'tests/test.jpg';
const key = fileName;

const s3Mock = mockClient(S3Client);

describe('s3Actions', () => {
  describe('createMultipartUploads', () => {
    const createMultipartUpload: CreateMultipartUpload = {
      Bucket: bucketName,
      Key: key,
      FilePath: fileName,
      Tagging: 'bla',
    };
    const folder = path.dirname(__filename);

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

    it('should uploadPart', async () => {
      s3Mock.on(UploadPartCommand).resolves({
        ETag: 'foo',
      });
      const Multiparts: CreateMultipartUploadOutput = {
        Bucket: bucketName,
        Key: key,
      };

      const Parts = splitLargeFile( path.join(folder, '..', '..', fileName) );
      const args: MultipartUpload = {
        ...createMultipartUpload,
        Parts,
        Multiparts,
      };
      const uploadParts = await uploadPart( args );
      expect(uploadParts[0].ETag).toBe('foo');

      // Check the Multipart path
      const multipart = path.join(folder, '..', '..', `${fileName}.part-aa`);
      expect(existsSync(multipart)).toBeTruthy();
    });

    afterAll(() => {
      const multipart = path.join(folder, '..', '..', `${fileName}.part-aa`);
      unlinkSync(multipart);
    });
  });
});

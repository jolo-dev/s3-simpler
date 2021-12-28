import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { mockClient } from 'aws-sdk-client-mock';
import {
  generatePresignedUrl,
  PresignedUrl,
} from '../../lib/s3Actions/generatePresignedUrl';

jest.mock('@aws-sdk/s3-request-presigner', () => ({
  ...jest.requireActual('@aws-sdk/s3-request-presigner'),
  getSignedUrl: jest.fn().mockResolvedValue('testUrl'),
}));

const bucketName = 'bucketName';
const fileName = 'test.jpg';
const projectId = 'testProject';
const userId = 'test005';
const key = `${projectId}/${userId}/${fileName}`;

const s3Mock = mockClient(S3Client);

describe('s3Actions', () => {
  describe('generatePresignedUrl', () => {
    const presignedUrl: PresignedUrl = {
      Bucket: bucketName,
      Key: key,
      expiresIn: 1,
    };

    beforeEach(() => {
      s3Mock.reset();
    });

    it('should generate a presigned url', async () => {
      s3Mock.on(GetObjectCommand).resolves({});
      const url = await generatePresignedUrl(presignedUrl);
      expect(url).toBe('testUrl');
    });
  });
});

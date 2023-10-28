import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { mockClient } from 'aws-sdk-client-mock';
import {
  generatePresignedUrl,
  PresignedUrl,
} from '../../src/generatePresignedUrl';

vi.mock('@aws-sdk/s3-request-presigner', () => ({
  ...vi.importActual('@aws-sdk/s3-request-presigner'),
  getSignedUrl: vi.fn().mockResolvedValue('testUrl'),
}));

const bucketName = 'bucketName';
const fileName = 'tests/test.jpg';
const key = fileName;

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

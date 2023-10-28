import { S3Client } from '@aws-sdk/client-s3';

const region = process.env.REGION;

export const s3Client = new S3Client({ region });

export const SPLIT_SIZE = '20m';

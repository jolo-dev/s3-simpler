import {
  CreateMultipartUpload,
  multipartUpload,
} from './createMultipartUploads';
import { generatePresignedUrl } from './generatePresignedUrl';
import { listMultipartsUploads } from './listMultipartUploads';
import { abortMultipart, uploadMultipart } from './uploadMultipart';

// General Process
// 1. List Multi Upload Parts
// 2. Create Multiparts
//  2a. Prepare Multiparts
//  2b. Use the Unix split-method to split the files in a given SPLIT_SIZE
//  2c. Create UploadParts to retrieve the { ETag, PartNumber}
// 3. Upload Multi Upload Parts
// 4. Generate a Presigned URL

/**
 *
 * @param args {CreateMultipartUpload} Argument for Creating Multipart Upload
 * @returns Promise<string>
 */
export async function uploadToS3( args: CreateMultipartUpload ) {
  const { Bucket, Key } = args;
  const multipart = await listMultipartsUploads( Bucket );
  try {
    const completedParts = await multipartUpload( args );
    await uploadMultipart( { Bucket, completedParts, Uploads: multipart.Uploads! } );
    const url = await generatePresignedUrl( {
      Bucket,
      Key,
      expiresIn: 60 * 60 * 24 * 7,
    } ); // 60s * 60min * 24h * 7d = 1 week
    return url;
  } catch ( error ) {
    console.log( error );
    await abortMultipart( {
      Bucket,
      Uploads: multipart.Uploads!,
    } );
    throw new Error( `Error in uploadToS3 Key: ${Key}` );
  }
}

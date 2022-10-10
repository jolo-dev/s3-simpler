# S3 Simpler (S4)

A library to make uploading and downloading from S3 simpler no matter what size.

## Why?

Honestly, who cares about [Multipart Uploads](https://docs.aws.amazon.com/AmazonS3/latest/userguide/mpuoverview.html) of large files.
We all want to simply download and upload any files because size shouldn't matter.

The idea is that the user can simply use `s4.upload('mybucket', 'path/to/my/large/file')` and gets a presigned URL in return. Furthermore, this library is able to download `s4.download('mybucket', 'key/of/my/file', 'path/to/safe')` (TODO).

## Get Involved

See the `CONTRIBUTION.md`.




# S3 Simpler (S4)

A library to make uploading and downloading from S3 simpler no matter what size.

## Why?

Honestly, who cares about [Multipart Uploads](https://docs.aws.amazon.com/AmazonS3/latest/userguide/mpuoverview.html) of large files.
We all want to simply download and upload any files because size shouldn't matter.

The idea is that the user can simply use `s4.upload('mybucket', 'path/to/my/large/file')` and gets a presigned URL in return. Furthermore, this library is able to download `s4.download('mybucket', 'key/of/my/file', 'path/to/safe')`.

## CLI (TODO)

There is a plan to create a little CLI - command for uploading files to S3 regardless how big. It just depends on your network.

```sh
npx s4 upload --bucket my-bucket-name --key path/to/my/local/file 
```

## Get Involved

See the `CONTRIBUTION.md`.

## Reference

Photo by [Gianpaolo Antonucci](https://unsplash.com/@gianp_anto94?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

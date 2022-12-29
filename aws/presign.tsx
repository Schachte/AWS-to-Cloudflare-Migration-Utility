import { AWSObject } from "../pages/transfer";
import { AWSConnectionContext } from "../context/AWSStore";
import { S3Client, GetObjectCommand, S3ClientConfig } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export async function generatePresignedUrl(
  object: AWSObject,
  awsCtx: AWSConnectionContext
) {
  
  const s3Configuration: S3ClientConfig = {
    credentials: {
      accessKeyId: awsCtx.awsConnection?.accessKeyId || "",
      secretAccessKey: awsCtx.awsConnection?.accessKeySecret || "",
    },
    region: awsCtx.awsConnection?.region || ""
  };

  const s3 = new S3Client(s3Configuration);
  const command = new GetObjectCommand({ Bucket: object.bucketName, Key: object.name });
  console.log(command)

  const url = await getSignedUrl(s3, command, { expiresIn: 15 * 60 });
  return url;
}

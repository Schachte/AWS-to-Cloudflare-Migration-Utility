import { Dispatch, SetStateAction } from "react";
import { checkStatus } from "../cloudflare/status";
import { CloudflareConnectionContext } from "../context/CloudflareStore";
import { AWSObject } from "../pages/transfer";

const MAX_CONCURRENT_UPLOADS = 5;
const QUEUE_EVAL_INTERVAL_MS = 1000;

type CloudflareUpload = {
  awsMetadata: AWSObject;
  cloudflareContext: CloudflareConnectionContext;
};

// represents things queued, but not processing
let uploadQueue: CloudflareUpload[] = [];

// represents things currently processing. This helps limits
// the number of concurrent items being processed to avoid
// spamming Cloudflare APIs
let processing: CloudflareUpload[] = [];

export const initiateTransfer = (
  files: AWSObject[],
  cloudflareContext: CloudflareConnectionContext,
  updateFileState: Dispatch<SetStateAction<AWSObject[]>>,
  fullFileList: AWSObject[]
) => {
  for (let file in files) {
    addToQueue(cloudflareContext, files[file]);
  }

  // initiates a background job to limit number of concurrent uploads
  // from the client and tracks upload progress
  manageUploadQueue();
  manageProcessingQueue(cloudflareContext, updateFileState, fullFileList);
};

// manageUploadQueue will continuously evaluate the processing queue
// to limit the number of concurrent uploads. When the queue is depleted,
// it will pull backlogged uploads to be processed. Continuation is determined
// based on the encoding completion sent back by Cloudflare.
const manageUploadQueue = async () => {
  let processingLength = processing.length;
  let queueLength = uploadQueue.length;

  const timer = setInterval(async () => {
    while (processingLength < MAX_CONCURRENT_UPLOADS && queueLength > 0) {
      console.log("Processing queue is ready to upload more items");
      await processUpload();

      processing.length;
      queueLength = uploadQueue.length;
    }
  }, QUEUE_EVAL_INTERVAL_MS);

  // cancel the timer if all items are uploaded
  // TODO: Add cancellation feature
  if (processingLength == 0 && queueLength == 0) {
    console.log("Uploads complete, killing the background queue job");
    clearInterval(timer);
  }
};

// manageProcessingQueue continuously evaluates the upload progress
// to determine when a particular upload is complete and pops it off
// the queue to allow more uploads to process if queued.
const manageProcessingQueue = async (
  cfContext: CloudflareConnectionContext,
  updateFileState: Dispatch<SetStateAction<AWSObject[]>>,
  fileList: AWSObject[]
) => {
  let processingLength;
  let queueLength;
  const timer = setInterval(async () => {
    processingLength = processing.length;
    queueLength = uploadQueue.length;
    for (let upload in processing) {
      const { result } = await checkStatus(
        cfContext,
        processing[upload].awsMetadata.mediaUID || ""
      );

      // Let's update progress back to the UI
      // Currently, we only match on the filenames, so we expect uniqueness here
      const originalFile = fileList.find(
        (item) => item.name == processing[upload].awsMetadata.name
      );

      if (originalFile !== undefined && result) {
        originalFile.percentComplete = `${result.status.state} - ${
          (result.status.pctComplete &&
            parseFloat(result.status.pctComplete).toFixed(2)) ||
          "0"
        }%`;

        updateFileState([...fileList]);

        if (result.status.pctComplete >= 100) {
          const filteredQueue = processing.filter(
            (item) =>
              item.awsMetadata.mediaUID !==
              processing[upload].awsMetadata.mediaUID
          );
          processing = filteredQueue;
        }
      } else {
        console.log("Unable to find original file name match");
      }
    }
  }, QUEUE_EVAL_INTERVAL_MS);

  // cancel the timer if all items are uploaded
  // TODO: Add cancellation feature
  if (processingLength == 0 && queueLength == 0) {
    console.log("Uploads complete, killing the background processing job");
    clearInterval(timer);
  }
};

//TODO: Type this return value and remove the context
// addToQueue will queue up an upload to be processed to Cloudflare
const addToQueue = async (
  cloudflareContext: CloudflareConnectionContext,
  awsMetadata: AWSObject
): Promise<any> => {
  uploadQueue.push({
    cloudflareContext,
    awsMetadata,
  });
};

// processUpload invokes the file transfer from AWS to Cloudflare
// and queues up a job to evaluate the completion progress to determine
// when it should be popped off the queue.
const processUpload = async () => {
  const { awsMetadata, cloudflareContext } = uploadQueue.shift() || {
    awsMetadata: undefined,
    cloudflareContext: undefined,
  };

  if (awsMetadata == undefined || cloudflareContext == undefined) {
    return;
  }

  const resp = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${cloudflareContext.cloudflareConnection?.accountId}/stream/copy`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${cloudflareContext.cloudflareConnection?.bearerToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        //TODO: Use regular URL for non-presigned objects
        url: awsMetadata.presignedUrl,
        meta: {
          name: awsMetadata.name,
        },
      }),
    }
  );
  let { result } = await resp.json();

  // we will have a UID we can now track progress against
  awsMetadata.mediaUID = result.uid;
  processing.push({ awsMetadata, cloudflareContext });
};

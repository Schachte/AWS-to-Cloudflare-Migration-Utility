import { useContext, useEffect, useState } from "react";
import Layout from "../components/Layout";
import AWSContext, { AWSConnectionContext } from "../context/AWSStore";
import CloudflareContext from "../context/CloudflareStore";
import ReactS3Client from "react-aws-s3-typescript";
import { ListFileResponse } from "react-aws-s3-typescript/dist/types";
import { generatePresignedUrl } from "../aws/presign";
import { bool } from "aws-sdk/clients/signer";
import { initiateTransfer } from "../queue/uploader";

export type AWSObject = {
  bucketName?: string;
  name: string;
  fileType: string;
  requiresPresignedUrl: boolean;
  presignedUrl?: string;
  isSelected: boolean;
  percentComplete?: string;
  mediaUID?: string;
};

const inferExtensionFromName = (filename: string) => {
  const parts = filename.split(".");
  const extension = parts[parts.length - 1];

  if (extension === "") {
    return "Unknown";
  }
  return extension;
};

export default function Details() {
  const awsContext = useContext(AWSContext);
  const cfContext = useContext(CloudflareContext);

  const [fileList, setFileList] = useState<AWSObject[]>([]);

  const fetchS3Objects = async (
    awsContext: AWSConnectionContext
  ): Promise<Array<AWSObject>> => {
    const s3Config = {
      region: awsContext.awsConnection?.region || "",
      bucketName: awsContext.awsConnection?.bucketName || "",
      accessKeyId: awsContext.awsConnection?.accessKeyId || "",
      secretAccessKey: awsContext.awsConnection?.accessKeySecret || "",
    };

    const s3 = new ReactS3Client(s3Config);

    try {
      const s3Objects = (await s3.listFiles()) as ListFileResponse;
      if (s3Objects.data.Contents === undefined) {
        return [];
      }
      return await Promise.all(
        s3Objects.data.Contents.map(async (item: any) => {
          const awsObject: AWSObject = {
            name: item.Key,
            fileType: inferExtensionFromName(item.Key),
            requiresPresignedUrl: false,
            isSelected: false,
            bucketName: awsContext.awsConnection?.bucketName || "",
          };

          return awsObject;
        })
      );
    } catch (exception) {
      return [];
    }
  };

  const generateSignedURLForObject = async (
    awsContext: AWSConnectionContext,
    idx: number,
    currentList: AWSObject[]
  ) => {
    let url;
    if (!currentList[idx].presignedUrl) {
      url = await generatePresignedUrl(currentList[idx], awsContext);
    } else {
      url = undefined;
    }

    currentList[idx] = {
      ...currentList[idx],
      presignedUrl: url,
      requiresPresignedUrl: !currentList[idx].requiresPresignedUrl,
      isSelected: !currentList[idx].requiresPresignedUrl,
    };

    setFileList([...currentList]);
  };

  useEffect(() => {
    const fetchObjects = async (ctx: AWSConnectionContext) => {
      return await fetchS3Objects(ctx);
    };

    fetchObjects(awsContext)
      .then((resp) => {
        setFileList(resp);
      })
      .catch(console.error);
  }, []);

  const queueForStream = (fileList: AWSObject[], idx: number) => {
    fileList[idx].isSelected = !fileList[idx].isSelected;
    setFileList([...fileList]);
  };

  const startUpload = async () => {
    const filesToQueue = await Promise.all(
      fileList.filter((item) => item.isSelected)
    );

    // invoke background jobs and queue up videos to transfer
    initiateTransfer(filesToQueue, cfContext, setFileList, fileList);
  };

  const selectAllVideos = (setting: bool) => {
    const updatedList = fileList.map((file) => {
      file.isSelected = setting;
      if (!setting) {
        file.requiresPresignedUrl = false;
        file.presignedUrl = undefined;
      }
      return file;
    });
    setFileList([...updatedList]);
  };

  const generateSignedURLsForSelected = () => {
    fileList.map((file, idx) => {
      if (file.isSelected) {
        generateSignedURLForObject(awsContext, idx, fileList);
      }
    });
  };

  return (
    <Layout
      pageTitle={"S3 Migration"}
      subTitle={"Let's transfer your S3 Videos to Cloudflare Stream"}
    >
      <div className="w-full flex flex-col">
        <button
          onClick={startUpload}
          className="flex w-full bg-green-100 text-green-700 items-center justify-center space-x-3 rounded py-3 mt-5 border border-green-600 hover:shadow-md duration-500 transition-all hover:bg-green-700 hover:text-white"
        >
          <img src="/assets/download.svg" className="w-5" />
          <span>Begin S3 to Cloudflare Transfer</span>
        </button>

        <div className="flex space-x-3 mt-8 items-center ">
          <span className="text-sm text-slate-700">
            Transferring bucket contents from:{" "}
          </span>
          <span className="inline-flex rounded-full bg-yellow-100 px-2 py-1 text-xs font-normal leading-5 text-yellow-800">
            {awsContext.awsConnection?.bucketName ||
              "bucket name not specified, please check connection details on previous page"}
          </span>
        </div>
        <hr className="mt-8" />
        <div className="flex space-x-3 justify-end items-end">
          <span
            onClick={() => selectAllVideos(true)}
            className="text-sm text-slate-700 border w-fit p-2 rounded mt-3 hover:shadow duration-300 transition-all hover:cursor-pointer"
          >
            <span>Select All</span>
          </span>
          <span
            onClick={() => selectAllVideos(false)}
            className="text-sm text-slate-700 border w-fit p-2 rounded mt-3 hover:shadow duration-300 transition-all hover:cursor-pointer"
          >
            <span>Deselect All</span>
          </span>
        </div>
        <span
          onClick={() => generateSignedURLsForSelected()}
          className="self-end text-sm text-slate-700 border w-fit p-2 rounded mt-3 hover:shadow duration-300 transition-all hover:cursor-pointer"
        >
          <span>Generate signed URLs for selected items</span>
        </span>
      </div>
      <div className="mt-4 flex flex-col w-full">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      File Name
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-sm font-semibold text-gray-900 text-center"
                    >
                      Type
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Link
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 text-center"
                    >
                      Requires Presigned URL
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 text-center"
                    >
                      Transfer To Stream
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {fileList.map((file: AWSObject, idx: number) => (
                    <tr key={idx}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                        <div className="flex items-center space-x-5">
                          {file.percentComplete && (
                            <span className="text-green-500">
                              {`${file.percentComplete}`} complete
                            </span>
                          )}
                          <div className="text-gray-500">{file.name}</div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800 justify-center text-center">
                          {file.fileType}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span className="inline-flex rounded-full bg-purple-100 px-2 text-xs font-semibold leading-5 text-purple-700">
                          {file.presignedUrl && (
                            <a href={`${file.presignedUrl}`}>
                              Download via Signed URL
                            </a>
                          )}
                          {!file.presignedUrl && "No signed URL present"}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-center">
                        <input
                          id="candidates"
                          aria-describedby="candidates-description"
                          name="candidates"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          onChange={(e) =>
                            generateSignedURLForObject(
                              awsContext,
                              idx,
                              fileList
                            )
                          }
                          checked={file.requiresPresignedUrl}
                        />
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-center">
                        <input
                          id="candidates"
                          aria-describedby="candidates-description"
                          name="candidates"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          checked={file.isSelected}
                          onChange={() => queueForStream(fileList, idx)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

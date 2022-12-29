import { useContext, useState } from "react";
import Button from "../components/Button";
import InfoBanner from "../components/InfoBanner";
import Layout from "../components/Layout";
import AWSContext, { AWSConnectionContext } from "../context/AWSStore";
import CloudflareContext, {
  CloudflareConnectionContext,
} from "../context/CloudflareStore";
import ReactS3Client from "react-aws-s3-typescript";

const checkFullyPopulated = (obj: any): boolean => {
  for (let key in obj) {
    if (obj[key] == undefined || obj[key] == "") return false;
  }
  return true;
};

const connectionIconMap = {
  success: "/assets/check.svg",
  fail: "/assets/error.svg",
  waiting: "/assets/connection.svg",
  loading: "/assets/loading.gif",
};

export default function Details() {
  const awsContext = useContext(AWSContext);
  const cfContext = useContext(CloudflareContext);

  const [connectionIcon, setConnectionIcon] = useState(
    connectionIconMap["waiting"]
  );

  const [connectionStatus, setConnectionStatus] = useState("Verify Connection");

  const verifyCloudflareConnection = async (
    cfConnection: CloudflareConnectionContext
  ) => {
    try {
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${cfConnection.cloudflareConnection?.accountId}/stream`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${cfConnection.cloudflareConnection?.bearerToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      await response.json();
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const verificationConnection = async (
    awsContext: AWSConnectionContext,
    cloudflareContext: CloudflareConnectionContext
  ) => {
    setConnectionIcon(connectionIconMap["loading"]);
    setConnectionStatus("Verifying connection...");

    const s3Config = {
      region: awsContext.awsConnection?.region || "us-east-1",
      bucketName: awsContext.awsConnection?.bucketName || "",
      accessKeyId: awsContext.awsConnection?.accessKeyId || "",
      secretAccessKey: awsContext.awsConnection?.accessKeySecret || "",
    };

    const s3 = new ReactS3Client(s3Config);

    try {
      await s3.listFiles();
      const cloudflareConnected = await verifyCloudflareConnection(cfContext);
      if (!cloudflareConnected) {
        throw "Cloudflare credentials invalid";
      }
    } catch (exception) {
      console.error(exception);
      setConnectionIcon(connectionIconMap["fail"]);
      setConnectionStatus("Connection Failed! Verify your credentials");
      return;
    }
    setConnectionIcon(connectionIconMap["success"]);
    setConnectionStatus("Connection Verified!");
  };

  return (
    <Layout
      pageTitle={"S3 To Cloudflare Stream Migration"}
      subTitle={"Setting Up The Connection Details"}
    >
      <InfoBanner bannerText="All connection information is only stored on the client. Nothing is stored on any server." />
      <div className="flex justify-center flex-col items-center space-y-3 w-full">
        <Button
          text="Add AWS Connection Details"
          logo="/assets/aws.svg"
          link="/connection/aws"
          enableArrowAnimation={true}
        />
        <Button
          text="Add Cloudflare Connection Details"
          logo="/assets/cloudflare.svg"
          link="/connection/cloudflare"
          enableArrowAnimation={true}
        />

        {checkFullyPopulated(awsContext.awsConnection) &&
          checkFullyPopulated(cfContext.cloudflareConnection) && (
            <Button
              fn={() => verificationConnection(awsContext, cfContext)}
              text={connectionStatus}
              logo={connectionIcon}
            />
          )}
        {connectionStatus === "Connection Verified!" && (
          <Button
            text={"Begin Migration Process"}
            logo={"/assets/download.svg"}
            link={"/transfer"}
            enableArrowAnimation={true}
          />
        )}
      </div>
    </Layout>
  );
}

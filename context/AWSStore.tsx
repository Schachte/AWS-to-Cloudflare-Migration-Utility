import React from "react";

export type AWSConnection = {
  accessKeyId?: string;
  accessKeySecret?: string;
  bucketName?: string;
  region?: string;
};

export type AWSConnectionContext = {
  awsConnection?: AWSConnection;
  setAWSConnection: (input: AWSConnection) => void;
};

const AWSContext = React.createContext<AWSConnectionContext>({
  setAWSConnection: () => {},
});

export default AWSContext;

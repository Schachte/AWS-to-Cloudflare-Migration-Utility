import { useContext, useState } from "react";
import InfoBanner from "../../components/InfoBanner";
import Layout from "../../components/Layout";
import AWSContext from "../../context/AWSStore";
import Modal from "../../components/Modal";

export default function AWSConnection() {
  const { awsConnection, setAWSConnection } = useContext(AWSContext);

  const [accessKeyId, setAccessKeyId] = useState(awsConnection?.accessKeyId);
  const [region, setRegion] = useState(awsConnection?.region);
  const [accessKeySecret, setAccessKeySecret] = useState(
    awsConnection?.accessKeySecret
  );
  const [bucketName, setBucketName] = useState(awsConnection?.bucketName);
  const [isModalVisible, setModalVisibility] = useState(false);

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setAWSConnection({ accessKeyId, accessKeySecret, bucketName, region });
    setModalVisibility(true)
  };

  return (
    <Layout
      pageTitle={"AWS Connection Details"}
      subTitle={"Allows communication to AWS S3 API from the browser"}
      enablePrevious={true}
    >
      <Modal
        bannerText="AWS Connection Settings Saved Successfully!"
        isVisible={isModalVisible}
        setVisible={setModalVisibility}
      />

      <InfoBanner bannerText="All connection information is only stored on the client. Nothing is stored on any server." />

      <div className="flex self-center mt-12 text-lg flex items-center space-x-3 p-3 font-semibold text-slate-700">
        <img src="/assets/aws.svg" className="w-8" />
        <span>Store AWS S3 Credentials</span>
      </div>
      <form onSubmit={handleSubmit} className="flex w-full justify-center">
        <div className="w-9/12 sm:w-full p-5 bg-slate-50 flex self-center rounded-sm border flex-col space-y-3 text-slate-700">
          <div className="flex w-full items-center space-x-5 text-sm">
            <span className="whitespace-nowrap font-semibold w-2/5">
              Bucket Region:{" "}
            </span>
            <input
              type="text"
              placeholder="AWS Region"
              className="p-3 rounded-md border w-full"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
            />
            {/* <img src="/assets/info.svg" className="w-5 hover:cursor-pointer" /> */}
          </div>
          <div className="flex w-full items-center space-x-5 text-sm">
            <span className="whitespace-nowrap font-semibold w-2/5">
              Access Key ID:{" "}
            </span>
            <input
              type="text"
              placeholder="AWS Access Key ID"
              className="p-3 rounded-md border w-full"
              value={accessKeyId}
              onChange={(e) => setAccessKeyId(e.target.value)}
            />
            {/* <div className="w-8 relative">
                <img src="/assets/info.svg" className="hover:cursor-pointer" />
            </div> */}
          </div>

          <div className="flex w-full items-center space-x-5 text-sm">
            <span className="whitespace-nowrap font-semibold w-2/5">
              Access Key Secret:{" "}
            </span>
            <input
              type="text"
              placeholder="AWS Access Key Secret"
              className="p-3 rounded-md border w-full"
              value={accessKeySecret}
              onChange={(e) => setAccessKeySecret(e.target.value)}
            />
            {/* <img src="/assets/info.svg" className="w-5 hover:cursor-pointer" /> */}
          </div>

          <div className="flex w-full items-center space-x-5 text-sm">
            <span className="whitespace-nowrap font-semibold w-2/5">
              S3 Bucket Name:{" "}
            </span>
            <input
              type="text"
              placeholder="AWS S3 Bucket Name"
              className="p-3 rounded-md border w-full"
              value={bucketName}
              onChange={(e) => setBucketName(e.target.value)}
            />
            {/* <img src="/assets/info.svg" className="w-5 hover:cursor-pointer" /> */}
          </div>
          <button className="flex w-full h-5 border p-5 items-center justify-center bg-orange-400 rounded-md text-white border hover:cursor-pointer hover:bg-orange-500">
            Save Connection Details
          </button>
        </div>
      </form>
    </Layout>
  );
}

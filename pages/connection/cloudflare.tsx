import { useContext, useState } from "react";
import InfoBanner from "../../components/InfoBanner";
import Layout from "../../components/Layout";
import CloudflareContext from "../../context/CloudflareStore";
import Modal from "../../components/Modal";

export default function CloudflareConnection() {
  const { cloudflareConnection, setCloudflareConnection } =
    useContext(CloudflareContext);

  const [accountId, setAccountId] = useState(cloudflareConnection?.accountId);
  const [bearerToken, setBearerToken] = useState(cloudflareConnection?.bearerToken);
  const [isModalVisible, setModalVisibility] = useState(false);

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setCloudflareConnection({ accountId, bearerToken });
    setModalVisibility(true)
  };

  return (
    <Layout
      pageTitle={"Cloudflare Connection Details"}
      subTitle={
        "Allows communication to Cloudflare Stream API from the browser"
      }
      enablePrevious={true}
    >
      <Modal
        bannerText="Cloudflare Connection Settings Saved Successfully!"
        isVisible={isModalVisible}
        setVisible={setModalVisibility}
      />

      <InfoBanner bannerText="All connection information is only stored on the client. Nothing is stored on any server." />

      <div className="flex self-center mt-12 text-lg flex items-center space-x-3 p-3 font-semibold">
        <img src="/assets/cloudflare.svg" className="w-8" />
        <span>Store Cloudflare API Credentials</span>
      </div>
      <form onSubmit={handleSubmit} className="flex justify-center w-full">
        <div className="w-full p-5 bg-slate-50 flex self-center rounded-sm border flex-col space-y-3">

          <div className="flex items-center space-x-5 text-sm">
            <label
              htmlFor="account_id"
              className="whitespace-nowrap font-semibold w-1/5"
            >
              Account ID:
            </label>
            <input
              type="text"
              name="account_id"
              placeholder="Cloudflare Account ID"
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              className="p-3 rounded-md border w-full"
              required
            />
            {/* <img src="/assets/info.svg" className="w-5 hover:cursor-pointer" /> */}
          </div>

          <div className="flex w-full items-center space-x-5 text-sm">
            <label
              htmlFor="bearer_token"
              className="whitespace-nowrap font-semibold w-1/5"
            >
              Bearer Token:
            </label>
            <input
              type="text"
              name="bearer_token"
              placeholder="Cloudflare Bearer Token"
              value={bearerToken}
              onChange={(e) => setBearerToken(e.target.value)}
              className="p-3 rounded-md border w-full"
              required
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

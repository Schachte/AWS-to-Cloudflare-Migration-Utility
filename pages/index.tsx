import Layout from "../components/Layout";
import Button from "../components/Button";

export default function Home() {
  const pageTitle = "AWS To Cloudflare Migration Utility";
  const subTitle = "Simplifying Stream Migration from Amazon S3";

  return (
    <Layout pageTitle={pageTitle} subTitle={subTitle} enablePrevious={false}>
      <div className="flex space-x-16 mt-5 w-20 justify-center">
        <img src="/assets/aws.svg" />
        <img src="/assets/arrow.svg" />
        <img src="/assets/cloudflare.svg" />
      </div>

      <div className="w-full flex flex-col items-center space-y-3 text-slate-700">
        <Button
          text="Migrate S3 To Cloudflare Stream"
          logo="/assets/video.svg"
          link="/details"
          enableArrowAnimation={true}
        />

        <div
          onClick={() => alert("Migration to R2 is not yet supported!")}
          className="opacity-40 flex group space-x-5 w-9/12 border mt-8 rounded flex font-semibold text-xl h-12 items-center hover:cursor-not-allowed"
        >
          <img src="/assets/db.svg" className="w-12 h-8" />
          <div className="flex items-center text-sm w-full">
            <span className="group">
              Migrate S3 To Cloudflare R2 (coming soon)
            </span>
          </div>
        </div>
      </div>
    </Layout>
  );
}

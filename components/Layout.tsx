import { useRouter } from "next/router";

type Props = {
  pageTitle?: String;
  subTitle?: String;
  children?: JSX.Element | JSX.Element[];
  enablePrevious?: boolean;
};

const Layout: React.FC<Props> = ({
  pageTitle,
  subTitle,
  enablePrevious = true,
  children,
}) => {
  const router = useRouter();

  return (
    <div className="relative flex flex-col mt-12 items-center container mx-auto w-11/12 max-w-[1000px] min-h-screen h-screen">
      <div className="flex w-full justify-between">
        {enablePrevious && (
          <div
            onClick={() => router.back()}
            className="w-1/3 justify-self-start w-12 hover:cursor-pointer hover:text-slate-300 duration-400 transition-all ease-in-out"
          >
            Back
          </div>
        )}
        <h1 onClick={() => router.push('/')} className="w-1/3 font-bold ml-auto text-xl text-slate-700 text-center hover:cursor-pointer">
          {pageTitle}
        </h1>
        <div className="w-1/3"></div>
      </div>
      <h2 className="font-normal text-md pt-2 text-slate-400 text-center">{subTitle}</h2>
      <hr className="w-full mt-5" />
      {children}
    </div>
  );
};

export default Layout;

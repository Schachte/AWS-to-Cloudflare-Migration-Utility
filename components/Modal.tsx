import { useRouter } from "next/router";

type Props = {
  bannerText?: string;
  isVisible?: boolean;
  setVisible: (visible: boolean) => void;
};

const Modal: React.FC<Props> = ({
  bannerText,
  isVisible = false,
  setVisible,
}) => {
const router = useRouter();
  if (isVisible) {
    return (
      <div className="absolute flex flex-col text-slate-600 items-center mt-1 pb-5 text-lg top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-2xl bg-white border w-7/12 h-[150px] rounded justify-center">
        <span className="font-bold">ℹ️ {bannerText}</span>
        <div
          onClick={() => {
            setVisible(false)
            router.back()
          }}
          className="absolute -bottom-1 flex justify-center w-full bg-orange-400 text-white p-2 rounded-b hover:bg-orange-500 hover:cursor-pointer"
        >
          Close
        </div>
      </div>
    );
  }
  return <></>;
};

export default Modal;

type Props = {
  bannerText: string;
};

const InfoBanner: React.FC<Props> = ({ bannerText }) => {
  return (
    <div className="w-full h-10 bg-blue-50 border border-blue-400 text-slate-700 rounded mt-5 flex items-center pl-3 space-x-2">
      <img src="/assets/info.svg" className="w-6" />
      <span>{bannerText}</span>
    </div>
  );
};

export default InfoBanner;

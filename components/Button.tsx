import Link from "next/link";

type Props = {
  text: string;
  link?: string;
  logo?: string;
  enableArrowAnimation?: boolean;
  fn?: () => void
};

const Button: React.FC<Props> = ({ text, logo, link, enableArrowAnimation, fn}) => {
  return (
    <div onClick={() => {
        if (fn) {
            fn()
        }
    }} className="group w-9/12 border mt-8 rounded flex font-semibold text-xl h-12 items-center hover:cursor-pointer hover:bg-slate-100 hover:border-slate-400 transition-all duration-300">
      <Link href={link || "#"} className="flex space-x-5">
        <img src={logo} className="w-12 h-8 ml-1" />
        <div className="flex items-center text-sm w-full">
          <span className="group">{text}</span>
          {enableArrowAnimation && (
            <div className="invisible pt-3 group-hover:visible items-center pr-2">
              <svg
                className="arrow"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M10 0L15 5L10 10" stroke="#000" />
              </svg>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default Button;

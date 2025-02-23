"use client";

import { ReactNode } from "react";
import styles from "./index.module.css";
import classNames from "classnames";
import useScrollDisable from "@/hooks/useScrollDisable";

export interface BottomSheetProps {
  title: string;
  content: ReactNode;
  hasCloseBtn?: boolean;
  isOpen: boolean;
  onClose?: () => void;
}

const BottomSheet = ({
  title,
  content,
  hasCloseBtn = false,
  isOpen,
  onClose,
}: BottomSheetProps) => {
  useScrollDisable(isOpen);

  return (
    <div className={classNames("fixed inset-0 z-30 overflow-hidden")}>
      <div
        className={classNames(
          "absolute  left-0 right-0 rounded-lg rounded-b-none py-7  bg-white text-black transition-[bottom] duration-300",
          { "-bottom-full": !isOpen },
          { "bottom-0": isOpen },
        )}
      >
        <h3 className="px-5 text-lg mb-1">{title}</h3>

        <div
          className={`${styles.contentWrapper} min-h-20 max-h-40 overflow-y-auto scroll px-5 py-2`}
        >
          {content}
        </div>
      </div>
    </div>
  );
};

export default BottomSheet;

// "use client";

// import { ReactNode } from "react";
// import styles from "./index.module.css";
// import classNames from "classnames";

// export interface BottomSheetProps {
//   title: string;
//   content: ReactNode;
//   hasCloseBtn?: boolean;
//   isOpen: boolean;
//   onClose?: () => void;
// }

// const BottomSheet = ({
//   title,
//   content,
//   hasCloseBtn = false,
//   isOpen,
//   onClose,
// }: BottomSheetProps) => {
//   return (
//     <div className={classNames("fixed inset-0 z-20 bg-red-500")}>
//       <div
//         className={classNames(
//           `absolute bottom-0 left-0 right-0 rounded-md rounded-b-none py-7 transition-[bottom] duration-300  bg-black`,
//           { "bottom-[-100%]": isOpen },
//           { "bottom-0": !isOpen },
//         )}
//       >
//         <h3 className="px-5 text-lg mb-1">{title}</h3>

//         <div
//           className={`${styles.contentWrapper} min-h-40 max-h-56 overflow-y-auto scroll px-5 py-2`}
//         >
//           {content}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BottomSheet;

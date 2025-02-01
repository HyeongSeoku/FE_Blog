import classNames from "classnames";
import Link from "next/link";
import { usePathname } from "next/navigation";
import RightArrow from "@/icon/arrow_right.svg";
import LeftArrow from "@/icon/arrow_left.svg";
import DoubleLeftArrow from "@/icon/double_arrow_left.svg";
import DoubleRightArrow from "@/icon/double_arrow_right.svg";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  moveByLink?: boolean;
  pathname?: string;
  pageParam?: string;
  perPageCount?: number;
  isReplace?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  moveByLink = false,
  pathname = "",
  pageParam = "",
  perPageCount = 5,
  isReplace = false,
}) => {
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    onPageChange(page);
  };

  const range = (start: number, end: number): number[] => {
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const generatePages = (): number[] => {
    const totalVisible = perPageCount;
    const halfVisible = Math.floor(totalVisible / 2);

    let start = Math.max(currentPage - halfVisible, 1);
    let end = Math.min(currentPage + halfVisible, totalPages);

    if (currentPage <= halfVisible) {
      start = 1;
      end = Math.min(totalVisible, totalPages);
    }

    if (currentPage + halfVisible > totalPages) {
      end = totalPages;
      start = Math.max(totalPages - totalVisible + 1, 1);
    }

    return range(start, end);
  };

  const pages = generatePages();
  const isSinglePage = totalPages <= 1;
  const isPrevBtnDisabled = currentPage === 1;
  const isNextBtnDisabled = currentPage === totalPages;
  const showShortCutNavigateBtn = !isSinglePage && totalPages > perPageCount;

  if (moveByLink) {
    const path = pathname || usePathname();
    const href = (page: number) => {
      const pageNumber = Math.max(Math.min(page, totalPages), 0);

      if (pageNumber === 0 || pageNumber === 1) return path;
      if (pageParam) {
        return `${path}?${pageParam}=${pageNumber}`;
      }
      return `${path}/${pageNumber}`;
    };

    return (
      <nav className="flex items-center justify-center space-x-2 h-8">
        {showShortCutNavigateBtn && (
          <Link
            href={href(1)}
            replace={isReplace}
            className={classNames(
              "flex items-center justify-center h-full w-8 p-1 rounded-md transition-[background-color,color] duration-300",
              {
                "hover:bg-gray-100 hover:text-gray-900": !isPrevBtnDisabled,
                "cursor-not-allowed text-gray-500": isPrevBtnDisabled,
              },
            )}
            aria-label="First Page"
          >
            <DoubleLeftArrow width={15} height={15} />
          </Link>
        )}
        {!isSinglePage && (
          <Link
            href={href(currentPage - 1)}
            className={classNames(
              "flex items-center justify-center h-full w-8 p-1 rounded-md transition-[background-color,color] duration-300",
              {
                "hover:bg-gray-100 hover:text-gray-900": !isPrevBtnDisabled,
                "cursor-not-allowed text-gray-500": isPrevBtnDisabled,
              },
            )}
            aria-label="Previous Page"
          >
            <LeftArrow width={15} height={15} />
          </Link>
        )}

        {pages.map((page) => (
          <Link
            href={href(page)}
            replace={isReplace}
            key={page}
            className={classNames("px-3 py-1 rounded-md border", {
              "border-gray-200": page === currentPage,
              "border-transparent": page !== currentPage,
            })}
          >
            {page}
          </Link>
        ))}

        {!isSinglePage && (
          <Link
            href={href(currentPage + 1)}
            className={classNames(
              "flex items-center justify-center h-full w-8 p-1 rounded-md  transition-[background-color,color]",
              {
                "hover:bg-gray-100 hover:text-gray-900": !isNextBtnDisabled,
                "cursor-not-allowed text-gray-500": isNextBtnDisabled,
              },
            )}
            aria-label="Next Page"
          >
            <RightArrow width={15} height={15} />
          </Link>
        )}

        {showShortCutNavigateBtn && (
          <Link
            href={href(totalPages)}
            replace={isReplace}
            className={classNames(
              "flex items-center justify-center h-full w-8 p-1 rounded-md transition-[background-color,color] duration-300",
              {
                "hover:bg-gray-100 hover:text-gray-900": !isNextBtnDisabled,
                "cursor-not-allowed text-gray-500": isNextBtnDisabled,
              },
            )}
            aria-label="Last Page"
          >
            <DoubleRightArrow width={15} height={15} />
          </Link>
        )}
      </nav>
    );
  }

  return (
    <nav className="flex items-center justify-center space-x-2 h-8">
      {showShortCutNavigateBtn && (
        <button
          className={classNames(
            "flex items-center justify-center h-full w-8 p-1 rounded-md transition-[background-color,color] duration-300",
            {
              "hover:bg-gray-100 hover:text-gray-900": !isPrevBtnDisabled,
              "cursor-not-allowed text-gray-500": isPrevBtnDisabled,
            },
          )}
          onClick={() => handlePageChange(1)}
          disabled={isPrevBtnDisabled}
          aria-label="First Page"
        >
          <DoubleLeftArrow width={15} height={15} />
        </button>
      )}
      {!isSinglePage && (
        <button
          className={classNames(
            "flex items-center px-3 py-1 rounded-md h-full w-8 p-1 transition-[background-color,color] duration-300  hover:text-black disabled:cursor-not-allowed disabled:text-gray-500",
            {
              "hover:bg-gray-100 hover:text-gray-900": !isPrevBtnDisabled,
            },
          )}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={isPrevBtnDisabled}
          aria-label="Previous Page"
        >
          <LeftArrow width={15} height={15} />
        </button>
      )}

      {pages.map((page) => (
        <button
          key={page}
          className={classNames(
            "px-3 py-1 rounded-md transition-[background-color,color] duration-300 hover:bg-gray-100 hover:text-gray-900 border",
            {
              "border-gray-200": page === currentPage,
              "border-[var(--bg-color)]": page !== currentPage,
            },
          )}
          onClick={() => handlePageChange(page as number)}
        >
          {page}
        </button>
      ))}

      {!isSinglePage && (
        <button
          className={classNames(
            "flex items-center px-3 py-1 rounded-md disabled:cursor-not-allowed transition-[background-color,color] disabled:text-gray-500",
            {
              "hover:bg-gray-100 hover:text-gray-900": !isNextBtnDisabled,
            },
          )}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={isNextBtnDisabled}
          aria-label="Next Page"
        >
          <RightArrow />
        </button>
      )}
      {showShortCutNavigateBtn && (
        <button
          className={classNames(
            "flex items-center justify-center h-full w-8 p-1 rounded-md transition-[background-color,color] duration-300",
            {
              "hover:bg-gray-100 hover:text-gray-900": !isNextBtnDisabled,
              "cursor-not-allowed text-gray-500": isNextBtnDisabled,
            },
          )}
          onClick={() => handlePageChange(totalPages)}
          disabled={isNextBtnDisabled}
          aria-label="Last Page"
        >
          <DoubleRightArrow width={15} height={15} />
        </button>
      )}
    </nav>
  );
};

export default Pagination;

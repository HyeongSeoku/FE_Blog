import { paginationButtonVariants } from "@seoku/design-system";
import classNames from "classnames";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LeftArrow from "@/icon/arrow_left.svg";
import RightArrow from "@/icon/arrow_right.svg";
import DoubleLeftArrow from "@/icon/double_arrow_left.svg";
import DoubleRightArrow from "@/icon/double_arrow_right.svg";

const navItemClassName = (disabled: boolean) =>
  classNames(
    paginationButtonVariants({ variant: "default" }),
    disabled && "!pointer-events-none !opacity-40",
  );

const pageItemClassName = (isCurrent: boolean) =>
  paginationButtonVariants({ variant: isCurrent ? "active" : "default" });

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  moveByLink?: boolean;
  pathname?: string;
  pageParam?: string;
  pageSegment?: string;
  perPageCount?: number;
  isReplace?: boolean;
  preserveScroll?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  moveByLink = false,
  pathname = "",
  pageParam = "",
  pageSegment = "",
  perPageCount = 5,
  isReplace = false,
  preserveScroll = true,
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

  const hookPathname = usePathname();
  const resolvedPathname = pathname ?? hookPathname;

  if (moveByLink) {
    const path = resolvedPathname;
    const href = (page: number) => {
      const pageNumber = Math.max(Math.min(page, totalPages), 0);

      if (pageNumber === 0 || pageNumber === 1) return path;
      if (pageParam) {
        return `${path}?${pageParam}=${pageNumber}`;
      }
      if (pageSegment) {
        return `${path}/${pageSegment}/${pageNumber}`;
      }
      return `${path}/${pageNumber}`;
    };

    return (
      <nav className="flex items-center justify-center space-x-2 h-8">
        {showShortCutNavigateBtn && (
          <Link
            href={href(1)}
            replace={isReplace}
            scroll={!preserveScroll}
            className={navItemClassName(isPrevBtnDisabled)}
            aria-label="First Page"
          >
            <DoubleLeftArrow style={{ width: 15, height: 15 }} />
          </Link>
        )}
        {!isSinglePage && (
          <Link
            href={href(currentPage - 1)}
            replace={isReplace}
            scroll={!preserveScroll}
            className={navItemClassName(isPrevBtnDisabled)}
            aria-label="Previous Page"
          >
            <LeftArrow style={{ width: 15, height: 15 }} />
          </Link>
        )}

        {pages.map((page) => (
          <Link
            href={href(page)}
            replace={isReplace}
            scroll={!preserveScroll}
            key={page}
            className={pageItemClassName(page === currentPage)}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </Link>
        ))}

        {!isSinglePage && (
          <Link
            href={href(currentPage + 1)}
            replace={isReplace}
            scroll={!preserveScroll}
            className={navItemClassName(isNextBtnDisabled)}
            aria-label="Next Page"
          >
            <RightArrow style={{ width: 15, height: 15 }} />
          </Link>
        )}

        {showShortCutNavigateBtn && (
          <Link
            href={href(totalPages)}
            replace={isReplace}
            scroll={!preserveScroll}
            className={navItemClassName(isNextBtnDisabled)}
            aria-label="Last Page"
          >
            <DoubleRightArrow style={{ width: 15, height: 15 }} />
          </Link>
        )}
      </nav>
    );
  }

  return (
    <nav className="flex items-center justify-center space-x-2 h-8">
      {showShortCutNavigateBtn && (
        <button
          type="button"
          className={navItemClassName(isPrevBtnDisabled)}
          onClick={() => handlePageChange(1)}
          disabled={isPrevBtnDisabled}
          aria-label="First Page"
        >
          <DoubleLeftArrow style={{ width: 15, height: 15 }} />
        </button>
      )}
      {!isSinglePage && (
        <button
          type="button"
          className={navItemClassName(isPrevBtnDisabled)}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={isPrevBtnDisabled}
          aria-label="Previous Page"
        >
          <LeftArrow style={{ width: 15, height: 15 }} />
        </button>
      )}

      {pages.map((page) => (
        <button
          type="button"
          key={page}
          className={pageItemClassName(page === currentPage)}
          onClick={() => handlePageChange(page)}
          aria-current={page === currentPage ? "page" : undefined}
        >
          {page}
        </button>
      ))}

      {!isSinglePage && (
        <button
          type="button"
          className={navItemClassName(isNextBtnDisabled)}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={isNextBtnDisabled}
          aria-label="Next Page"
        >
          <RightArrow />
        </button>
      )}
      {showShortCutNavigateBtn && (
        <button
          type="button"
          className={navItemClassName(isNextBtnDisabled)}
          onClick={() => handlePageChange(totalPages)}
          disabled={isNextBtnDisabled}
          aria-label="Last Page"
        >
          <DoubleRightArrow style={{ width: 15, height: 15 }} />
        </button>
      )}
    </nav>
  );
};

export default Pagination;

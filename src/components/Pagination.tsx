import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  showAll?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  showAll = false,
}) => {
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    onPageChange(page);
  };

  const range = (start: number, end: number): number[] => {
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const generatePages = (): (number | "...")[] => {
    if (showAll) {
      return range(1, totalPages);
    }

    const totalPageNumbers = siblingCount * 2 + 3;
    if (totalPages <= totalPageNumbers) {
      return range(1, totalPages);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const pages: (number | "...")[] = [];

    if (leftSiblingIndex > 1) pages.push(1, "...");
    pages.push(...range(leftSiblingIndex, rightSiblingIndex));
    if (rightSiblingIndex < totalPages) pages.push("...", totalPages);

    return pages;
  };

  const pages = generatePages();

  return (
    <nav className="flex items-center justify-center space-x-2">
      <button
        className="px-3 py-1 rounded-md transition-[background-color] duration-300 hover:bg-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous Page"
      >
        « Previous
      </button>

      {pages.map((page, index) =>
        page === "..." ? (
          <span key={index} className="px-3 py-1 text-gray-500">
            {page}
          </span>
        ) : (
          <button
            key={index}
            className={`px-3 py-1 rounded-md transition-[background-color] duration-300 ${
              page === currentPage
                ? "bg-blue-500 text-theme"
                : "hover:bg-gray-400"
            }`}
            onClick={() => handlePageChange(page as number)}
          >
            {page}
          </button>
        ),
      )}

      <button
        className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next Page"
      >
        Next »
      </button>
    </nav>
  );
};

export default Pagination;

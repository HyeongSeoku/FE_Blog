import classNames from "classnames";
import Link from "next/link";
import { ReactNode } from "react";

export interface TagProps {
  href?: string;
  isSelected?: boolean;
  replace?: boolean;
  children: ReactNode;
  className?: string;
}

function Tag({
  href = "",
  replace = false,
  isSelected,
  className = "",
  children,
}: TagProps) {
  if (href) {
    return (
      <Link
        href={href}
        replace={replace}
        className={classNames(
          "bg-[var(--bg-gray-color)] hover:bg-[var(--bg-gray-hover-color)] transition-[background-color] duration-300 px-3 py-1 rounded-full",
          {
            "bg-[var(--contrasting-bg-color)] text-[var(--contrasting-text-color)] hover:bg-[var(--contrasting-bg-color)]":
              isSelected,
          },
          className,
        )}
      >
        {children}
      </Link>
    );
  }

  return (
    <div
      className={classNames(
        "bg-[var(--bg-gray-color)] hover:bg-[var(--bg-gray-hover-color)] transition-[background-color] duration-300 px-3 py-1 rounded-full",
        {
          "bg-[var(--contrasting-bg-color)] text-[var(--contrasting-text-color)] hover:bg-[var(--contrasting-bg-color)]":
            isSelected,
        },
        className,
      )}
    >
      {children}
    </div>
  );
}

export default Tag;

import { Badge, badgeVariants } from "@seoku/design-system";
import classNames from "classnames";
import Link from "next/link";
import type { ReactNode } from "react";

export interface TagProps {
  href?: string;
  isSelected?: boolean;
  replace?: boolean;
  children: ReactNode;
  className?: string;
}

const tagClassName = (isSelected: boolean | undefined, className: string) =>
  classNames(
    badgeVariants({ variant: "outline" }),
    "!inline-flex !h-auto !border-0 !bg-[var(--bg-gray-color)] hover:!bg-[var(--bg-gray-hover-color)] transition-[background-color] duration-300 !px-3 !py-1 !rounded-full !text-inherit !font-normal",
    {
      "!bg-[var(--contrasting-bg-color)] !text-[var(--contrasting-text-color)] hover:!bg-[var(--contrasting-bg-color)]":
        isSelected,
    },
    className,
  );

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
        className={tagClassName(isSelected, className)}
      >
        {children}
      </Link>
    );
  }

  return (
    <Badge variant="outline" className={tagClassName(isSelected, className)}>
      {children}
    </Badge>
  );
}

export default Tag;

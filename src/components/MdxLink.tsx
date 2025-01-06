import Link from "next/link";
import { HTMLAttributeAnchorTarget, ReactNode } from "react";
import ExternalIcon from "@/icon/external.svg";

interface MdxLinkProps {
  target?: HTMLAttributeAnchorTarget;
  href?: string;
  children: ReactNode;
}

const MdxLink = ({ href = "", target = "_self", children }: MdxLinkProps) => {
  return (
    <Link
      href={href}
      target={target}
      rel="noopener noreferrer"
      className="flex items-center hover:underline"
    >
      {children}
      <ExternalIcon width={16} height={16} />
    </Link>
  );
};

export default MdxLink;

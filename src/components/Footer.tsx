import {
  EMAIL_ADDRESS,
  LINKED_IN_URL,
  MY_GITHUB_URL,
} from "@/constants/basic.constants";

const FOOTER_LINKS = [
  { label: "Github", href: MY_GITHUB_URL },
  { label: "Linkedin", href: LINKED_IN_URL },
  { label: "Contact", href: `mailto:${EMAIL_ADDRESS}` },
  { label: "RSS", href: "/feed.xml" },
];

const Footer = () => {
  return (
    <footer className="w-full pb-[clamp(28px,7vw,48px)] pt-sk-section">
      <div className="mx-auto flex w-full max-w-[680px] flex-wrap items-baseline justify-between gap-x-4 gap-y-2 px-5">
        <span className="text-sk-label font-normal text-muted">
          © {new Date().getFullYear()}
        </span>
        <nav className="flex items-baseline gap-4">
          {FOOTER_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sk-label font-normal text-muted transition-opacity hover:opacity-[.55]"
            >
              {label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
};

export default Footer;

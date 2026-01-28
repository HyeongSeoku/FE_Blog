import GitHubIssueButton from "./GithubIssueButton";
import RssIcon from "../icon/rss.svg";

const Footer = () => {
  return (
    <footer className="px-64 py-5 desktop-only:px-44 tablet-only:px-32 mobile:px-5 mobile:py-3 max-w-[1600px] mx-auto">
      <section className="flex items-center justify-center mt-1">
        <span className="text-sm mr-2 text-gray-500 dark:text-gray-400">
          © 2025 Seok All rights reserved.
        </span>
        <GitHubIssueButton className="!bg-transparent hover:!bg-gray-400/20" />
        <a
          href="/feed.xml"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-lg transition-colors hover:bg-gray-400/20 text-gray-500 overflow-hidden"
          aria-label="RSS Feed"
        >
          <RssIcon className="w-5 h-5" />
        </a>
      </section>
    </footer>
  );
};

export default Footer;

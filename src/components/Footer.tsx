import GitHubIssueButton from "./GithubIssueButton";

const Footer = () => {
  return (
    <footer className="px-64 py-5 desktop-only:px-44 tablet-only:px-32 mobile:px-5 mobile:py-3 max-w-[1600px] mx-auto">
      <section className="flex items-center justify-center mt-1">
        <span className="text-sm mr-2 text-gray-500 dark:text-gray-400">
          © 2025 Seok All rights reserved.
        </span>
        <GitHubIssueButton className="!bg-transparent hover:!bg-gray-400/20" />
      </section>
    </footer>
  );
};

export default Footer;

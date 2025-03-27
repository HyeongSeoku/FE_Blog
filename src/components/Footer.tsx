import GitHubIssueButton from "./GithubIssueButton";

const Footer = () => {
  return (
    <footer className="px-64 py-5 lg-xl:px-44 md-lg:px-32 md:px-5 md:py-3 max-w-[1600px] mx-auto">
      <section className="flex items-center justify-center mt-1">
        <span className="text-xl font-semibold mr-2">ⓒ 2024 seoku</span>
        <span className="text-xs font-thin">powered by Vercel</span>
        <GitHubIssueButton className="!bg-transparent hover:!bg-gray-400/20">
          Report Issue
        </GitHubIssueButton>
      </section>
    </footer>
  );
};

export default Footer;

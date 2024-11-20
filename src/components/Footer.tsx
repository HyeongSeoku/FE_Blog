import EmailIcon from "@/icon/email.svg";
import GithubIcon from "@/icon/github.svg";
import LinkedInIcon from "@/icon/linkedIn.svg";

import Link from "next/link";

const Footer = () => {
  return (
    <footer>
      <section className="flex items-center justify-center">
        <div className="flex items-center gap-1">
          <Link
            className="text-[var(--text-color)] p-1 rounded-sm transition-colors duration-300 ease-in-out hover:bg-gray-400/20"
            href="mailto:gudtjr3437@gmail.com"
            passHref
            target="_blank"
          >
            <EmailIcon
              alt="email"
              width={20}
              height={20}
              className="relative z-10"
            />
          </Link>
          <Link
            className="text-[var(--text-color)] p-1 rounded-sm transition-colors duration-300 ease-in-out hover:bg-gray-400/20"
            href="https://github.com/HyeongSeoku"
            passHref
            target="_blank"
          >
            <GithubIcon alt="email" width={20} height={20} />
          </Link>
          <Link
            className="text-[var(--text-color)] p-1 rounded-sm transition-colors duration-300 ease-in-out hover:bg-gray-400/20"
            href="https://www.linkedin.com/in/%ED%98%95%EC%84%9D-%EA%B9%80-901539232/"
            passHref
            target="_blank"
          >
            <LinkedInIcon alt="email" width={20} height={20} />
          </Link>
        </div>
      </section>
      <section className="flex items-baseline justify-center mt-1">
        <span className="text-xl font-semibold mr-2">ⓒ 2024 seoku</span>
        <span className="text-xs font-thin">powered by Vercel</span>
      </section>
    </footer>
  );
};

export default Footer;

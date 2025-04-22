import Link from "next/link";
import Image from "next/image";

import EmailIcon from "@/icon/email.svg";
import GithubIcon from "@/icon/github.svg";
import LinkedInIcon from "@/icon/linkedIn.svg";
import { GithubUserInfo } from "@/api/github";

interface IntroSectionTemplateProps {
  githubData?: GithubUserInfo;
}

const IntroSectionTemplate = ({ githubData }: IntroSectionTemplateProps) => {
  return (
    <section className="flex flex-col gap-2">
      <div className="flex gap-1 items-center h-8">
        <strong className="text-xl">김형석</strong>
        {githubData && (
          <a
            href={githubData.html_url}
            target="_blank"
            className="p-1 rounded-sm transform duration-300 will-change-transform hover:bg-gray-400/20"
          >
            <Image
              src={githubData.avatar_url}
              alt=""
              width={22}
              height={22}
              className="w-6 h-6 rounded-3xl"
            />
          </a>
        )}
      </div>

      <div className="flex flex-col text-sm text-gray-400">
        <p>3년차 프론트엔드 개발자로 일하고 있습니다.</p>
        <p>제가 느끼는 가치는.... 일할때는....</p>
        <p>어떻게 되고 싶은...</p>
      </div>

      <div className="flex items-center gap-1">
        <Link
          className="text-theme p-1 rounded-sm transition-colors duration-300 ease-in-out hover:bg-gray-400/20"
          href="mailto:gudtjr3437@gmail.com"
          passHref
          target="_blank"
        >
          <EmailIcon title="email" style={{ width: 20, height: 20 }} />
        </Link>
        <Link
          className="text-theme p-1 rounded-sm transition-colors duration-300 ease-in-out hover:bg-gray-400/20"
          href="https://github.com/HyeongSeoku"
          passHref
          target="_blank"
        >
          <GithubIcon title="email" style={{ width: 20, height: 20 }} />
        </Link>
        <Link
          className="text-theme p-1 rounded-sm transition-colors duration-300 ease-in-out hover:bg-gray-400/20"
          href="https://www.linkedin.com/in/%ED%98%95%EC%84%9D-%EA%B9%80-901539232/"
          passHref
          target="_blank"
        >
          <LinkedInIcon title="email" style={{ width: 20, height: 20 }} />
        </Link>
      </div>
    </section>
  );
};

export default IntroSectionTemplate;

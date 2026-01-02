import Link from "next/link";
import Image from "next/image";

import EmailIcon from "@/icon/email.svg";
import GithubIcon from "@/icon/github.svg";
import LinkedInIcon from "@/icon/linkedIn.svg";
import { GithubUserInfo } from "@/api/github";
import { getYearsWorked } from "@/utils/util";
import {
  EMAIL_ADDRESS,
  LINKED_IN_URL,
  MY_GITHUB_URL,
} from "@/constants/basic.constants";

interface IntroSectionTemplateProps {
  githubData?: GithubUserInfo | null;
}

const IntroSectionTemplate = ({ githubData }: IntroSectionTemplateProps) => {
  const workedYear = getYearsWorked();
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
              alt={githubData.name}
              width={22}
              height={22}
              className="w-6 h-6 rounded-3xl"
            />
          </a>
        )}
      </div>

      <div className="flex flex-col text-sm text-gray-400">
        <p>{workedYear}년차 프론트엔드 개발자로 일하고 있습니다.</p>
        <p>코드를 넘어 사용자와 제품을 이해하는 개발자가 되고 싶습니다.</p>
        <p>지속적으로 성장하며 좋은 경험을 만드는 일을 하고 싶습니다.</p>
      </div>

      <div className="flex items-center gap-1">
        <Link
          className="text-theme p-1 rounded-sm transition-colors duration-300 ease-in-out hover:bg-gray-400/20"
          href={`mailto:${EMAIL_ADDRESS}`}
          passHref
          target="_blank"
        >
          <EmailIcon title="email" style={{ width: 20, height: 20 }} />
        </Link>
        <Link
          className="text-theme p-1 rounded-sm transition-colors duration-300 ease-in-out hover:bg-gray-400/20"
          href={MY_GITHUB_URL}
          passHref
          target="_blank"
        >
          <GithubIcon title="email" style={{ width: 20, height: 20 }} />
        </Link>
        <Link
          className="text-theme p-1 rounded-sm transition-colors duration-300 ease-in-out hover:bg-gray-400/20"
          href={LINKED_IN_URL}
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

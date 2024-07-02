import { LoaderFunction, MetaFunction, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import {
  ChangeEvent,
  MouseEvent,
  SyntheticEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import { getBasicInfoPost, postCreatePost } from "server/posts";
import useUserStore from "store/user";
import { loaderCheckUser } from "utils/auth";
import AutoComplete from "~/components/shared/AutoComplete";
import useSyncUserStore from "~/hooks/useSyncUserStore";
import { Handle } from "~/types/handle";
import { AuthLoaderData } from "~/types/shared";
import {
  BasicInfoResponse,
  CreatePostRequest,
} from "../../../../types/posts/posts.api";
import classNames from "classnames";

export interface WriteLoaderData extends AuthLoaderData {
  basicInfoData: BasicInfoResponse;
}

export const meta: MetaFunction = () => {
  return [
    { charset: "utf-8" },
    { title: "글 작성 페이지" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
  ];
};

export const handle: Handle = {
  headerType: "BACK",
};

export const loader: LoaderFunction = async ({ request }) => {
  const { user, headers } = await loaderCheckUser(request, true);
  const { data: basicInfoData, error } = await getBasicInfoPost(request);

  return json(
    {
      user,
      basicInfoData,
    },
    { headers },
  );
};

export default function Write() {
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState(-1);

  const [tagList, setTagList] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [markdown, setMarkdown] = useState("");
  const { user, basicInfoData } = useLoaderData<WriteLoaderData>();

  const { userStore } = useUserStore();

  const contentEditableRef = useRef<HTMLDivElement>(null);

  useSyncUserStore(user);

  const handleChange = (e: SyntheticEvent) => {
    const target = e.target as HTMLDivElement;
    setMarkdown(target.innerText);
  };

  const handleChangeTitle = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setTitle(value);
  };

  const handleChangeCategory = (e: MouseEvent<HTMLButtonElement>) => {
    const { value } = e.currentTarget;
    setCategoryId(parseInt(value));
  };

  const handleAddTag = (tag: string) => {
    if (!tagList.includes(tag)) {
      setTagList((current) => [...current, tag]);
    }
  };

  const handleSubmitPost = async () => {
    const ERROR_OBJ = {
      title: "제목",
      markdown: "본문",
      categoryKey: "카테고리",
    };
    if (!title) {
      alert(`${ERROR_OBJ.title}을 입력해주세요.`);
      return;
    }
    if (!markdown) {
      alert(`${ERROR_OBJ.markdown}을 입력해주세요.`);
      return;
    }
    if (!categoryId) {
      alert(`${ERROR_OBJ.categoryKey}을 입력해주세요.`);
      return;
    }

    const postObj: CreatePostRequest = {
      title,
      body: markdown,
      categoryId,
      tagNames: tagList,
    };

    const { data } = await postCreatePost(postObj);

    if (!data?.success) {
      alert("오류 발생!");
      return;
    }

    resetWritePost();
  };

  const resetWritePost = () => {
    setTitle("");
    setCategoryId(-1);
    setMarkdown("");
    setTagList([]);
    setNewTag("");
  };

  useEffect(() => {
    console.log("TEST", categoryId);
  }, [categoryId]);

  return (
    <div className="container">
      <h1 className="text-3xl font-bold mb-4">글 작성</h1>
      {/* FORM 영역 */}
      <div>
        <h2>제목</h2>
        <input value={title} onChange={handleChangeTitle} placeholder="제목" />

        <div>
          <div>카테고리</div>
          <ul className="flex justify-center items-center gap-2">
            {basicInfoData?.categoryList?.map(
              ({ categoryId: id, name, categoryKey: key }) => (
                <button
                  key={key}
                  value={id}
                  onClick={handleChangeCategory}
                  className={classNames("w-full", "p-2", "box-border", {
                    "border border-blue-500 rounded-xl": categoryId === id,
                  })}
                >
                  {name}
                </button>
              ),
            )}
          </ul>
        </div>

        <div>
          <div>태그</div>
          {tagList.map((tag, index) => (
            <div key={index}>{tag}</div>
          ))}
          <AutoComplete
            suggestions={
              basicInfoData?.tagList?.list?.map((item) => item?.name) || []
            }
            onSelectSuggestion={handleAddTag}
            inputValue={newTag}
            setInputValue={setNewTag}
            allowCustomEntries={true}
          />
        </div>

        <h2>본문</h2>
        <div className="flex flex-col md:flex-row">
          <div
            ref={contentEditableRef}
            contentEditable
            className="w-full h-96 p-2 border border-gray-300 rounded overflow-y-auto"
            onInput={handleChange}
          ></div>
          <div className="w-full h-96 p-2 border border-gray-300 rounded overflow-y-auto">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
            >
              {markdown}
            </ReactMarkdown>
          </div>
        </div>
      </div>

      <div>
        <button onClick={handleSubmitPost}>제출</button>
      </div>
    </div>
  );
}

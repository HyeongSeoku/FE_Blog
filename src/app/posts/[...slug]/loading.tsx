import SkeletonBar from "@/components/SkeletonBar";

export default function PostDetailLoading() {
  return (
    <div className="min-h-40 py-5 flex flex-col gap-2">
      <SkeletonBar className="!w-1/5 !h-10 md:!w-1/3" />
      <SkeletonBar />
      <SkeletonBar />
      <SkeletonBar className="!w-1/3 !h-8 md:!w-1/2 mt-4" />
      <SkeletonBar />
      <SkeletonBar />
      <SkeletonBar />

      <SkeletonBar className="!w-1/3 !h-8 md:!w-1/2 mt-4" />
      <SkeletonBar />
      <SkeletonBar />
    </div>
  );
}

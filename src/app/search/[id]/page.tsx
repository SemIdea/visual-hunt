import { createCaller } from "@/server/caller";
import DisplayResults from "./displayResults";
import RunStatus from "./runStatus";
import Image from "next/image";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

const Page = async (props: PageProps) => {
  const params = await props.params;
  const caller = await createCaller();

  const search = await caller.search.readSearchWithResults({
    id: params.id,
  });

  if (!search) return;

  return (
    <section className="mt-16 flex">
      <div>
        <Image className="h-[500px]" src={search.source} alt="" />
      </div>
      <div className="flex flex-col gap-3">
        {search.status == "COMPLETED" && (
          <DisplayResults results={search.results} />
        )}
        {search.status !== "COMPLETED" && (
          <RunStatus
            jobId={search.jobId}
            publicAccesToken={search.publicAccessToken}
            searchId={search.id}
          />
        )}
      </div>
    </section>
  );
};

export default Page;

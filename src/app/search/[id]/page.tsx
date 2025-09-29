import { createCaller } from "@/server/caller";
import RunStatus from "./runStatus";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

const Page = async (props: PageProps) => {
  const params = await props.params;
  const caller = await createCaller();

  const search = await caller.search.readSearchById({
    id: params.id,
  });

  if (!search) return null;

  return (
    <section className="mt-16">
      <h2>{params.id}</h2>
      {/* <div>{JSON.stringify(search)}</div> */}
      <div>
        <p>
          Status <span>{search.status}</span>
        </p>
        <img src={search.source} />
      </div>
      <RunStatus jobId={search.jobId} publicAccesToken={search.publicAccessToken}/>
    </section>
  );
};

export default Page;

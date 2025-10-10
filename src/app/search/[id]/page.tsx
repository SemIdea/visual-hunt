import { createCaller } from "@/server/caller";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import Results from "./_components/results";
import DisplayImage from "./_components/displayImage";

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

  const session = await getServerSession(authOptions);

  if (!session?.user) return;

  const user = session.user;

  return (
    <section className="container mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8">
        <DisplayImage user={user} search={search} />
        <Results search={search} />
      </div>
    </section>
  );
};

export default Page;

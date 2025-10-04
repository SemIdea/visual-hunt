import { createCaller } from "@/server/caller";
import DisplayResults from "./displayResults";
import RunStatus from "./runStatus";
import { Card, CardContent } from "@/components/ui/card";

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
    <section className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="relative w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="w-full"
                  src={search.source}
                  alt="Source image"
                />
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-6">
            Search Results
          </h1>
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
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
        </div>
      </div>
    </section>
  );
};

export default Page;

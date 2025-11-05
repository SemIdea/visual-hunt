"use client";

import DisplayResults from "./display";
import { trpc } from "@/app/_trpc/client";
import { useRealtimeRun } from "@trigger.dev/react-hooks";
import { skipToken } from "@tanstack/react-query";
import { Spinner } from "@/components/ui/spinner";

const RunStatus = ({
  searchId,
  jobId,
  publicAccessToken,
}: {
  searchId: string;
  jobId: string;
  publicAccessToken: string;
}) => {
  const { run, error } = useRealtimeRun(jobId, {
    accessToken: publicAccessToken,
  });

  const { data: search } = trpc.search.readSearchWithResults.useQuery(
    run?.status === "COMPLETED"
      ? {
          id: searchId,
        }
      : skipToken
  );

  if (error) {
    return <div className="text-red-500">Error: {error.message}</div>;
  }

  if (!run) return null;

  if (run.status === "COMPLETED" && search) {
    return <DisplayResults results={search.results} />;
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Spinner className="h-12 w-12 mb-4 text-primary" />
      <h3 className="text-lg font-semibold text-foreground mb-2">
        Searching across the web...
      </h3>
      <p className="text-muted-foreground">
        We are querying multiple search engines to find the best matches.
      </p>
    </div>
  );
};

export default RunStatus;

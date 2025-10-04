"use client";

import DisplayResults from "./displayResults";
import { trpc } from "@/app/_trpc/client";
import { useRealtimeRun } from "@trigger.dev/react-hooks";
import { skipToken } from "@tanstack/react-query";

const RunStatus = ({
  searchId,
  jobId,
  publicAccesToken,
}: {
  searchId: string;
  jobId: string;
  publicAccesToken: string;
}) => {
  const { run, error } = useRealtimeRun(jobId, {
    accessToken: publicAccesToken,
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

  return <div>{run.status}</div>;
};

export default RunStatus;

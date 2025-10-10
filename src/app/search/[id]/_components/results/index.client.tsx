"use client";

import DisplayResults from "./display";
import { trpc } from "@/app/_trpc/client";
import { useRealtimeRun } from "@trigger.dev/react-hooks";
import { skipToken } from "@tanstack/react-query";

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

  return <div>{run.status}</div>;
};

export default RunStatus;

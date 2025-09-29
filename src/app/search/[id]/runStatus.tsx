"use client";

import { useRealtimeRun } from "@trigger.dev/react-hooks";

const RunStatus = ({
  jobId,
  publicAccesToken,
}: {
  jobId: string;
  publicAccesToken: string;
}) => {
  const { run, error } = useRealtimeRun(jobId, {
    accessToken: publicAccesToken,
  });

  return (
    <div>
      {error?.message}
      {JSON.stringify(run)}
    </div>
  );
};

export default RunStatus;

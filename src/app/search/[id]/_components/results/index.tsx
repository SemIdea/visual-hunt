import { ISearchEntityWithResults } from "@/server/entities/search/DTO";
import DisplayResults from "./display";
import RunStatus from "./index.client";

const Results = ({ search }: { search: ISearchEntityWithResults }) => {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold text-foreground mb-6">
        Search Results
      </h1>
      {search.status == "COMPLETED" && (
          <DisplayResults results={search.results} />
        )}
        {search.status !== "COMPLETED" && (
          <RunStatus
            jobId={search.jobId}
            publicAccessToken={search.publicAccessToken}
            searchId={search.id}
          />
        )}
    </div>
  );
};

export default Results;

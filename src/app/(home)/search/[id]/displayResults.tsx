
import { IResultEntity } from "@/server/entities/result/DTO";

const DisplayResults = ({ results }: { results: IResultEntity[] }) => {
  return results.map((s, i) => (
    <div key={i}>
      <h2>{s.title}</h2>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={s.thumbnail} alt="" />
      <a href={s.link}>{s.link}</a>
    </div>
  ));
};

export default DisplayResults;

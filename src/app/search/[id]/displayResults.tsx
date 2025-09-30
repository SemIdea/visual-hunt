import { IResultEntity } from "@/server/entities/result/DTO";
import Image from "next/image";

const DisplayResults = ({ results }: { results: IResultEntity[] }) => {
  return results.map((s, i) => (
    <div key={i}>
      <h2>{s.title}</h2>
      <Image src={s.thumbnail} alt="" />
      <a href={s.link}>{s.link}</a>
    </div>
  ));
};

export default DisplayResults;

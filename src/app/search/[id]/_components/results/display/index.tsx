import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import type { ResultEntity } from "@/server/features/search/types";

const DisplayResults = ({ results }: { results: ResultEntity[] }) => {
    return (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {results.map((result) => (
                <Card
                    key={result.id}
                    className="break-inside-avoid overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:shadow-primary/20"
                >
                    <CardContent className="p-0">
                        <Link href={result.link} className="block" target="_blank" prefetch={false}>
                            <div className="relative w-full">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={
                                        result.thumbnail ||
                                        "https://placehold.co/600x400?text=No+Image"
                                    }
                                    alt={result.title}
                                    width={300}
                                    height={400}
                                    className="w-full h-auto object-cover"
                                />
                            </div>
                            <div className="px-4 space-y-2">
                                <h3 className="font-semibold text-foreground line-clamp-2 break-words">
                                    {result.title}
                                </h3>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <ExternalLink className="w-4 h-4" />
                                    <span>{result.source}</span>
                                </div>
                            </div>
                        </Link>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default DisplayResults;

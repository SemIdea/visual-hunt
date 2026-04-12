import { Database, Search, Video } from "lucide-react";
import { Card } from "@/components/ui/card";

const Features = () => {
    return (
        <section className="container mx-auto px-4 py-20 md:py-32">
            {/* Feature 1 */}
            <div className="mb-32 grid items-center gap-12 md:grid-cols-2">
                <div>
                    <h2 className="mb-6 text-4xl font-bold md:text-5xl">
                        Go Beyond a Single Search Engine.
                    </h2>
                    <p className="text-lg leading-relaxed text-muted-foreground">
                        Don&apos;t settle for one opinion. VisualHunt queries multiple search
                        databases to find matches that other tools miss, giving you the most
                        comprehensive results.
                    </p>
                </div>
                <div className="relative">
                    <Card className="border-border/50 bg-card/50 p-8 backdrop-blur">
                        <div className="flex flex-col items-center gap-6">
                            <div className="flex flex-wrap justify-center gap-4">
                                <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-border/50 bg-background">
                                    <Database className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-border/50 bg-background">
                                    <Database className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-border/50 bg-background">
                                    <Database className="h-8 w-8 text-muted-foreground" />
                                </div>
                            </div>
                            <div className="text-2xl text-muted-foreground">↓</div>
                            <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-primary">
                                <Search className="h-10 w-10 text-primary-foreground" />
                            </div>
                            <p className="text-center text-sm font-semibold">VisualHunt</p>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Feature 2 */}
            <div className="grid items-center gap-12 md:grid-cols-2">
                <div className="order-2 md:order-1">
                    <Card className="border-border/50 bg-card/50 p-8 backdrop-blur">
                        <div className="flex flex-col items-center gap-6">
                            <div className="relative w-full">
                                <div className="aspect-video rounded-lg border border-border/50 bg-background/50">
                                    <div className="flex h-full items-center justify-center">
                                        <Video className="h-16 w-16 text-muted-foreground" />
                                    </div>
                                </div>
                                <div className="mt-4 flex gap-2">
                                    {[...Array(5)].map((_, i) => (
                                        <div
                                            key={i}
                                            className="h-12 flex-1 rounded border border-border/50 bg-background/50"
                                        />
                                    ))}
                                </div>
                            </div>
                            <p className="text-center text-sm text-muted-foreground">
                                Frame-by-frame analysis
                            </p>
                        </div>
                    </Card>
                </div>
                <div className="order-1 md:order-2">
                    <h2 className="mb-6 text-4xl font-bold md:text-5xl">
                        The First True Video Search.
                    </h2>
                    <p className="text-lg leading-relaxed text-muted-foreground">
                        Stop guessing from screenshots. Upload a video clip, and our tool will
                        analyze individual frames to pinpoint the exact source.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Features;

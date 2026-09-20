import { Clock, Search } from "lucide-react";
import { Card } from "@/components/ui/card";

const Features = () => {
    return (
        <section className="container mx-auto px-4 py-20 md:py-32">
            {/* Feature 1 */}
            <div className="mb-32 grid items-center gap-12 md:grid-cols-2">
                <div>
                    <h2 className="mb-6 text-4xl font-bold md:text-5xl">A Real Reverse Search.</h2>
                    <p className="text-lg leading-relaxed text-muted-foreground">
                        VisualHunt runs your upload through an actual reverse-image-search
                        provider and lists where the image turns up, ranked by relevance.
                    </p>
                </div>
                <div className="relative">
                    <Card className="border-border/50 bg-card/50 p-8 backdrop-blur">
                        <div className="flex flex-col items-center gap-6">
                            <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-border/50 bg-background">
                                <Search className="h-8 w-8 text-muted-foreground" />
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
                            <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-border/50 bg-background">
                                <Clock className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <p className="text-center text-sm text-muted-foreground">
                                Pending → Processing → Completed
                            </p>
                        </div>
                    </Card>
                </div>
                <div className="order-1 md:order-2">
                    <h2 className="mb-6 text-4xl font-bold md:text-5xl">Runs in the Background.</h2>
                    <p className="text-lg leading-relaxed text-muted-foreground">
                        Uploading doesn&apos;t block on the search. A background job does the
                        work and updates the status, so a slow provider never freezes the page.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Features;

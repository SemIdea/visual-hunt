import { CheckCircle2, Sparkles, Upload } from "lucide-react";
import { Card } from "@/components/ui/card";

const HowItWorks = () => {
    return (
        <section className="container mx-auto px-4 py-20 md:py-32">
            <div className="mb-16 text-center">
                <h2 className="mb-4 text-4xl font-bold md:text-5xl">How It Works</h2>
                <p className="text-lg text-muted-foreground">
                    Three simple steps to find any source
                </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
                <Card className="border-border/50 bg-card/50 p-8 text-center backdrop-blur">
                    <div className="mb-6 flex justify-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                            <Upload className="h-8 w-8 text-primary" />
                        </div>
                    </div>
                    <div className="mb-2 text-sm font-semibold text-primary">Step 1</div>
                    <h3 className="mb-3 text-xl font-bold">Upload or Paste</h3>
                    <p className="text-muted-foreground">Provide any image, video clip, or URL.</p>
                </Card>

                <Card className="border-border/50 bg-card/50 p-8 text-center backdrop-blur">
                    <div className="mb-6 flex justify-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                            <Sparkles className="h-8 w-8 text-primary" />
                        </div>
                    </div>
                    <div className="mb-2 text-sm font-semibold text-primary">Step 2</div>
                    <h3 className="mb-3 text-xl font-bold">We Analyze</h3>
                    <p className="text-muted-foreground">
                        Our AI searches across multiple engines simultaneously.
                    </p>
                </Card>

                <Card className="border-border/50 bg-card/50 p-8 text-center backdrop-blur">
                    <div className="mb-6 flex justify-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                            <CheckCircle2 className="h-8 w-8 text-primary" />
                        </div>
                    </div>
                    <div className="mb-2 text-sm font-semibold text-primary">Step 3</div>
                    <h3 className="mb-3 text-xl font-bold">Get Your Source</h3>
                    <p className="text-muted-foreground">
                        Receive a list of the most accurate results in seconds.
                    </p>
                </Card>
            </div>
        </section>
    );
};

export default HowItWorks;

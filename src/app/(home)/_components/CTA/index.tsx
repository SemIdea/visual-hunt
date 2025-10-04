import { Button } from "@/components/ui/button";

const CTA = () => {
  return (
    <section className="border-t border-border/40 bg-muted/20 py-20 md:py-32">
      <div className="container mx-auto px-4 text-center">
        <h2 className="mb-4 text-4xl font-bold md:text-5xl">
          Ready to Find Anything?
        </h2>
        <p className="mb-8 text-lg text-muted-foreground">
          Sign up for a free account to get more searches and save your history.
        </p>
        <Button size="lg" className="text-base">
          Sign Up for Free
        </Button>
      </div>
    </section>
  );
};

export default CTA;

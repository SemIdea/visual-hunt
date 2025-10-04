const SocialProof = () => {
  return (
    <section className="border-y border-border/40 bg-muted/20 py-12">
      <div className="container mx-auto px-4">
        <p className="mb-8 text-center text-sm text-muted-foreground">
          Trusted by creators and communities on
        </p>
        <div className="flex flex-wrap items-center justify-center gap-12 opacity-50 grayscale">
          <div className="text-2xl font-bold">Reddit</div>
          <div className="text-2xl font-bold">Discord</div>
          <div className="text-2xl font-bold">𝕏</div>
        </div>
      </div>
    </section>
  );
};

export default SocialProof;

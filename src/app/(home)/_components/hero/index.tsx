import Upload from "../upload";

const Slogan = () => {
    return (
        <section className="container mx-auto px-4 py-20 md:py-32 relative z-2">
            <div className="mx-auto max-w-4xl text-center">
                <h1 className="mb-6 text-balance text-5xl font-bold leading-tight tracking-tight md:text-7xl">
                    Find the Source of Any Image or Video.
                </h1>
                <p className="mb-12 text-lg text-muted-foreground md:text-xl">
                    Our advanced multi-engine search finds what Google can&apos;t, from anime scenes
                    to obscure memes and video clips. End the search—find the &apos;sauce&apos;.
                </p>
                <Upload />
            </div>
        </section>
    );
};

export default Slogan;

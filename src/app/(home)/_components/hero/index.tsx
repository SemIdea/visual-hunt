import Upload from "../upload";

const Slogan = () => {
    return (
        <section className="container mx-auto px-4 py-20 md:py-32 relative z-2">
            <div className="mx-auto max-w-4xl text-center">
                <h1 className="mb-6 text-balance text-5xl font-bold leading-tight tracking-tight md:text-7xl">
                    Find Where an Image Appears Online.
                </h1>
                <p className="mb-12 text-lg text-muted-foreground md:text-xl">
                    Upload an image and get a real reverse-image search. Processing runs in the
                    background, and results land in your search history when they&apos;re ready.
                </p>
                <Upload />
            </div>
        </section>
    );
};

export default Slogan;

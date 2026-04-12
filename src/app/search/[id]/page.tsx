import { createTRPCContext } from "@/server/createContex";
import { appRouter } from "@/server/routes/app.routes";
import DisplayImage from "./_components/displayImage";
import Results from "./_components/results";

type PageProps = {
    params: Promise<{
        id: string;
    }>;
};

const Page = async (props: PageProps) => {
    const params = await props.params;
    const caller = appRouter.createCaller(await createTRPCContext());

    const search = await caller.search.readSearchWithResults({
        id: params.id,
    });

    if (!search) return;

    return (
        <section className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8">
                <DisplayImage search={search} />
                <Results search={search} />
            </div>
        </section>
    );
};

export default Page;

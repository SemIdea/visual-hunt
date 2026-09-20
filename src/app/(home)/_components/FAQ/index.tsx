import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
    return (
        <section id="faq" className="container mx-auto px-4 py-20 md:py-32">
            <div className="mx-auto max-w-3xl">
                <h2 className="mb-12 text-center text-4xl font-bold md:text-5xl">
                    Frequently Asked Questions
                </h2>
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                        <AccordionTrigger className="text-left text-lg">
                            Is VisualHunt free to use?
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                            Yes. The free tier has a daily search limit and keeps your search
                            history. The paid plan removes the daily limit.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger className="text-left text-lg">
                            How is this different from Google Image Search?
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                            It isn&apos;t trying to be. VisualHunt is a portfolio project built to
                            practice a real async architecture — background jobs, webhooks,
                            per-user auth — on top of a genuine reverse-image-search provider, not
                            a proprietary index.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger className="text-left text-lg">
                            Are my searches private?
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                            No. Uploaded images go through Cloudinary and results are stored so
                            they show up in your search history — nothing is anonymized or
                            auto-deleted. This is a portfolio/study project, not a service you
                            should upload sensitive images to.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </section>
    );
};

export default FAQ;

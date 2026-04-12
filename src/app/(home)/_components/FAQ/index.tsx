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
                            Yes! VisualHunt offers a free tier with limited searches per day. For
                            unlimited searches and advanced features like video search and search
                            history, you can upgrade to our Pro plan.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger className="text-left text-lg">
                            How is this different from Google Image Search?
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                            VisualHunt queries multiple specialized search engines simultaneously,
                            including databases that Google doesn&apos;t index. We also offer true
                            video search by analyzing individual frames, which Google Image Search
                            cannot do.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger className="text-left text-lg">
                            Are my searches private?
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                            Absolutely. We don&apos;t store your uploaded images or search queries
                            beyond what&apos;s necessary to process your request. All data is
                            encrypted in transit and deleted after processing.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </section>
    );
};

export default FAQ;

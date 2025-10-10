import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8">
        Frequently Asked Questions
      </h2>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>What counts as one search?</AccordionTrigger>
          <AccordionContent>
            One search is counted each time you submit an image or video for
            analysis. Whether you use URL input or file upload, each submission
            counts as one search. Multi-engine analysis is included in Pro and
            Expert plans at no additional cost per search.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Can I change my plan later?</AccordionTrigger>
          <AccordionContent>
            Yes, you can upgrade or downgrade your plan at any time. When
            upgrading, you&apos;ll be charged the prorated difference
            immediately. When downgrading, the change will take effect at the
            start of your next billing cycle, and you&apos;ll retain your
            current plan benefits until then.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>What is your refund policy?</AccordionTrigger>
          <AccordionContent>
            We offer a 14-day money-back guarantee for all subscription plans.
            If you&apos;re not satisfied with VisualHunt, contact our support
            team within 14 days of your purchase for a full refund. Credits
            purchased separately are non-refundable but never expire.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default FAQ;
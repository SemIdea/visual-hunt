"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Arc from "@/components/arc";

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);
  const [credits, setCredits] = useState([100]);

  const calculatePrice = (monthlyPrice: number) => {
    if (isYearly) {
      return Math.floor(monthlyPrice * 12 * 0.8);
    }
    return monthlyPrice;
  };

  const creditPrice = (credits[0] / 10).toFixed(0);

  return (
    <div className="min-h-screen bg-background">
      <Arc />
      {/* Header */}
      <div className="container mx-auto px-4 py-16 md:py-24 relative z-2">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
            Find the Perfect Plan
          </h1>
          <p className="text-lg text-muted-foreground mb-8 text-balance max-w-2xl mx-auto">
            Start for free, or unlock powerful features with our Pro plan.
            Cancel anytime.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-3">
            <Label
              htmlFor="billing-toggle"
              className={!isYearly ? "font-semibold" : "text-muted-foreground"}
            >
              Monthly
            </Label>
            <Switch
              id="billing-toggle"
              checked={isYearly}
              onCheckedChange={setIsYearly}
            />
            <Label
              htmlFor="billing-toggle"
              className={isYearly ? "font-semibold" : "text-muted-foreground"}
            >
              Yearly
              <span className="ml-2 text-primary text-sm">(Save 20%)</span>
            </Label>
          </div>
        </div>
        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-20">
          {/* Free Plan */}
          <Card className="flex flex-col bg-card/80 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-2xl">Free</CardTitle>
              <CardDescription>
                For casual users and trying out the basics.
              </CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-muted-foreground"> / month</span>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <Check className="size-5 text-primary shrink-0 mt-0.5" />
                  <span>20 Image Searches / month</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="size-5 text-primary shrink-0 mt-0.5" />
                  <span>Standard Search Speed</span>
                </li>
                <li className="flex items-start gap-2 text-muted-foreground">
                  <X className="size-5 shrink-0 mt-0.5" />
                  <span>Video Search</span>
                </li>
                <li className="flex items-start gap-2 text-muted-foreground">
                  <X className="size-5 shrink-0 mt-0.5" />
                  <span>Multi-Engine Analysis</span>
                </li>
                <li className="flex items-start gap-2 text-muted-foreground">
                  <X className="size-5 shrink-0 mt-0.5" />
                  <span>Save Search History</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full bg-transparent">
                Get Started
              </Button>
            </CardFooter>
          </Card>

          {/* Pro Plan - Highlighted */}
          <Card className="flex flex-col border-primary shadow-lg shadow-primary/20 md:scale-105 bg-card/80 backdrop-blur-xl">
            <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
              Most Popular
            </Badge>
            <CardHeader>
              <CardTitle className="text-2xl">Pro</CardTitle>
              <CardDescription>
                For power users, creators, and professionals.
              </CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">
                  ${calculatePrice(19)}
                </span>
                <span className="text-muted-foreground">
                  {" "}
                  / {isYearly ? "year" : "month"}
                </span>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <Check className="size-5 text-primary shrink-0 mt-0.5" />
                  <span>
                    <strong>Unlimited</strong> Image Searches
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="size-5 text-primary shrink-0 mt-0.5" />
                  <span>
                    <strong>50</strong> Video Searches / month
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="size-5 text-primary shrink-0 mt-0.5" />
                  <span>
                    <strong>Priority</strong> Search Speed
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="size-5 text-primary shrink-0 mt-0.5" />
                  <span>Multi-Engine Analysis</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="size-5 text-primary shrink-0 mt-0.5" />
                  <span>Save Search History</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Choose Pro</Button>
            </CardFooter>
          </Card>

          {/* Expert Plan */}
          <Card className="flex flex-col bg-card/80 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-2xl">Expert</CardTitle>
              <CardDescription>
                For heavy-duty users and small teams.
              </CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">
                  ${calculatePrice(39)}
                </span>
                <span className="text-muted-foreground">
                  {" "}
                  / {isYearly ? "year" : "month"}
                </span>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <Check className="size-5 text-primary shrink-0 mt-0.5" />
                  <span>
                    <strong>Unlimited</strong> Image Searches
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="size-5 text-primary shrink-0 mt-0.5" />
                  <span>
                    <strong>200</strong> Video Searches / month
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="size-5 text-primary shrink-0 mt-0.5" />
                  <span>
                    <strong>Highest Priority</strong> Search Speed
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="size-5 text-primary shrink-0 mt-0.5" />
                  <span>Multi-Engine Analysis</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="size-5 text-primary shrink-0 mt-0.5" />
                  <span>Save Search History</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full bg-transparent">
                Choose Expert
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Pay-As-You-Go Credits Section */}
        <div className="max-w-3xl mx-auto mb-20">
          <Card className="bg-muted/50">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">
                Not a Regular User? Buy Credits Instead.
              </CardTitle>
              <CardDescription>
                Perfect for one-off projects. Credits never expire and can be
                used for any search type.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Select Credits</Label>
                  <span className="text-2xl font-bold">
                    {credits[0]} credits
                  </span>
                </div>
                <Slider
                  value={credits}
                  onValueChange={setCredits}
                  min={50}
                  max={500}
                  step={50}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>50</span>
                  <span>500</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-background rounded-lg border">
                <span className="text-lg">Total Price:</span>
                <span className="text-3xl font-bold">${creditPrice}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" size="lg">
                Buy Credits
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>What counts as one search?</AccordionTrigger>
              <AccordionContent>
                One search is counted each time you submit an image or video for
                analysis. Whether you use URL input or file upload, each
                submission counts as one search. Multi-engine analysis is
                included in Pro and Expert plans at no additional cost per
                search.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Can I change my plan later?</AccordionTrigger>
              <AccordionContent>
                Yes, you can upgrade or downgrade your plan at any time. When
                upgrading, you&apos;ll be charged the prorated difference
                immediately. When downgrading, the change will take effect at
                the start of your next billing cycle, and you&apos;ll retain
                your current plan benefits until then.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>What is your refund policy?</AccordionTrigger>
              <AccordionContent>
                We offer a 14-day money-back guarantee for all subscription
                plans. If you&apos;re not satisfied with VisualHunt, contact our
                support team within 14 days of your purchase for a full refund.
                Credits purchased separately are non-refundable but never
                expire.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
}

import { Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Plan as PlanType } from "@/config/plans";
import { BasicPlanFooter, Price, PricingType } from "../../page.client";

const Plan = ({ title, description, price, features, cta, highlighted = false }: PlanType) => {
    return (
        <Card
            className={`flex flex-col bg-card/80 backdrop-blur-xl ${
                highlighted ? "border-primary shadow-lg shadow-primary/20 md:scale-105" : ""
            }`}
        >
            {highlighted && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">Most Popular</Badge>
            )}
            <CardHeader>
                <CardTitle className="text-2xl">{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
                <div className="mt-4">
                    <Price price={price} />
                    <PricingType />
                </div>
            </CardHeader>
            <CardContent className="flex-1">
                <ul className="space-y-3">
                    {Object.entries(features).map(([feature, isEnabled]) => (
                        <li key={feature} className="flex items-start gap-2">
                            {isEnabled ? (
                                <Check className="size-5 text-primary shrink-0 mt-0.5" />
                            ) : (
                                <X className="size-5 text-muted-foreground shrink-0 mt-0.5" />
                            )}
                            <span>{feature}</span>
                        </li>
                    ))}
                </ul>
            </CardContent>
            <BasicPlanFooter label={cta.label} priceId={cta.priceId} />
        </Card>
    );
};

export default Plan;

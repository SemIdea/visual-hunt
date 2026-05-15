"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createContext, type ReactNode, useContext, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/lib/auth/context";
import { useTRPC } from "@/lib/trpc/client";

type CheckoutInput = { priceId: string };

type PricingContextValue = {
    isYearly: boolean;
    setIsYearly: (val: boolean) => void;
    credits: number[];
    setCredits: (val: number[]) => void;
    calculatePrice: (monthlyPrice: number) => number;
    creditPrice: string;
    createCheckoutSession: (input: CheckoutInput) => void;
    router: ReturnType<typeof useRouter>;
};

const PricingContext = createContext<PricingContextValue | undefined>(undefined);

const PricingProvider = ({ children }: { children: ReactNode }) => {
    const router = useRouter();
    const trpc = useTRPC();
    const [isYearly, setIsYearly] = useState(false);
    const [credits, setCredits] = useState<number[]>([100]);

    const calculatePrice = (monthlyPrice: number) =>
        isYearly ? Math.floor(monthlyPrice * 12 * 0.8) : monthlyPrice;

    const creditPrice = useMemo(() => (credits[0] / 10).toFixed(0), [credits]);

    const { mutate } = useMutation(
        trpc.checkout.create.mutationOptions({
            onSuccess(data) {
                router.push(data);
            },
        }),
    );

    const value: PricingContextValue = {
        isYearly,
        setIsYearly,
        credits,
        setCredits,
        calculatePrice,
        creditPrice,
        createCheckoutSession: (input) => mutate(input),
        router,
    };

    return <PricingContext.Provider value={value}>{children}</PricingContext.Provider>;
};

const usePricing = () => {
    const ctx = useContext(PricingContext);
    if (!ctx) throw new Error("usePricing must be used within PricingProvider");
    return ctx;
};

const BillingToggle = () => {
    const { isYearly, setIsYearly } = usePricing();

    return (
        <div className="flex items-center justify-center gap-3">
            <Label
                htmlFor="billing-toggle"
                className={!isYearly ? "font-semibold" : "text-muted-foreground"}
            >
                Monthly
            </Label>
            <Switch id="billing-toggle" checked={isYearly} onCheckedChange={setIsYearly} />
            <Label
                htmlFor="billing-toggle"
                className={isYearly ? "font-semibold" : "text-muted-foreground"}
            >
                Yearly
                <span className="ml-2 text-primary text-sm">(Save 20%)</span>
            </Label>
        </div>
    );
};

const BasicPlanFooter = ({
    label,
    priceId,
}: {
    label: string;
    priceId: {
        monthly: string;
        yearly: string;
    };
}) => {
    const { createCheckoutSession, router, isYearly } = usePricing();
    const { isAuthenticated } = useAuth();

    return (
        <CardFooter>
            <Button
                variant="outline"
                className="w-full bg-transparent"
                onClick={() => {
                    if (isAuthenticated) {
                        createCheckoutSession({
                            priceId: isYearly ? priceId.yearly : priceId.monthly,
                        });
                    } else {
                        router.push("/auth/login");
                    }
                }}
            >
                {label}
            </Button>
        </CardFooter>
    );
};

const PayAsYouGoCardContent = () => {
    const { credits, setCredits, creditPrice } = usePricing();

    return (
        <CardContent className="space-y-6">
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <Label>Select Credits</Label>
                    <span className="text-2xl font-bold">{credits[0]} credits</span>
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
    );
};

const Price = ({ price }: { price: number }) => {
    const { calculatePrice } = usePricing();

    return <span className="text-4xl font-bold">${calculatePrice(price)}</span>;
};

const PricingType = () => {
    const { isYearly } = usePricing();

    return <span className="text-muted-foreground"> / {isYearly ? "year" : "month"}</span>;
};

export {
    BasicPlanFooter,
    BillingToggle,
    PayAsYouGoCardContent,
    Price,
    PricingProvider,
    PricingType,
};

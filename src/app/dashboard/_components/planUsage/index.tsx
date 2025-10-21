"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { plans } from "@/config/plans";
import { useSession } from "next-auth/react";
import Link from "next/link";
import PlanUsageSkeleton from "./skeleton";

const PlanUsage = () => {
  const { data } = useSession();

  const user = data?.user;

  if (!user) return <PlanUsageSkeleton />;

  // 1. Get the user's current priceId from their subscription
  const currentPriceId = user.subscription?.stripeSubscriptionId;

  // Handle case where user has no active subscription
  if (!currentPriceId) {
    return <p>You are currently on the free plan.</p>;
  }

  // 2. Find the plan by checking both monthly and yearly IDs
  const planEntry = Object.entries(plans).find(
    ([, planDetails]) =>
      planDetails.cta.priceId.monthly === currentPriceId ||
      planDetails.cta.priceId.yearly === currentPriceId
  );

  // Handle case where the plan is not found in your config (e.g., a legacy plan)
  if (!planEntry) {
    return <p>You are on a custom or legacy plan.</p>;
  }

  // 3. Extract the plan name and determine the interval
  const plan = planEntry[1];

  return (
    <>
      {" "}
      <Card>
        <CardHeader>
          <CardTitle>Plan & Usage</CardTitle>
          <CardDescription>
            Manage your subscription and credits
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">Current Plan:</span>
              <Badge variant="default" className="text-sm dark:text-white">
                {`${plan.title}`}
              </Badge>
            </div>
            <Link href="https://billing.stripe.com/p/login/test_8x29AT7xs65N15e9vM4Rq00">
              <Button className="dark:text-white">Manage Subscription</Button>
            </Link>
          </div>

          {/* Credit Balance */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-t pt-6">
            <div className="space-y-1">
              <p className="text-sm font-medium">Credit Balance</p>
              <p className="text-2xl font-bold">150 Credits Remaining</p>
            </div>
            <Button variant="secondary">Buy More Credits</Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default PlanUsage;

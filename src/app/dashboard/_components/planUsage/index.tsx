import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User } from "next-auth";

const PlanUsage = ({ user }: { user: NonNullable<User> }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Plan & Usage</CardTitle>
        <CardDescription>Manage your subscription and credits</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">Current Plan:</span>
            <Badge variant="default" className="text-sm dark:text-white">
              {user.subscription?.priceId === "price_1SG4iaDxv6vHSwDTyc604Tl2"
                ? "Basic"
                : user.subscription?.priceId === "price_1N6xZ2Lh4qEXAMPLE"
                ? "Pro"
                : "Free"}
            </Badge>
          </div>
          <Button className="dark:text-white">Manage Subscription</Button>
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
  );
};

export default PlanUsage;
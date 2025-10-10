import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PayAsYouGoCardContent } from "../../page.client";
import { Button } from "@/components/ui/button";

const PayAsYouGo = () => {
  return (
    <div className="max-w-3xl mx-auto mb-20">
      <Card className="bg-muted/50">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            Not a Regular User? Buy Credits Instead.
          </CardTitle>
          <CardDescription>
            Perfect for one-off projects. Credits never expire and can be used
            for any search type.
          </CardDescription>
        </CardHeader>
        <PayAsYouGoCardContent />
        <CardFooter>
          <Button className="w-full" size="lg">
            Buy Credits
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PayAsYouGo;

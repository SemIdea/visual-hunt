import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProviders } from "next-auth/react";
import LoginForm from "./_components/form";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { redirect } from "next/navigation";

const Page = async () => {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/");
  }

  const providers = await getProviders();

  return (
    <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center">
      <div className="w-full max-w-sm">
      <div className="flex flex-col gap-6">
        <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
        </CardHeader>
        <CardContent>
          <LoginForm providers={providers} />
        </CardContent>
        </Card>
      </div>
      </div>
    </div>
  );
};

export default Page;

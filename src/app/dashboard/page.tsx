import { auth } from "../api/auth/[...nextauth]/auth";
import { redirect } from "next/navigation";
import { createCaller } from "@/server/caller";
import UserInfo from "./_components/header";
import PlanUsage from "./_components/planUsage";
import DashboardTabs from "./_components/tabs";

const Page = async () => {
  const session = await auth();
  const user = session?.user;

  if (!user || !user.email || !user.name || !user.image) {
    redirect("/auth/login");
  }

  const caller = await createCaller();
  const searches = await caller.search.readSearchHistory();

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl space-y-8">
        <UserInfo user={user} />
        <PlanUsage user={user} />
        <DashboardTabs searches={searches} />
      </div>
    </div>
  );
};

export default Page;

import { redirect } from "next/navigation";
import { getServerAuth } from "@/lib/auth/server";
import UserInfo from "./_components/header";
import PlanUsage from "./_components/planUsage";
import DashboardNavigationTabs from "./_components/tabs";

const Page = async () => {
    const session = await getServerAuth();

    if (!session) {
        redirect("/auth/login");
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="mx-auto max-w-6xl space-y-8">
                <UserInfo />
                <PlanUsage />
                <DashboardNavigationTabs />
            </div>
        </div>
    );
};

export default Page;

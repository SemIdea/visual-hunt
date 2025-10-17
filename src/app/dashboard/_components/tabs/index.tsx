import SettingsTab from "./settings";
import SearchHistorySkeleton from "./searchHistory/skeleton";
import SearchHistoryTab from "./searchHistory";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Suspense } from "react";

const DashboardNavigationTabs = async () => {
  return (
    <>
      <Tabs defaultValue="history" className="space-y-6">
        <TabsList>
          <TabsTrigger value="history">Search History</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="history" className="space-y-4">
          <Suspense fallback={<SearchHistorySkeleton />}>
            <SearchHistoryTab />
          </Suspense>
        </TabsContent>

        <TabsContent value="settings">
          <SettingsTab />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default DashboardNavigationTabs;

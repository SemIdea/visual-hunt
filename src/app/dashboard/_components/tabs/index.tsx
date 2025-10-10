import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ISearchEntity } from "@/server/entities/search/DTO";
import SearchHistoryTab from "./searchHistory";
import SettingsTab from "./settings";

const DashboardTabs = ({ searches }: { searches: ISearchEntity[] }) => {
  return (
    <Tabs defaultValue="history" className="space-y-6">
      <TabsList>
        <TabsTrigger value="history">Search History</TabsTrigger>
        <TabsTrigger value="favorites">Favorites</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>

      <TabsContent value="history" className="space-y-4">
        <SearchHistoryTab searches={searches} />
      </TabsContent>

      <TabsContent value="settings">
        <SettingsTab />
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;

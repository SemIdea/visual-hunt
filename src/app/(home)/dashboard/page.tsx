import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createCaller } from "@/server/caller";

// Mock data for search history
const searchHistory = [
  {
    id: 1,
    preview: "/majestic-mountain-vista.png",
    type: "Image",
    status: "Completed",
    date: "2024-01-15",
  },
  {
    id: 2,
    preview: "/ocean-sunset.png",
    type: "Image",
    status: "Completed",
    date: "2024-01-14",
  },
  {
    id: 3,
    preview: "/autumn-forest-path.png",
    type: "Image",
    status: "Pending",
    date: "2024-01-14",
  },
  {
    id: 4,
    preview: "/city-skyline-night.png",
    type: "Image",
    status: "Failed",
    date: "2024-01-13",
  },
  {
    id: 5,
    preview: "/desert-dunes-golden-hour.jpg",
    type: "Image",
    status: "Completed",
    date: "2024-01-12",
  },
];

const getStatusVariant = (status: string) => {
  switch (status) {
    case "Completed":
      return "default";
    case "Pending":
      return "secondary";
    case "Failed":
      return "destructive";
    default:
      return "outline";
  }
};

const Page = async () => {
  const caller = await createCaller();
  // const searches = caller.search;

  return (
    <div className="min-h-screen bg-background p-6 md:p-8 lg:p-12">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header Section */}
        <div className="space-y-6">
          <h1 className="text-4xl font-bold tracking-tight">Welcome back!</h1>

          {/* User Info */}
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src="/diverse-user-avatars.png" alt="User avatar" />
              <AvatarFallback className="bg-primary/10 text-lg font-semibold">
                JD
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <p className="text-lg font-semibold">John Doe</p>
              <p className="text-sm text-muted-foreground">
                john.doe@example.com
              </p>
            </div>
          </div>
        </div>

        {/* Plan & Usage Card */}
        <Card>
          <CardHeader>
            <CardTitle>Plan & Usage</CardTitle>
            <CardDescription>
              Manage your subscription and credits
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Current Plan */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">Current Plan:</span>
                <Badge variant="default" className="text-sm dark:text-white">
                  Pro Tier
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

        {/* Search History Tabs */}
        <Tabs defaultValue="history" className="space-y-6">
          <TabsList>
            <TabsTrigger value="history">Search History</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Searches</CardTitle>
                <CardDescription>
                  View and manage your reverse image search history
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-24">Preview</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {searchHistory.map((search) => (
                      <TableRow key={search.id}>
                        <TableCell>
                          <div className="relative h-16 w-16 overflow-hidden rounded-md border border-border">
                            <img
                              src={search.preview || "/placeholder.svg"}
                              alt="Search preview"
                              className="object-cover"
                            />
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {search.type}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={getStatusVariant(search.status)}
                            className="dark:text-white"
                          >
                            {search.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(search.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={search.status !== "Completed"}
                          >
                            View Results
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="favorites">
            <Card>
              <CardHeader>
                <CardTitle>Favorites</CardTitle>
                <CardDescription>Your saved search results</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  No favorites yet. Save searches to see them here.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardDescription>
                  Manage your account preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Settings panel coming soon.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Page;

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { createCaller } from "@/server/caller";
import { SearchHistory } from "./index.client";

const SearchHistoryTab = async () => {
    const caller = await createCaller();

    const searches = await caller.search.getSearchHistory();

    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Searches</CardTitle>
                <CardDescription>View and manage your reverse image search history</CardDescription>
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
                        <SearchHistory searches={searches} />
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};

export default SearchHistoryTab;

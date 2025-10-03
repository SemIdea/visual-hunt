"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UrlTab from "./url";
import { Card, CardHeader } from "@/components/ui/card";

const UploadSectionCopy = () => {
  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <Tabs defaultValue="url">
        <TabsList className="w-full">
          <TabsTrigger value="url">Url</TabsTrigger>
        </TabsList>
        <TabsContent value="url">
          <Card>
            <CardHeader>
              <UrlTab />
            </CardHeader>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UploadSectionCopy;

"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UrlTab from "./url";
import { Card } from "@/components/ui/card";
import UploadTab from "./upload";

const UploadSectionCopy = () => {
  return (
    <Card className="mx-auto max-w-2xl border-border/50 bg-card/50 p-6 backdrop-blur w-full">
      <Tabs defaultValue="url" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="url">Search by URL</TabsTrigger>
          <TabsTrigger value="upload" disabled>
            Upload Image
          </TabsTrigger>
        </TabsList>
        <TabsContent value="url" className="mt-6">
          <UrlTab />
        </TabsContent>
        <TabsContent value="upload" className="mt-6">
          <UploadTab />
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default UploadSectionCopy;

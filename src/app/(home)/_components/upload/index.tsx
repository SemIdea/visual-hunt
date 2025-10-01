"use client";

import { Tab, Tabs } from "@heroui/react";
import UrlTab from "./url";

const UploadSectionCopy = () => {
  return (
    <div className="border-1 border-zinc-800 rounded-t-2xl rounded-b-md max-w-3xl w-full">
      {/* <Tabs radius="sm" fullWidth>
        <Tab key="upload" title="Upload File">
          <UploadTab />
        </Tab>
        <Tab key="url" title="URL"></Tab>
      </Tabs> */}
      <UrlTab />
    </div>
  );
};

export default UploadSectionCopy;

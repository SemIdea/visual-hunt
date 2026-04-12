import { Card } from "@/components/ui/card";
import { UploadTab, UrlTab } from "./index.client";

const UploadSectionCopy = () => {
    return (
        <Card className="mx-auto max-w-2xl border-border/50 bg-card/80 p-6 backdrop-blur-xl w-full">
            <UploadTab />
            <UrlTab />
        </Card>
    );
};

export default UploadSectionCopy;

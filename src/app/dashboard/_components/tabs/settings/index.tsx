import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const SettingsTab = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardDescription>Manage your account preferences</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">Settings panel coming soon.</p>
            </CardContent>
        </Card>
    );
};

export default SettingsTab;

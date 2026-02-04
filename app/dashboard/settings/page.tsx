import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">
                    Manage your account preferences
                </p>
            </div>
            <Separator />

            <div className="space-y-4">
                <h3 className="text-lg font-medium">Profile Information</h3>
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" value="user@example.com" disabled />
                        <p className="text-sm text-muted-foreground">
                            Email address cannot be changed.
                        </p>
                    </div>
                    {/* Add more fields here */}
                </div>
            </div>

            <Separator />

            <div className="space-y-4">
                <h3 className="text-lg font-medium">Account Actions</h3>
                <Button variant="destructive">
                    Delete Account
                </Button>
            </div>

        </div>
    );
}

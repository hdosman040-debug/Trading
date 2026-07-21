import { createFileRoute } from "@tanstack/react-router";
import { Download, Trash2, Upload } from "lucide-react";

import { PageHeader } from "@/components/common/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Fortex Journal" },
      { name: "description", content: "Manage profile, appearance, notifications and data." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <>
      <PageHeader title="Settings" description="Manage your trading account and preferences." />

      <Tabs defaultValue="profile">
        <TabsList className="mb-4 flex-wrap">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
          <TabsTrigger value="danger">Danger Zone</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <SectionCard title="Profile" description="Public details for your trading identity.">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Full name"><Input defaultValue="Alex Trader" /></Field>
              <Field label="Username"><Input defaultValue="alextrader" /></Field>
              <Field label="Email"><Input type="email" defaultValue="alex@fortex.io" /></Field>
              <Field label="Timezone"><Input defaultValue="UTC+02:00" /></Field>
            </div>
            <SaveRow />
          </SectionCard>
        </TabsContent>

        <TabsContent value="account">
          <SectionCard title="Account" description="Currency, base risk and account details.">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Base currency">
                <Select defaultValue="usd">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usd">USD</SelectItem>
                    <SelectItem value="eur">EUR</SelectItem>
                    <SelectItem value="gbp">GBP</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Default risk %"><Input type="number" defaultValue={1} /></Field>
              <Field label="Broker"><Input defaultValue="IC Markets" /></Field>
              <Field label="Account size"><Input type="number" defaultValue={10000} /></Field>
            </div>
            <SaveRow />
          </SectionCard>
        </TabsContent>

        <TabsContent value="appearance">
          <SectionCard title="Appearance" description="Look and feel of your workspace.">
            <div className="space-y-3">
              <Row label="Dark mode" description="Fortex Journal is optimized for dark trading environments.">
                <Switch defaultChecked disabled />
              </Row>
              <Row label="Reduced motion" description="Minimize animations across the app.">
                <Switch />
              </Row>
              <Row label="Compact tables" description="Show more rows without scrolling.">
                <Switch />
              </Row>
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="notifications">
          <SectionCard title="Notifications" description="Choose when you'd like to be pinged.">
            <div className="space-y-3">
              <Row label="Daily recap" description="Summary of your P&L each evening.">
                <Switch defaultChecked />
              </Row>
              <Row label="Goal milestones" description="Alerts when you hit a target.">
                <Switch defaultChecked />
              </Row>
              <Row label="Risk warnings" description="When you exceed max daily drawdown.">
                <Switch />
              </Row>
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="data">
          <SectionCard title="Data" description="Import or export your trading history.">
            <div className="flex flex-wrap gap-2">
              {/* TODO(backend): implement CSV export/import */}
              <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Export CSV</Button>
              <Button variant="outline"><Upload className="mr-2 h-4 w-4" /> Import CSV</Button>
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="danger">
          <div className="rounded-2xl border border-danger/40 bg-danger/5 p-5">
            <h3 className="text-sm font-semibold text-danger">Danger Zone</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              These actions are irreversible. Proceed with caution.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button variant="outline" className="border-danger/50 text-danger hover:bg-danger/10">
                <Trash2 className="mr-2 h-4 w-4" /> Clear all trades
              </Button>
              <Button className="bg-danger text-danger-foreground hover:bg-danger/90">
                Delete account
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}

function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="glass rounded-2xl p-5">
      <h3 className="text-sm font-semibold">{title}</h3>
      {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
      <div className="mt-4">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      {children}
    </div>
  );
}

function Row({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl bg-muted/20 p-3">
      <div className="min-w-0">
        <div className="text-sm font-medium">{label}</div>
        {description && <div className="text-xs text-muted-foreground">{description}</div>}
      </div>
      {children}
    </div>
  );
}

function SaveRow() {
  return (
    <div className="mt-4 flex justify-end">
      {/* TODO(backend): persist profile settings */}
      <Button className="gradient-primary text-white">Save changes</Button>
    </div>
  );
}

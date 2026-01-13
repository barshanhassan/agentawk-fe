import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function BillingPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-[20px] font-[700]">Billing</h1>
        <p className="text-sm text-muted-foreground mt-1">Billing occurs on the 1st of every month</p>
      </div>

      {/* Current Subscription Plan */}
      <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
        <CardHeader>
          <CardTitle className="text-lg">Current Subscription Plan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <p className="text-sm font-medium">Plan</p>
              <p className="text-base font-bold">$200/month</p>
            </div>
            <div>
              <p className="text-sm font-medium">Monthly Active User Tier</p>
              <p className="text-base font-bold">5000</p>
            </div>
            <div>
              <p className="text-sm font-medium">Agents Seats</p>
              <p className="text-base font-bold">2</p>
            </div>
            <div>
              <p className="text-sm font-medium">Additional User outside Tier</p>
              <p className="text-base font-bold">$0.25/user</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add-ons */}
      <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
        <CardHeader>
          <CardTitle className="text-lg">Add-ons</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <p className="text-base font-bold">$100/month</p>
            </div>
            <div>
              <p className="text-sm font-medium">Agent Seats</p>
              <p className="text-base font-bold">2</p>
            </div>
            <div>
              <p className="text-sm font-medium">Single Agent Seat</p>
              <p className="text-base font-bold">$50/month</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Platform Support */}
      <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
        <CardHeader>
          <CardTitle className="text-lg">Platform Support</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-base font-bold">$100/month</p>
        </CardContent>
      </Card>

      {/* WhatsApp Conversations */}
      <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
        <CardHeader>
          <CardTitle className="text-lg">WhatsApp Conversations</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-4 gap-4">
          <div>
            <p className="text-sm font-medium">On actual</p>
          </div>
          <div>
            <p className="text-sm font-medium">Free Conversations included</p>
            <p className="text-base font-bold">1000/month</p>
          </div>
          <div>
            <p className="text-sm font-medium">Additional Conversations</p>
            <p className="text-base font-bold">Based on destination country.</p>
            <p className="text-sm text-blue-600 hover:underline cursor-pointer">
              <a href="https://developers.facebook.com/docs/whatsapp/pricing#rate-cards" target="_blank" rel="noopener noreferrer">
                View Meta rate card
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

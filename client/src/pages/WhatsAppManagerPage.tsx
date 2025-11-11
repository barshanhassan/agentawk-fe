import React, { useState, useRef, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import ProfilePreview from "@/components/ProfilePreview"; // Import the new ProfilePreview component
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"; // Add Tooltip imports
import { UploadCloud, Edit2, Check } from "react-feather"; // For drag and drop icon, Edit2 icon, and Check icon
import { Info } from "lucide-react"; // Add Info icon import
import { Switch } from "@/components/ui/switch"; // Import Switch component

export default function WhatsAppManagerPage() {
  // State for Business Profile fields
  const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null);
  const [profilePhotoPreviewUrl, setProfilePhotoPreviewUrl] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState("My business name"); // Default value as per requirement
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [about, setAbout] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");

  // State for active tab
  const [activeTab, setActiveTab] = useState("business-profile");

  // Dummy states for badges
  const [isConnected, setIsConnected] = useState(Math.random() < 0.5);
  const [accountHealth, setAccountHealth] = useState(Math.random());

  const categoryOptions = [
    "Automotive", "Beauty", "Apparel", "Education", "Entertainment",
    "Event Planning", "Finance", "Grocery", "Government", "Hotel",
    "Health", "Nonprofit", "Professional Services", "Retail", "Travel",
    "Restaurant", "Other"
  ];

  // Handle profile photo drag and drop
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files && files[0]) {
      setProfilePhotoFile(files[0]);
      setProfilePhotoPreviewUrl(URL.createObjectURL(files[0]));
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      setProfilePhotoFile(files[0]);
      setProfilePhotoPreviewUrl(URL.createObjectURL(files[0]));
    }
  };

  const handleSave = () => {
    // Logic to save business profile data
    console.log("Saving Business Profile:", {
      profilePhotoFile,
      displayName,
      category,
      description,
      about,
      email,
      website,
    });
    // Add toast notification or API call here
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">WhatsApp Manager</h1>

      <Tabs defaultValue="business-profile" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="business-profile">Business Profile</TabsTrigger>
          <TabsTrigger value="automations">Automations</TabsTrigger>
          <TabsTrigger value="calls">Calls</TabsTrigger>
        </TabsList>
        {/* WhatsApp Account Status Badges */}
        {activeTab === "business-profile" && (
          <div className="flex items-center space-x-5">
            <div className="flex items-center space-x-2 text-sm px-2 py-1 bg-blue-100 rounded-md w-fit">
              <span className="text-sm font-medium text-foreground">Message limit:</span>
              <span className="text-sm text-foreground">1K Customers/24hr</span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3 w-3" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="break-normal w-[16rem] whitespace-normal">The number of business-initiated conversations you can start in a 24 hour rolling period.</p>
                </TooltipContent>
              </Tooltip>
            </div>
            {(() => {
              const bgColor = isConnected ? 'bg-green-100' : 'bg-red-100';
              const textColor = isConnected ? 'text-green-800' : 'text-red-800';
              const statusText = isConnected ? 'Connected' : 'Disconnected';
              return (
                <div className={`flex items-center space-x-2 text-sm px-2 py-1 ${bgColor} rounded-md w-fit`}>
                  <span className="text-sm font-medium text-foreground">Account Status:</span>
                  <span className={`text-sm text-foreground`}>{statusText}</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3 w-3" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="break-normal w-[16rem] whitespace-normal">Phone number is associated with this account and working properly</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              );
            })()}
            {(() => {
              let healthStatus, bgColor, textColor;
              if (accountHealth < 0.33) {
                healthStatus = "Green";
                bgColor = "bg-green-100";
                textColor = "text-green-800";
              } else if (accountHealth < 0.66) {
                healthStatus = "Yellow";
                bgColor = "bg-yellow-100";
                textColor = "text-yellow-800";
              } else {
                healthStatus = "Red";
                bgColor = "bg-red-100";
                textColor = "text-red-800";
              }
              return (
                <div className={`flex items-center space-x-2 text-sm px-2 py-1 ${bgColor} rounded-md w-fit`}>
                  <span className="text-sm font-medium text-foreground">Account Health:</span>
                  <span className={`text-sm text-foreground`}>{healthStatus}</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3 w-3" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="break-normal w-[16rem] whitespace-normal">Account health is based on how messages have been received by the recipients over the last 7 days. It is determined by a combination of quality signals from conversations between business and users. Examples include user feedback signals like blocks, reports and the reasons users provide when they block a business.</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              );
            })()}
          </div>
        )}
        <TabsContent value="business-profile">
          <div className="grid grid-cols-2 flex gap-6">
            {/* Left Side: Business Profile Form */}
            <div className="space-y-6">
              {/* Profile Photo */}
              <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
                <CardHeader>
                  <CardTitle className="text-lg">Profile Photo</CardTitle>
                  <p className="text-sm text-muted-foreground">This will be visible on your business profile</p>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <div className="flex flex-col space-y-4 items-center max-w-md">
                    <div
                      className="flex flex-col items-center justify-center w-48 h-48 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      onClick={() => document.getElementById('profilePhotoInput')?.click()}
                    >
                      {profilePhotoPreviewUrl ? (
                        <img src={profilePhotoPreviewUrl} alt="Profile Preview" className="h-full w-full object-cover rounded-lg" />
                      ) : (
                        <>
                          <UploadCloud className="w-10 h-10 text-gray-400" />
                          <p className="text-sm text-gray-500">Drag or drop picture</p>
                        </>
                      )}
                      <input
                        id="profilePhotoInput"
                        type="file"
                        className="hidden"
                        accept="image/jpeg, image/png"
                        onChange={handleFileChange}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground text-center">
                      Recommended WhatsApp Business profile photo size: 640 x 640 pixels (max 5 MB) in JPG or PNG format, with a minimum of 192 x 192 pixels
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button onClick={handleSave} className="bg-blue-500 hover:bg-blue-600 text-white font-normal">
                    Save
                  </Button>
                </CardFooter>
              </Card>

              {/* Display Name */}
              <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
                <CardHeader>
                  <CardTitle className="text-lg">Display Name</CardTitle>
                  <p className="text-sm text-muted-foreground">The WhatsApp Business display name is your business name that customers see on your WhatsApp Business profile. Ensure that your name follows WhatsApp's regulations.</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">Display Name</label>
                    <Input
                      value={displayName}
                      disabled
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button onClick={handleSave} className="bg-blue-500 hover:bg-blue-600 text-white font-normal" disabled>
                    Save
                  </Button>
                </CardFooter>
              </Card>

              {/* Business Information */}
              <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
                <CardHeader>
                  <CardTitle className="text-lg">Business Information</CardTitle>
                  <p className="text-sm text-muted-foreground">Add some details about your Business</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">Category</label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoryOptions.map((opt) => (
                          <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Description (optional)</label>
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Tell us about your business"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Address (optional)</label>
                    <Textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="The address of your business"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">About (optional)</label>
                    <Textarea
                      value={about}
                      onChange={(e) => setAbout(e.target.value)}
                      placeholder="A short description about your business"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Email</label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="business@example.com"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Website</label>
                    <Input
                      type="url"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://www.yourbusiness.com"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button onClick={handleSave} className="bg-blue-500 hover:bg-blue-600 text-white font-normal">
                    Save
                  </Button>
                </CardFooter>
              </Card>
            </div>

            {/* Right Side: WhatsApp Template Preview */}
            <div className="max-h-[70vh] w-full">
              <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0 h-full flex flex-col">
                <CardHeader>
                  <CardTitle className="text-lg">WhatsApp Profile Preview</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col h-full flex-1">
                  <ProfilePreview
                    profilePhotoUrl={profilePhotoPreviewUrl}
                    displayName={displayName}
                    about={about}
                    category={category}
                    email={email}
                    website={website}
                />                                                            
                </CardContent>
              </Card>        
            </div>
          </div>


        </TabsContent>

        <TabsContent value="automations">
          <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
            <CardHeader>
              <CardTitle className="text-lg">Conversational Components</CardTitle>
              <p className="text-sm text-muted-foreground">Automation that can enhance conversational experience. Using AI can help make these components more efficient.</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Welcome Message */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-base mb-1">Welcome Message</h4>
                  <p className="text-sm text-muted-foreground">Receive a webhook when people start a chat with your business.</p>
                </div>
                <Switch aria-label="Toggle welcome message" />
              </div>

              {/* Ice Breakers */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-base mb-1">Ice Breakers</h4>
                  <p className="text-sm text-muted-foreground">These are common questions that people can easily ask you.</p>
                </div>
                <Button variant="ghost" size="sm" className="hover-elevate h-7 text-xs [border-color:hsl(var(--input))]">
                  Edit
                </Button>
              </div>

              {/* Commands */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-base mb-1">Commands</h4>
                  <p className="text-sm text-muted-foreground">These are special keywords that tell the WhatsApp bot what to do.</p>
                </div>
                <Button variant="ghost" size="sm" className="hover-elevate h-7 text-xs [border-color:hsl(var(--input))]">
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calls">
          {/* Content for Calls tab */}
          <Card>
            <CardHeader><CardTitle>Calls</CardTitle></CardHeader>
            <CardContent>
              <p>Content for managing calls will go here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
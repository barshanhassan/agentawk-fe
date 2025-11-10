import { useState, useRef, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import TemplatePreview from "@/components/TemplatePreview"; // Assuming this component exists
import { UploadCloud } from "react-feather"; // For drag and drop icon

export default function WhatsAppManagerPage() {
  // State for Business Profile fields
  const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null);
  const [profilePhotoPreviewUrl, setProfilePhotoPreviewUrl] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState("WhatsApp Business Account"); // Default value as per requirement
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [about, setAbout] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");

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

      <Tabs defaultValue="business-profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="business-profile">Business Profile</TabsTrigger>
          <TabsTrigger value="message-templates">Message Templates</TabsTrigger>
          <TabsTrigger value="phone-numbers">Phone Numbers</TabsTrigger>
        </TabsList>

        <TabsContent value="business-profile">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Side: Business Profile Form */}
            <div className="space-y-6">
              {/* Profile Photo */}
              <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
                <CardHeader>
                  <CardTitle className="text-lg">Profile Photo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">This will be visible on your business profile</p>
                  <div
                    className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
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
                  <p className="text-xs text-muted-foreground">
                    Recommended WhatsApp Business profile photo size: 640 x 640 pixels (max 5 MB) in JPG or PNG format, with a minimum of 192 x 192 pixels
                  </p>
                </CardContent>
              </Card>

              {/* Display Name */}
              <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
                <CardHeader>
                  <CardTitle className="text-lg">Display Name</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">The WhatsApp Business display name is your business name that customers see on your WhatsApp Business profile. Ensure that your name follows WhatsApp's regulations.</p>
                  <div>
                    <label className="text-sm font-medium text-foreground">Display Name</label>
                    <Input value="WhatsApp Business Account" disabled />
                  </div>
                </CardContent>
              </Card>

              {/* Business Information */}
              <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
                <CardHeader>
                  <CardTitle className="text-lg">Business Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">Add some details about your Business</p>
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
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
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
              </Card>
            </div>

            {/* Right Side: WhatsApp Template Preview */}
            <div className="space-y-6">
              <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
                <CardHeader>
                  <CardTitle className="text-lg">WhatsApp Profile Preview</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center items-center h-full min-h-[500px]">
                  {/* This is a placeholder. TemplatePreview expects template data. */}
                  {/* For a business profile preview, you might need a different component or adapt TemplatePreview */}
                  <TemplatePreview
                    headerText="Your Business Name"
                    bodyText="This is how your profile will appear to customers."
                    footerText="Powered by WhatsApp"
                    selectedMediaFile={null}
                    templateButtons={[]}
                    variableSamples={{}}
                    containerClassName="flex-1 flex items-center justify-center"
                    phoneClassName="h-full max-h-[80vh] aspect-[9/18] bg-black rounded-3xl p-3 shadow-lg flex flex-col overflow-hidden"
                  />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end mt-6">
            <Button onClick={handleSave} className="bg-blue-500 hover:bg-blue-600 text-white font-normal">
              Save
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="message-templates">
          {/* Content for Message Templates tab */}
          <Card>
            <CardHeader><CardTitle>Message Templates</CardTitle></CardHeader>
            <CardContent>
              <p>Content for managing message templates will go here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="phone-numbers">
          {/* Content for Phone Numbers tab */}
          <Card>
            <CardHeader><CardTitle>Phone Numbers</CardTitle></CardHeader>
            <CardContent>
              <p>Content for managing phone numbers will go here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

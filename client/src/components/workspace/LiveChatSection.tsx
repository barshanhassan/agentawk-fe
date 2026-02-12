import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Info, CheckCircle2, AlertTriangle, Folder, Plus, Eye, Pencil, Trash, Inbox } from "lucide-react";
import { useState } from "react";
import { CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

export default function LiveChatSettings() {
  const [agentAction, setAgentAction] = useState<"keep" | "remove">("keep");
  const [saveAgentDetails, setSaveAgentDetails] = useState(false);
  const [agentDataFormat, setAgentDataFormat] = useState("full-name");
  const [customField, setCustomField] = useState("Payload");
  const [saveConversationJson, setSaveConversationJson] = useState(true);
  const [jsonCustomField, setJsonCustomField] = useState("Json");
  const [includeSignature, setIncludeSignature] = useState(false);
  const [correctionModel, setCorrectionModel] = useState("gpt-4o-mini");
  const [correctionPrompt, setCorrectionPrompt] = useState(
    "Contexto: Você é um especialista em comunicação e aprimoramento de textos para atendimento ao cliente o Suporte ao Cliente da Reply Agent.\n\nObjetivo: Revisar e aprimorar o texto fornecido, garantindo que ele:"
  );
  const [folders, setFolders] = useState(["Usman", "Pasta Teste", "Returns", "121", "Sales"]);
  const [pauseSmartFlow, setPauseSmartFlow] = useState<"manually" | "automatically">("automatically");
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [hoveredFolderIndex, setHoveredFolderIndex] = useState<number | null>(null);
  const [editingFolderIndex, setEditingFolderIndex] = useState<number | null>(null);

  const handleSave_Folder = () => {
    if (newFolderName.trim()) {
      if (editingFolderIndex !== null) {
        // Edit existing
        const updatedFolders = [...folders];
        updatedFolders[editingFolderIndex] = newFolderName;
        setFolders(updatedFolders);
        setEditingFolderIndex(null);
      } else {
        // Create new
        setFolders([...folders, newFolderName]);
      }
      setNewFolderName("");
      setIsCreatingFolder(false);
    }
  };

  const { toast } = useToast();


  const handleEditFolder = (index: number) => {
    setNewFolderName(folders[index]);
    setEditingFolderIndex(index);
    setIsCreatingFolder(true);
  };

  const handleDeleteFolder = (index: number) => {
    if (confirm("Are you sure you want to delete this folder?")) {
      const updatedFolders = folders.filter((_, i) => i !== index);
      setFolders(updatedFolders);
      if (editingFolderIndex === index) {
        setIsCreatingFolder(false);
        setEditingFolderIndex(null);
        setNewFolderName("");
      }
    }
  };

  const handleViewFolder = (folderName: string) => {
      alert(`Viewing content of folder: ${folderName}`);
  };

  const handleCancelFolder = () => {
    setIsCreatingFolder(false);
    setNewFolderName("");
    setEditingFolderIndex(null);
  };

  const handleAddCustomField = () => {
    console.log("New custom field added:", customField);
    alert(`Custom field "${customField}" added!`);
    setCustomField("");
  };

  const handleSaveAgents = () => {
    const agentsSettings = {
      agentAction,
      saveAgentDetails,
      agentDataFormat,
      customField
    };
    console.log("Saving Agents settings:", agentsSettings);
    toast({
      title: "Success",
      description: "Agents settings saved successfully!",
    });
  };

  const handleSaveCompletion = () => {
    const completionSettings = {
      saveConversationJson,
      jsonCustomField
    };
    console.log("Saving Completion settings:", completionSettings);
    toast({
      title: "Success",
      description: "Completion settings saved successfully!",
    });
  };

  const handleSaveSignature = () => {
    const signatureSettings = {
      includeSignature
    };
    console.log("Saving Signature settings:", signatureSettings);
    toast({
      title: "Success",
      description: "Signature settings saved successfully!",
    });
  };

  const handleSaveCorrection = () => {
    const correctionSettings = {
      correctionModel,
      correctionPrompt
    };
    console.log("Saving Correction settings:", correctionSettings);
    toast({
      title: "Success",
      description: "Correction settings saved successfully!",
    });
  };

  const handleSavePause = () => {
    const pauseSettings = {
      pauseSmartFlow
    };
    console.log("Saving Pause settings:", pauseSettings);
    toast({
      title: "Success",
      description: "Pause settings saved successfully!",
    });
  };

  return (
    <>
      <CardHeader className="flex flex-row items-center gap-4 space-y-0">
        <Inbox className="w-8 h-8 text-black dark:text-white" />
        <div className="space-y-1">
          <CardTitle className="text-lg">Live Chat</CardTitle>
          <CardDescription>Manage how your Workspace Live Chat behaves.</CardDescription>
        </div>
      </CardHeader>
      <Separator className="bg-gray-200 dark:bg-slate-800" />
      
      <CardContent className="pt-6">
        {/* Main content container */}
        <div className="max-w-4xl mx-0 space-y-6">

          {/* Tabs */}
          <Tabs defaultValue="agents" className="w-full">
            <TabsList className="grid grid-cols-6 bg-gray-100 dark:bg-slate-800 rounded-t-lg">
              <TabsTrigger value="agents">Agents</TabsTrigger>
              <TabsTrigger value="completion">Completion</TabsTrigger>
              <TabsTrigger value="signature">Signature</TabsTrigger>
              <TabsTrigger value="correction">Correction</TabsTrigger>
              <TabsTrigger value="folders">Folders</TabsTrigger>
              <TabsTrigger value="pause">Pause</TabsTrigger>
            </TabsList>

            {/* Agents Tab */}
            <TabsContent value="agents" className="mt-0">
              <div className="bg-white dark:bg-slate-900 border border-t-0 border-gray-200 dark:border-slate-800 rounded-b-lg p-6 space-y-6">

                {/* Conversation DONE options */}
                <div className="space-y-4 text-left">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    When the conversation is marked DONE in Live Chat or SmartFlow:
                  </h3>

                  <RadioGroup
                    value={agentAction}
                    onValueChange={(value) => setAgentAction(value as "keep" | "remove")}
                    className="space-y-3"
                  >
                    {["keep", "remove"].map((action) => (
                      <div
                        key={action}
                        className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                          agentAction === action
                            ? "bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700 shadow-sm"
                            : "bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700"
                        }`}
                        onClick={() => setAgentAction(action as "keep" | "remove")}
                      >
                        <RadioGroupItem value={action} id={action} />
                        <div>
                          <Label htmlFor={action} className="font-medium cursor-pointer capitalize text-gray-900 dark:text-gray-100">
                            {action}
                          </Label>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {action === "keep"
                              ? "Keep the assigned Agent to the conversation."
                              : "Remove the assigned Agent from conversation."}
                          </p>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Save agent details */}
                <div className="flex items-center justify-between bg-gray-50 dark:bg-slate-800 p-4 rounded-lg border border-gray-200 dark:border-slate-700">
                  <div className="space-y-1 max-w-[85%] text-left">
                    <Label htmlFor="save-agent" className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                      Save the details of the agent who marked the conversation as DONE into a custom field.
                    </Label>
                  </div>
                  <Switch
                    id="save-agent"
                    checked={saveAgentDetails}
                    onCheckedChange={setSaveAgentDetails}
                  />
                </div>

                {/* Info box */}
                {saveAgentDetails && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <div className="flex items-start gap-3 text-left">
                      <Info className="h-5 w-5 text-black dark:text-white mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-blue-900 dark:text-blue-200">
                        Save the details of the agent who marked the conversation as DONE.
                        You can save: First Name, Last Name, Phone Number, WhatsApp Number, Role, and Email.
                      </p>
                    </div>
                  </div>
                )}

                {/* Agent data format */}
                <div className="space-y-2 text-left">
                  <Label className="text-sm font-medium text-gray-900 dark:text-white">Agent data format</Label>
                  <div className="flex items-center gap-3">
                    {["full-name", "json"].map((format) => (
                      <button
                        key={format}
                        className={`flex-1 px-4 py-3 rounded-lg border text-left transition-all ${
                          agentDataFormat === format
                            ? "bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700 shadow-sm font-medium text-blue-900 dark:text-blue-100"
                            : "bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300"
                        }`}
                        onClick={() => setAgentDataFormat(format)}
                      >
                        {format === "full-name" ? "Full name" : "JSON"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom field input */}
                <div className="space-y-2 text-left">
                  <Label className="text-sm font-medium text-gray-900 dark:text-white">Custom field</Label>
                  <div className="flex items-center gap-3">
                    <Input
                      placeholder="Enter custom field name"
                      className="flex-1 bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white placeholder-gray-400 focus:border-blue-500 focus:ring focus:ring-blue-200"
                      value={customField}
                      onChange={(e) => setCustomField(e.target.value)}
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-10 w-10"
                      onClick={handleAddCustomField}
                    >
                      +
                    </Button>
                  </div>
                </div>

                {/* Save button */}
                <div className="flex justify-start pt-4">
                  <Button 
                    className="px-8 btn-outline-primary" 
                    variant="outline"
                    onClick={handleSaveAgents}
                  >
                    Save
                  </Button>
                </div>

              </div>
            </TabsContent>

            {/* Completion Tab */}
            <TabsContent value="completion" className="mt-0">
              <div className="bg-white dark:bg-slate-900 border border-t-0 border-gray-200 dark:border-slate-800 rounded-b-lg p-6 space-y-6">
                
                <div className="space-y-4 text-left">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    When the conversation is marked as DONE in Live Chat or Smart Flow:
                  </h3>
                  <div className="flex items-center gap-3">
                    <Switch
                      id="save-json"
                      checked={saveConversationJson}
                      onCheckedChange={setSaveConversationJson}
                    />
                    <Label htmlFor="save-json" className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                      Save the last conversation as JSON into a custom field.
                    </Label>
                  </div>
                </div>

                 {/* Custom Field Select */}
                 {saveConversationJson && (
                   <div className="space-y-2 text-left">
                    <Label className="text-sm font-medium text-gray-900 dark:text-white">Select custom field</Label>
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <Select value={jsonCustomField} onValueChange={setJsonCustomField}>
                          <SelectTrigger className="w-full bg-white dark:bg-slate-950 border-gray-300 dark:border-slate-700 dark:text-white">
                            <SelectValue placeholder="Select custom field" />
                          </SelectTrigger>
                          <SelectContent className="dark:bg-slate-950 dark:border-slate-800">
                            <SelectItem value="Json" className="dark:focus:bg-slate-800 dark:text-white">Json</SelectItem>
                            <SelectItem value="Payload" className="dark:focus:bg-slate-800 dark:text-white">Payload</SelectItem>
                            <SelectItem value="User Data" className="dark:focus:bg-slate-800 dark:text-white">User Data</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-10 w-10 btn-outline-primary"
                        onClick={() => {}}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                 )}

                {/* Save Button */}
                <div className="flex justify-start pt-4">
                  <Button 
                    className="px-8 btn-outline-primary" 
                    variant="outline"
                    onClick={handleSaveCompletion}
                  >
                    Save
                  </Button>
                </div>

              </div>
            </TabsContent>

            {/* Signature Tab */}
            <TabsContent value="signature" className="mt-0">
              <div className="bg-white dark:bg-slate-900 border border-t-0 border-gray-200 dark:border-slate-800 rounded-b-lg p-6">
                
                <div className="flex flex-col lg:flex-row gap-12">
                  {/* Left Column: Settings */}
                  <div className="flex-1 space-y-8">
                    
                    {/* Toggle */}
                    <div className="flex items-center gap-3">
                      <Switch
                        id="include-signature"
                        checked={includeSignature}
                        onCheckedChange={setIncludeSignature}
                      />
                      <Label htmlFor="include-signature" className="font-medium text-gray-900 dark:text-white text-sm">
                        Include a signature in Agent messages sent through Live Chat.
                      </Label>
                    </div>

                    {/* Benefits List */}
                    <div className="space-y-6">
                      <div className="flex gap-3 items-start">
                        <CheckCircle2 className="w-5 h-5 text-black dark:text-white mt-0.5 flex-shrink-0" />
                        <div className="space-y-1 text-left">
                          <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Professionalism</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                            Signing message with a name gives a polished and professional touch, showcasing the company's commitment to high-quality service.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3 items-start">
                        <CheckCircle2 className="w-5 h-5 text-black dark:text-white mt-0.5 flex-shrink-0" />
                        <div className="space-y-1 text-left">
                          <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Personalization</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                            Adding the agent's name makes the conversation feel more personal and human, which helps build trust and rapport with the customer.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3 items-start">
                        <CheckCircle2 className="w-5 h-5 text-black dark:text-white mt-0.5 flex-shrink-0" />
                        <div className="space-y-1 text-left">
                          <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Accountability</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                            Customers know who they are interacting with, ensuring a sense of responsibility for the agent to provide excellent service.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Alert */}
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/50 rounded-lg p-4 flex gap-3 items-start text-left">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 text-sm mb-1">Attention needed</h4>
                        <p className="text-sm text-yellow-700 dark:text-yellow-300/80">
                          The signature feature is exclusively for the WhatsApp channels (Official and QR Code).
                        </p>
                      </div>
                    </div>

                  </div>

                  {/* Right Column: Mobile Mockup */}
                  <div className="flex-1 flex items-center justify-center pt-8 lg:pt-0">
                      <div className="relative w-[280px] h-[580px] bg-black rounded-[3rem] border-[8px] border-gray-900 shadow-2xl overflow-hidden ring-4 ring-gray-200 dark:ring-gray-700">
                          
                          {/* Dynamic Island / Notch Area */}
                          <div className="absolute top-0 w-full h-8 bg-black flex justify-between px-8 items-center z-20">
                              <span className="text-white text-[10px] font-semibold tracking-wide">9:41</span>
                              <div className="w-16 h-5 bg-black rounded-full absolute left-1/2 -translate-x-1/2 top-1"></div>
                              <div className="flex gap-1">
                                  <div className="w-3 h-3 bg-white rounded-full opacity-80" />
                                  <div className="w-3 h-3 bg-white rounded-full opacity-80" />
                              </div>
                          </div>

                          {/* App Header (WhatsApp Style) */}
                          <div className="bg-[#075E54] h-[80px] pt-8 px-4 flex items-center gap-3 shadow-md z-10 relative">
                              <div className="text-white text-lg">←</div>
                              <div className="w-8 h-8 bg-gray-300 rounded-full border border-white/20 flex-shrink-0">
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Maria`} alt="Avatar" className="w-full h-full rounded-full" />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-white font-semibold text-sm leading-tight">Maria</span>
                                <span className="text-white/80 text-[10px] leading-tight">online</span>
                              </div>
                          </div>

                          {/* Chat Area */}
                          <div className="bg-[#E5DDD5] dark:bg-[#0b141a] h-full p-4 relative flex flex-col pt-4">
                               {/* Date Divider */}
                               <div className="flex justify-center mb-6">
                                 <span className="bg-[#E1F3FB] dark:bg-[#1f2c34] text-gray-500 dark:text-gray-300 text-[10px] px-2 py-1 rounded shadow-sm">
                                   Today
                                 </span>
                               </div>

                               {/* Customer Message (Received) */}
                               <div className="self-start bg-white dark:bg-[#1f2c34] p-2 pl-3 rounded-lg rounded-tl-none shadow-sm max-w-[85%] mb-4 relative text-left">
                                  <p className="text-sm text-gray-800 dark:text-gray-100 leading-snug pb-2">
                                    Hi, I need help with my order #12345.
                                  </p>
                                  <span className="text-[9px] text-gray-400 absolute bottom-1 right-1.5">14:30</span>
                               </div>

                               {/* Agent Message (Sent) */}
                               <div className="self-end bg-[#DCF8C6] dark:bg-[#005c4b] p-2 pl-3 pr-2 rounded-lg rounded-tr-none shadow-sm max-w-[85%] relative text-left">
                                  {/* Signature Preview */}
                                  {includeSignature && (
                                    <div className="mp-1 mb-1 text-[10px] font-bold text-[#075E54] dark:text-[#25d366]">
                                      ~ Maria
                                    </div>
                                  )}
                                  
                                  <p className="text-sm text-gray-800 dark:text-gray-100 leading-snug pb-3 min-w-[120px]">
                                    Hello! I'd be happy to check that for you. One moment please.
                                  </p>

                                  <div className="flex justify-end items-center gap-1 absolute bottom-1 right-1.5">
                                    <span className="text-[9px] text-gray-500 dark:text-gray-300">14:32</span>
                                    <div className="flex">
                                       <span className="text-[8px] text-[#4FB6EC]">✓✓</span> 
                                    </div>
                                  </div>
                               </div>
                          </div>
                      </div>
                  </div>

                </div>
                
                {/* Save Button */}
                <div className="flex justify-start pt-6">
                  <Button 
                    className="px-8 btn-outline-primary" 
                    variant="outline"
                    onClick={handleSaveSignature}
                  >
                    Save
                  </Button>
                </div>

              </div>
            </TabsContent>

            {/* Correction Tab */}
            <TabsContent value="correction" className="mt-0">
              <div className="bg-white dark:bg-slate-900 border border-t-0 border-gray-200 dark:border-slate-800 rounded-b-lg p-6">
                
                <div className="space-y-6 mb-8 text-left">
                   <h3 className="text-gray-900 dark:text-white font-medium">Correct and enhance agent text in Live Chat</h3>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                  {/* Left Column: Benefits */}
                  <div className="flex-1 space-y-8">
                     <div className="flex gap-3 items-start">
                        <CheckCircle2 className="w-5 h-5 text-gray-900 dark:text-white mt-0.5 flex-shrink-0" />
                        <div className="space-y-1 text-left">
                          <h4 className="font-semibold text-gray-900 dark:text-white text-sm">AI-Powered Text Refinement for Professional Communication</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                            Leverage ChatGPT AI to enhance and correct agent messages, ensuring clear, grammatically accurate, and professional communication that elevates customer interactions.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3 items-start">
                        <CheckCircle2 className="w-5 h-5 text-gray-900 dark:text-white mt-0.5 flex-shrink-0" />
                        <div className="space-y-1 text-left">
                          <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Perfect Agent Messaging with ChatGPT AI</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                            Improve communication by ChatGPT AI to refine and correct grammar in agent text, delivering polished, professionally-quality messages every time.
                          </p>
                        </div>
                      </div>
                  </div>

                  {/* Right Column: Settings */}
                  <div className="flex-1 space-y-4">
                      <div className="flex items-center justify-between gap-4">
                           <Label className="text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap">
                              Live Chat AI Chat Assistant button prompt
                           </Label>
                           <div className="w-[180px]">
                              <Select value={correctionModel} onValueChange={setCorrectionModel}>
                                  <SelectTrigger className="w-full bg-white dark:bg-slate-950 border-gray-300 dark:border-slate-700 dark:text-white h-9">
                                      <SelectValue placeholder="Select model" />
                                  </SelectTrigger>
                                  <SelectContent className="dark:bg-slate-950 dark:border-slate-800">
                                      <SelectItem value="gpt-4o-mini" className="dark:focus:bg-slate-800 dark:text-white">gpt-4o-mini</SelectItem>
                                      <SelectItem value="gpt-4" className="dark:focus:bg-slate-800 dark:text-white">gpt-4</SelectItem>
                                      <SelectItem value="gpt-3.5-turbo" className="dark:focus:bg-slate-800 dark:text-white">gpt-3.5-turbo</SelectItem>
                                      <SelectItem value="add-new" className="dark:focus:bg-primary dark:focus:text-white focus:bg-primary focus:text-white font-medium text-primary">+ Add New Model</SelectItem>
                                  </SelectContent>
                              </Select>
                           </div>
                      </div>

                      <Textarea 
                          className="min-h-[150px] resize-y text-gray-600 dark:text-gray-300 bg-white dark:bg-slate-950 border-gray-300 dark:border-slate-700 focus:border-blue-500"
                          value={correctionPrompt}
                          onChange={(e) => setCorrectionPrompt(e.target.value)}
                      />
                  </div>
                </div>

                 {/* Save Button */}
                <div className="flex justify-start pt-8">
                  <Button 
                    className="px-8 btn-outline-primary" 
                    variant="outline"
                    onClick={handleSaveCorrection}
                  >
                    Save
                  </Button>
                </div>

              </div>
            </TabsContent>

            {/* Folders Tab */}
            <TabsContent value="folders" className="mt-0">
               <div className="bg-white dark:bg-slate-900 border border-t-0 border-gray-200 dark:border-slate-800 rounded-b-lg p-6 min-h-[400px]">
                  <div className="space-y-6 text-left mb-8">
                     <p className="text-gray-900 dark:text-white font-medium">Create custom folders to streamline and optimize your Live Chat management.</p>
                  </div>

                  <div className="flex flex-col lg:flex-row h-full gap-8">
                      {/* Left Column: Folder List */}
                      <div className="w-full lg:w-1/2 lg:border-r lg:border-gray-100 dark:lg:border-slate-800 lg:pr-8">
                         <ul className="space-y-0">
                            {folders.map((folder, index) => (
                               <li 
                                  key={index} 
                                  className="flex items-center justify-between py-4 border-b border-gray-100 dark:border-slate-800 last:border-0 hover:bg-gray-50 dark:hover:bg-slate-800 px-2 rounded-md transition-colors cursor-pointer group"
                                  onMouseEnter={() => setHoveredFolderIndex(index)}
                                  onMouseLeave={() => setHoveredFolderIndex(null)}
                               >
                                  <div className="flex items-center gap-3">
                                      <Folder className="w-5 h-5 text-black dark:text-white" />
                                      <span className="text-gray-700 dark:text-gray-200 font-medium text-sm">{folder}</span>
                                  </div>
                                  {hoveredFolderIndex === index && (
                                      <div className="flex items-center gap-3 text-black dark:text-white">
                                          <Eye 
                                              className="w-4 h-4 hover:text-gray-700 transition-colors" 
                                              onClick={(e) => { e.stopPropagation(); handleViewFolder(folder); }}
                                          />
                                          <Pencil 
                                              className="w-4 h-4 hover:text-gray-700 transition-colors" 
                                              onClick={(e) => { e.stopPropagation(); handleEditFolder(index); }}
                                          />
                                          <Trash 
                                              className="w-4 h-4 hover:text-red-600 transition-colors" 
                                              onClick={(e) => { e.stopPropagation(); handleDeleteFolder(index); }}
                                          />
                                      </div>
                                  )}
                               </li>
                            ))}
                         </ul>
                      </div>

                      {/* Right Column: Action or Form */}
                       <div className="w-full lg:w-1/2 flex flex-col justify-center py-12 lg:py-0">
                          {!isCreatingFolder ? (
                               <div className="flex flex-col items-center text-center space-y-4">
                                  <p className="text-gray-900 dark:text-white font-medium">Add folder to organize your conversations.</p>
                                  <Button 
                                      variant="outline" 
                                      className="btn-outline-primary gap-2"
                                      onClick={() => setIsCreatingFolder(true)}
                                  >
                                     <Plus className="w-4 h-4" />
                                     Add folder
                                  </Button>
                               </div>
                          ) : (
                              <div className="bg-white dark:bg-slate-900 rounded-lg p-1 space-y-6 w-full max-w-md mx-auto">
                                  <div className="space-y-4">
                                      <div className="space-y-2 text-left">
                                          <Label className="text-base font-medium text-gray-900 dark:text-white">Display name</Label>
                                          <Input
                                              value={newFolderName}
                                              onChange={(e) => setNewFolderName(e.target.value)}
                                              className="bg-white dark:bg-slate-950 dark:border-slate-800 dark:text-white"
                                          />
                                      </div>
                                      <div className="space-y-2 text-left">
                                          <Label className="text-base font-medium text-gray-900 dark:text-white">Assigned to</Label>
                                          <Select>
                                              <SelectTrigger className="w-full bg-white dark:bg-slate-950 dark:border-slate-800 text-gray-500 dark:text-gray-300">
                                                  <SelectValue placeholder="Select" />
                                              </SelectTrigger>
                                              <SelectContent className="dark:bg-slate-950 dark:border-slate-800">
                                                  <SelectItem value="agent1" className="dark:focus:bg-slate-800 dark:text-white">Agent 1</SelectItem>
                                                  <SelectItem value="agent2" className="dark:focus:bg-slate-800 dark:text-white">Agent 2</SelectItem>
                                              </SelectContent>
                                          </Select>
                                      </div>
                                  </div>
                                  <div className="flex justify-end gap-3 pt-2">
                                      <Button 
                                          variant="outline" 
                                          className="px-6 py-2 h-10 border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                                          onClick={handleCancelFolder}
                                      >
                                          Cancel
                                      </Button>
                                      <Button 
                                          className="px-8 py-2 h-10 btn-outline-primary shadow-none font-medium"
                                          variant="outline"
                                          onClick={handleSave_Folder}
                                      >
                                          Save
                                      </Button>
                                  </div>
                              </div>
                          )}
                       </div>
                  </div>
               </div>
            </TabsContent>

            {/* Pause Tab */}
            <TabsContent value="pause" className="mt-0">
               <div className="bg-white dark:bg-slate-900 border border-t-0 border-gray-200 dark:border-slate-800 rounded-b-lg p-6 space-y-6">
                  
                  <div className="space-y-4 text-left">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                          Automatically pause the Smart Flow when initiating a conversation?
                      </h3>

                      <RadioGroup
                          value={pauseSmartFlow}
                          onValueChange={(value) => setPauseSmartFlow(value as "manually" | "automatically")}
                          className="space-y-3"
                      >
                          {/* Manually Option */}
                          <div
                              className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all ${
                                  pauseSmartFlow === "manually"
                                      ? "bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700 shadow-sm"
                                      : "bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800"
                              }`}
                              onClick={() => setPauseSmartFlow("manually")}
                          >
                               <div className="flex items-center gap-3">
                                  <RadioGroupItem value="manually" id="manually" />
                                  <Label htmlFor="manually" className="font-medium cursor-pointer text-gray-700 dark:text-gray-200">Manually</Label>
                               </div>
                               <span className="text-sm text-gray-500 dark:text-gray-400">Do not pause the Smart Flow when an agent send a message</span>
                          </div>

                          {/* Automatically Option */}
                          <div
                               className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all ${
                                  pauseSmartFlow === "automatically"
                                      ? "bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700 shadow-sm"
                                      : "bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800"
                              }`}
                              onClick={() => setPauseSmartFlow("automatically")}
                          >
                              <div className="flex items-center gap-3">
                                  <RadioGroupItem value="automatically" id="automatically" />
                                  <Label htmlFor="automatically" className="font-medium cursor-pointer text-gray-700 dark:text-gray-200">Automatically</Label>
                              </div>
                              <span className="text-sm text-gray-500 dark:text-gray-400">Pause the Smart Flow when an agent send a message</span>
                          </div>
                      </RadioGroup>
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-start pt-4">
                      <Button 
                          className="px-8 btn-outline-primary" 
                          variant="outline"
                          onClick={handleSavePause}
                      >
                          Save
                      </Button>
                  </div>

               </div>
            </TabsContent>

          </Tabs>
        </div>
      </CardContent>
    </>
  );
}

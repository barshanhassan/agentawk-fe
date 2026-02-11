import { useState, useEffect, useCallback } from "react";
import { useLocation, useRoute } from "wouter";
import ReactFlow, {
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    Connection,
    Edge,
    Node,
    Handle,
    Position,
    NodeProps,
    ReactFlowInstance,
    useReactFlow,
    ReactFlowProvider
} from 'reactflow';
import 'reactflow/dist/style.css';

import {
    FaArrowLeft,
    FaUndo,
    FaRedo,
    FaPlus,
    FaSearchPlus,
    FaSearchMinus,
    FaEdit,
    FaRobot,
    FaMinus,
    FaPhone,
    FaComment,
    FaInstagram,
    FaFacebookMessenger,
    FaWhatsapp,
    FaTelegram,
    FaRandom,
    FaClock,
    FaCodeBranch,
    FaBolt,
    FaProjectDiagram,
    FaTimes,
    FaPlay,
    FaCopy,
    FaTrashAlt,
    FaFont,
    FaImage,
    FaMicrophone,
    FaVideo,
    FaFileAlt,
    FaUserEdit,
    FaListUl,
    FaFileSignature,
    FaMousePointer,
    FaQuestionCircle,
    FaBrain,
    FaCogs,
    FaChevronDown,
    FaBold,
    FaItalic,
} from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// define Node type
type StartNodeData = {
    label: string;
};

// Custom Start Node Component
const StartNode = ({ data }: NodeProps<StartNodeData>) => {
    return (
        <div className="bg-white rounded-md shadow-sm border border-gray-200 w-[220px]">
            <div className="py-1.5 px-3 border-b border-gray-200">
                <div className="font-bold text-gray-700 text-sm">Start</div>
            </div>
            <div className="py-1.5 px-3 relative bg-gray-50 rounded-b-md">
                <div className="text-xs text-gray-600">Default</div>
                <Handle
                    type="source"
                    position={Position.Right}
                    id="default"
                    className="w-2.5 h-2.5 bg-gray-400 border-2 border-white"
                    style={{ right: -5, top: '50%' }}
                />
            </div>
        </div>
    );
};

const StepNode = ({ id, data }: NodeProps<{ label: string; icon?: any; color?: string; text?: string; onDelete?: (id: string) => void }>) => {
    const { setNodes } = useReactFlow();
    // Resolve icon if passed, else default
    const Icon = data.icon || FaRobot;

    const onDuplicate = (e: React.MouseEvent) => {
        e.stopPropagation();
        setNodes((nds) => {
            const node = nds.find(n => n.id === id);
            if (!node) return nds;
            const newNode = {
                ...node,
                id: `step-${Date.now()}`,
                position: { x: node.position.x + 40, y: node.position.y + 40 },
                selected: false,
            };
            return nds.concat(newNode);
        });
    };

    const onDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (data.onDelete) {
            data.onDelete(id);
        } else {
            // Fallback if handler not passed
            if (window.confirm("Are you sure you want to delete this block?")) {
                setNodes((nds) => nds.filter((node) => node.id !== id));
            }
        }
    };

    return (
        <div className="relative group bg-white rounded-md shadow-sm border border-gray-200 w-[220px]">
            {/* Hover Actions */}
            <div className="absolute -top-10 left-0 hidden group-hover:flex items-center gap-1.5 z-50 pb-4">
                <button
                    onClick={onDuplicate}
                    className="p-1.5 bg-white border border-gray-200 rounded-md shadow-sm hover:bg-blue-50 hover:text-blue-600 text-gray-400 transition-colors"
                    title="Duplicate"
                >
                    <FaCopy className="w-3.5 h-3.5" />
                </button>
                <button
                    onClick={onDelete}
                    className="p-1.5 bg-white border border-gray-200 rounded-md shadow-sm hover:bg-red-50 hover:text-red-600 text-gray-400 transition-colors"
                    title="Delete"
                >
                    <FaTrashAlt className="w-3.5 h-3.5" />
                </button>
            </div>

            <div className="py-1.5 px-3 border-b border-gray-200 flex items-center gap-2">
                <div style={{ color: data.color || '#6B7280' }}>
                    <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="font-bold text-gray-700 text-sm">{data.label}</div>
            </div>
            <div className="p-1.5">
                <div className={`py-2.5 px-3 relative bg-gray-50 rounded border text-center transition-all ${data.text ? 'border-solid border-gray-200 bg-white shadow-sm' : 'border-dashed border-gray-300'}`}>
                    {data.text ? (
                        <div className="text-[10px] text-gray-700 font-medium line-clamp-3 leading-tight">{data.text}</div>
                    ) : (
                        <div className="text-xs text-gray-500">Click to configure</div>
                    )}
                    <Handle
                        type="target"
                        position={Position.Left}
                        id="target"
                        className="w-2.5 h-2.5 bg-gray-400 border-2 border-white"
                        style={{ left: -11, top: '50%' }}
                    />
                    <Handle
                        type="source"
                        position={Position.Right}
                        id="source"
                        className="w-2.5 h-2.5 bg-gray-400 border-2 border-white"
                        style={{ right: -11, top: '50%' }}
                    />
                </div>
            </div>
        </div>
    );
};

const nodeTypes = {
    start: StartNode,
    step: StepNode,
};

const initialNodes: Node[] = [
    {
        id: 'start-node',
        type: 'start',
        position: { x: 50, y: 50 },
        data: { label: 'Start' },
        draggable: true,
    },
];

const mockMenuItems = [
    { type: 'header', label: 'Twilio Call' },
    { type: 'item', label: 'Call from twilio', icon: FaPhone, color: '#008CFF' },
    { type: 'item', label: 'SMS from Twilio', icon: FaComment, color: '#008CFF' },
    { type: 'item', label: 'Instagram', icon: FaInstagram, color: '#E1306C' },
    { type: 'item', label: 'Messenger', icon: FaFacebookMessenger, color: '#0084FF' },
    { type: 'item', label: 'TestTiagoStage', icon: FaRobot, color: '#6366F1' },
    { type: 'item', label: 'Do Not Delete This', icon: FaRobot, color: '#6366F1' },
    { type: 'item', label: 'Whatsapp', icon: FaWhatsapp, color: '#25D366' },
    { type: 'item', label: 'Telegram', icon: FaTelegram, color: '#24A1DE' },
    { type: 'item', label: 'Randomizer', icon: FaRandom, color: '#00B8D9' },
    { type: 'item', label: 'Delay', icon: FaClock, color: '#FFAB00' },
    { type: 'item', label: 'Condition', icon: FaCodeBranch, color: '#6554C0' },
    { type: 'item', label: 'Action', icon: FaBolt, color: '#36B37E' },
    { type: 'item', label: 'Splitter', icon: FaProjectDiagram, color: '#FF5630' },
];

export default function SmartFlowBuilderPage() {
    const [match, params] = useRoute("/automations/:id");
    const id = match ? params?.id : null;
    const [, setLocation] = useLocation();
    const [isSaving, setIsSaving] = useState(false);
    const [flowName, setFlowName] = useState("Loading...");
    const [flowStatus, setFlowStatus] = useState<"draft" | "active" | "unpublished">("draft");
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const [nodeIdToDelete, setNodeIdToDelete] = useState<string | null>(null);
    const [showAddStepMenu, setShowAddStepMenu] = useState(false);

    // Text Editor States
    const [isTextEditorOpen, setIsTextEditorOpen] = useState(false);
    const [tempTextValue, setTempTextValue] = useState("");

    // Custom states for Whatsapp configuration
    const [isWhatsappWindowDropdownOpen, setIsWhatsappWindowDropdownOpen] = useState(false);
    const [whatsappWindow, setWhatsappWindow] = useState("Send within 24 hours window");

    // ReactFlow Instance State
    const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);

    // ReactFlow hooks
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const selectedNode = nodes.find(n => n.id === selectedNodeId);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    const requestDelete = useCallback((id: string) => {
        setNodeIdToDelete(id);
    }, []);

    const confirmDelete = () => {
        if (nodeIdToDelete) {
            setNodes((nds) => nds.filter((node) => node.id !== nodeIdToDelete));
            setNodeIdToDelete(null);
            if (selectedNodeId === nodeIdToDelete) {
                setSelectedNodeId(null);
            }
        }
    };

    const onConnect = useCallback(
        (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    );

    useEffect(() => {
        if (id) {
            // Mock fetching flow data
            setTimeout(() => {
                const mockFlows = [
                    { id: "1", name: "Welcome Flow", status: "active" },
                    { id: "2", name: "Follow-up Sequence", status: "draft" },
                    { id: "3", name: "Abandoned Cart Recovery", status: "active" },
                    { id: "4", name: "Product Launch Announcement", status: "unpublished" },
                ];

                const flow = mockFlows.find(f => f.id === id);
                if (flow) {
                    setFlowName(flow.name);
                    setFlowStatus(flow.status as "draft" | "active" | "unpublished");
                } else {
                    setFlowName("New Smart Flow");
                    setFlowStatus("draft");
                }
            }, 500);
        }
    }, [id]);

    const handleZoomIn = () => {
        rfInstance?.zoomIn();
    };

    const handleZoomOut = () => {
        rfInstance?.zoomOut();
    };

    const handleAddStep = (label: string) => {
        const menuItem: any = mockMenuItems.find(item => item.label === label);
        const icon = menuItem?.icon;
        const color = menuItem?.color;

        const newNode: Node = {
            id: `step-${Date.now()}`,
            type: 'step',
            position: {
                x: 250 + (nodes.length * 20),
                y: 100 + (nodes.length * 20)
            },
            data: { label, icon, color, onDelete: requestDelete },
        };

        setNodes((nds) => nds.concat(newNode));
        setShowAddStepMenu(false);
    };

    return (
        <div className="flex flex-col h-screen bg-gray-50 overflow-hidden text-sm">
            <style>{`
                .react-flow__pane {
                    cursor: default !important;
                }
                .react-flow__renderer {
                    cursor: default !important;
                }
            `}</style>

            {/* Top Bar with actions */}
            <div className="h-14 bg-white border-b flex items-center justify-between px-6 shadow-sm z-10 sticky top-0">
                {/* Left: EZCONN Heading */}
                <div className="flex items-center gap-2 w-1/3">
                    <div className="bg-blue-600 p-1.5 rounded-md">
                        <FaRobot className="text-white h-4 w-4" />
                    </div>
                    <span className="font-bold text-blue-600 text-lg tracking-tight">EZCONN</span>
                </div>

                {/* Center: Flow Name */}
                <div className="flex flex-col items-center flex-1">
                    <h5 className="font-semibold text-gray-700">{flowName}</h5>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center justify-end gap-3 w-1/3">
                    {isSaving && (
                        <span className="text-xs text-gray-400 animate-pulse mr-1">Saving...</span>
                    )}

                    <div className="flex items-center gap-1.5 mr-2">
                        <Button variant="outline" size="icon" className="h-8 w-8 rounded-full border-gray-200 text-gray-400 hover:text-gray-600">
                            <FaUndo className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="icon" className="h-8 w-8 rounded-full border-gray-200 text-gray-400 hover:text-gray-600">
                            <FaRedo className="h-3 w-3" />
                        </Button>
                    </div>

                    {flowStatus === "active" && (
                        <>
                            <Button variant="outline" size="sm" className="h-9 px-4 text-gray-600 border-gray-200 font-medium hover:bg-gray-50">Edit</Button>
                            <Button variant="outline" size="sm" className="h-9 px-4 text-gray-600 border-gray-200 font-medium hover:bg-gray-50">Clear Queue</Button>
                        </>
                    )}

                    <Button variant="outline" size="sm" className="h-9 px-4 text-gray-600 border-gray-200 font-medium hover:bg-gray-50" onClick={() => setLocation("/automations")}>Exit</Button>
                    {flowStatus !== "active" && <Button size="sm" className="h-9 px-5 bg-blue-600 hover:bg-blue-700 font-medium tracking-wide">Publish</Button>}
                </div>
            </div>

            {/* Main Content Area (Canvas + Sidebar) */}
            <div className="flex-1 flex min-h-0 relative overflow-hidden">
                {/* Canvas Area */}
                <div className="flex-1 relative overflow-hidden bg-white border-r border-gray-200">
                    <ReactFlowProvider>
                        <ReactFlow
                            nodes={nodes}
                            edges={edges}
                            onNodesChange={onNodesChange}
                            onEdgesChange={onEdgesChange}
                            onConnect={onConnect}
                            nodeTypes={nodeTypes}
                            onInit={setRfInstance}
                            defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
                            className="cursor-default"
                            style={{ cursor: 'default' }}
                            panOnDrag={true}
                            panOnScroll={true}
                            zoomOnScroll={true}
                            onPaneClick={() => {
                                setSelectedNodeId(null);
                                setShowAddStepMenu(false);
                                setIsTextEditorOpen(false);
                            }}
                            onNodeClick={(event, node) => {
                                setSelectedNodeId(node.id);
                                setIsTextEditorOpen(false);
                            }}
                        />
                    </ReactFlowProvider>

                    {/* Floating Controls */}
                    {!selectedNodeId && (
                        <div className="absolute top-1/2 right-8 -translate-y-1/2 flex flex-col gap-4">
                            {flowStatus !== "active" && (
                                <div className="relative">
                                    <TooltipProvider delayDuration={300}>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button size="icon" onClick={() => setShowAddStepMenu(!showAddStepMenu)} className="h-12 w-12 rounded-full bg-primary hover:bg-primary/90 text-white shadow-xl transition-all hover:scale-110 active:scale-95 border-b-4 border-primary-dark">
                                                    <FaPlus className="h-5 w-5" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent side="left">Add Flow Step</TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>

                                    {showAddStepMenu && (
                                        <div className="absolute right-[55px] top-0">
                                            <div className="bg-white w-[250px] max-h-[400px] overflow-auto border border-gray-200 divide-y divide-gray-200 rounded shadow-lg">
                                                {mockMenuItems.map((item, index) => (
                                                    item.type === 'header' ? (
                                                        <div key={index} className="px-3 py-2 bg-gray-50 font-semibold text-sm text-gray-700">{item.label}</div>
                                                    ) : (
                                                        <div key={index} onClick={() => { handleAddStep(item.label); setShowAddStepMenu(false); }} className="flex items-center cursor-pointer px-3 py-2 hover:bg-gray-50 transition-colors">
                                                            <div className="mr-3" style={{ color: item.color || '#6B7280' }}>
                                                                {item.icon && (() => { const Icon = item.icon; return <Icon className="h-5 w-5" />; })()}
                                                            </div>
                                                            <div className="grow"><p className="text-sm text-gray-700">{item.label}</p></div>
                                                        </div>
                                                    )
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="flex flex-col bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                                <TooltipProvider delayDuration={300}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button variant="ghost" size="icon" onClick={handleZoomIn} className="h-10 w-10 rounded-none border-b border-gray-100 hover:bg-gray-50 text-gray-500"><FaSearchPlus className="h-3.5 w-3.5" /></Button>
                                        </TooltipTrigger>
                                        <TooltipContent side="left">Zoom In</TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                <TooltipProvider delayDuration={300}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button variant="ghost" size="icon" onClick={handleZoomOut} className="h-10 w-10 rounded-none hover:bg-gray-50 text-gray-500"><FaSearchMinus className="h-3.5 w-3.5" /></Button>
                                        </TooltipTrigger>
                                        <TooltipContent side="left">Zoom Out</TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Sidebar: Node Inspector */}
                {selectedNode && (
                    <>
                        {isTextEditorOpen && (
                            <div className="absolute top-0 bottom-0 right-[400px] w-[320px] bg-white border-l border-gray-200 shadow-[-8px_0_24px_rgba(0,0,0,0.05)] z-[60] flex flex-col animate-in slide-in-from-right-1 duration-300">
                                <div className="h-14 border-b px-4 flex items-center justify-between bg-white text-gray-800 shrink-0">
                                    <div className="flex items-center gap-2 font-bold text-xs tracking-wide text-gray-500">
                                        <FaFont className="h-3 w-3 text-blue-500" />
                                        <span>EDIT TEXT</span>
                                    </div>
                                    <div className="flex gap-1">
                                        <button className="p-1 px-2 hover:bg-gray-100 rounded border border-gray-200 bg-white text-gray-700 font-bold text-[10px] shadow-sm" title="Bold">B</button>
                                        <button className="p-1 px-2 hover:bg-gray-100 rounded border border-gray-200 bg-white text-gray-700 italic font-bold text-[10px] shadow-sm" title="Italic">I</button>
                                    </div>
                                </div>
                                <div className="flex-1 p-4 bg-white overflow-y-auto min-h-0">
                                    <textarea
                                        value={tempTextValue}
                                        onChange={(e) => setTempTextValue(e.target.value)}
                                        className="w-full min-h-[150px] p-4 border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-400 focus:border-blue-400 outline-none resize-y text-sm text-gray-700 placeholder:text-gray-400 transition-all bg-white"
                                        placeholder="Enter your Message Here"
                                    />
                                </div>
                                <div className="p-4 bg-gray-50 border-t border-gray-100 flex flex-col gap-2 shrink-0">
                                    <button onClick={() => { if (selectedNodeId) { setNodes(nds => nds.map(n => n.id === selectedNodeId ? { ...n, data: { ...n.data, text: tempTextValue } } : n)); } setIsTextEditorOpen(false); }} className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-bold shadow-md transition-all active:scale-[0.98]">Save Changes</button>
                                    <button onClick={() => setIsTextEditorOpen(false)} className="w-full py-2 text-xs font-semibold text-gray-500 hover:text-gray-700 transition-colors uppercase tracking-wider">Close</button>
                                </div>
                            </div>
                        )}

                        <div className="w-[400px] bg-white border-l border-gray-200 flex flex-col shadow-[-4px_0_12px_rgba(0,0,0,0.02)] relative z-[70]">
                            <div className="h-14 border-b px-4 flex items-center justify-between bg-blue-600 text-white">
                                <div className="flex items-center gap-2">
                                    <div className="bg-white/20 p-1 rounded">
                                        {selectedNode.data.icon ? (() => { const Icon = selectedNode.data.icon; return <Icon className="h-4 w-4" style={{ color: selectedNode.data.color || 'white' }} />; })() : <FaRobot className="h-4 w-4 text-white" />}
                                    </div>
                                    <span className="font-bold text-lg tracking-wide">{selectedNode.data.label}</span>
                                </div>
                                <button onClick={() => { setSelectedNodeId(null); setIsTextEditorOpen(false); }} className="text-white hover:bg-blue-700 p-1.5 rounded transition-colors border border-white/30"><FaTimes className="h-4 w-4" /></button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 bg-white text-gray-800">
                                {selectedNode.type === 'start' ? (
                                    <div className="p-6 text-center">
                                        <div className="p-4 bg-gray-50 rounded-full mb-3 inline-block"><FaRobot className="h-10 w-10 text-gray-300" /></div>
                                        <h3 className="font-semibold text-gray-800 mb-1">No AI Logic Configured</h3>
                                        <p className="text-xs text-gray-500 leading-relaxed max-w-[200px] mx-auto">Add an AI node to your flow to configure ReplyAgent behavior.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Configure Node</label>

                                        {selectedNode.data.label === 'Twilio Call' && (
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Sender Number</label>
                                                    <select className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border bg-white">
                                                        <option>Select a number...</option>
                                                        <option>+1 (555) 000-0000</option>
                                                        <option>+1 (555) 123-4567</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Assignee</label>
                                                    <select className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border bg-white">
                                                        <option>Select Agent/Team...</option>
                                                        <option>Support Team</option>
                                                        <option>Sales Team</option>
                                                    </select>
                                                </div>
                                            </div>
                                        )}

                                        {selectedNode.data.label === 'SMS from Twilio' && (
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Sender Number</label>
                                                    <select className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border bg-white">
                                                        <option>Select a number...</option>
                                                        <option>+1 (555) 000-0000</option>
                                                        <option>+1 (555) 123-4567</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Message</label>
                                                    <textarea className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border bg-white" rows={4} placeholder="Type your message here..." />
                                                </div>
                                            </div>
                                        )}

                                        {selectedNode.data.label === 'Whatsapp' && (
                                            <div className="flex flex-col gap-5">
                                                <div className="relative">
                                                    <button onClick={() => setIsWhatsappWindowDropdownOpen(!isWhatsappWindowDropdownOpen)} className="w-full flex items-center justify-between border border-gray-300 rounded-md shadow-sm p-3 bg-white text-sm hover:border-blue-400 transition-colors">
                                                        <div className="flex items-center gap-2"><FaWhatsapp className="text-[#25D366] w-4 h-4" /><span className="font-medium text-gray-700">{whatsappWindow}</span></div>
                                                        <FaChevronDown className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${isWhatsappWindowDropdownOpen ? 'rotate-180' : ''}`} />
                                                    </button>
                                                    {isWhatsappWindowDropdownOpen && (
                                                        <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-xl z-[100] overflow-hidden animate-in fade-in slide-in-from-top-1">
                                                            {['Send within 24 hours window', 'Send outside 24 hours window'].map((opt) => (
                                                                <button key={opt} onClick={() => { setWhatsappWindow(opt); setIsWhatsappWindowDropdownOpen(false); }} className="w-full flex items-center gap-3 p-3 hover:bg-blue-50 text-sm text-left border-b border-gray-50 last:border-0 transition-colors group">
                                                                    <FaWhatsapp className="text-[#25D366] w-4 h-4" />
                                                                    <span className={`transition-colors ${whatsappWindow === opt ? 'text-blue-600 font-semibold' : 'text-gray-700 group-hover:text-blue-600'}`}>{opt}</span>
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>

                                                {(selectedNode.data as any).showTextBlock && (
                                                    <div className={`border rounded-lg p-3 relative group/textblock transition-all ${(selectedNode.data as any).text ? 'border-solid border-gray-200 bg-white shadow-sm' : 'border-2 border-dashed border-blue-400 bg-blue-50/30'}`}>
                                                        <div className="flex justify-between items-start mb-2">
                                                            <span className={`text-[10px] font-bold uppercase tracking-wider ${(selectedNode.data as any).text ? 'text-gray-500' : 'text-blue-600'}`}>Text</span>
                                                            <button onClick={(e) => { e.stopPropagation(); setNodes(nds => nds.map(n => n.id === selectedNode.id ? { ...n, data: { ...n.data, showTextBlock: false, text: "" } } : n)); if (isTextEditorOpen) setIsTextEditorOpen(false); }} className="text-gray-400 hover:text-red-500 transition-colors"><FaTrashAlt className="w-3 h-3" /></button>
                                                        </div>
                                                        <button onClick={() => { setTempTextValue((selectedNode.data as any).text || ""); setIsTextEditorOpen(true); }} className="w-full text-left bg-white border border-gray-200 rounded p-2.5 shadow-sm hover:border-blue-400 transition-all">
                                                            {(selectedNode.data as any).text ? <p className="text-xs text-gray-700 line-clamp-2">{(selectedNode.data as any).text}</p> : <p className="text-xs text-gray-400">← Add text</p>}
                                                        </button>
                                                    </div>
                                                )}

                                                <div className="h-[1px] bg-gray-200 w-full" />

                                                <div className="flex gap-4 relative">
                                                    <div className="flex-1 space-y-2">
                                                        {[
                                                            { label: 'T Text', icon: FaFont, color: '#0084FF' },
                                                            { label: 'Audio', icon: FaMicrophone, color: '#25D366' },
                                                            { label: 'Document', icon: FaFileAlt, color: '#FFAC33' },
                                                            { label: 'Contact response', icon: FaUserEdit, color: '#6554C0' },
                                                            { label: 'Message Template', icon: FaFileSignature, color: '#36B37E' },
                                                            { label: '? ChatGPT Question', icon: FaQuestionCircle, color: '#6366F1' },
                                                            { label: 'ChatGPT Answer', icon: FaBrain, color: '#F59E0B' },
                                                        ].map((btn, idx) => (
                                                            <button key={idx} onClick={() => { if (btn.label === 'T Text') setNodes(nds => nds.map(n => n.id === selectedNode.id ? { ...n, data: { ...n.data, showTextBlock: true } } : n)); }} className="w-full flex items-center gap-2.5 p-3 bg-white border border-gray-100 rounded-md hover:border-blue-400 hover:bg-blue-50 transition-all text-left group active:scale-[0.97] shadow-sm">
                                                                <div className="shrink-0 p-1 rounded bg-gray-50 group-hover:bg-white transition-colors">
                                                                    {(() => { const Icon = btn.icon; return <Icon className="w-3.5 h-3.5" style={{ color: btn.color }} />; })()}
                                                                </div>
                                                                <span className="text-[9px] font-bold text-gray-600 leading-tight group-hover:text-blue-700 transition-colors uppercase tracking-tight">{btn.label}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                    <div className="flex-1 space-y-2">
                                                        {[
                                                            { label: 'Image', icon: FaImage, color: '#E1306C' },
                                                            { label: 'Video', icon: FaVideo, color: '#FF0000' },
                                                            { label: 'Delay', icon: FaClock, color: '#FFAB00' },
                                                            { label: 'Message List', icon: FaListUl, color: '#00B8D9' },
                                                            { label: 'CTA Button', icon: FaMousePointer, color: '#FF5630' },
                                                            { label: '? Ai Audio Question', icon: FaMicrophone, color: '#6366F1' },
                                                            { label: 'Dify.ai Question', icon: FaCogs, color: '#0EA5E9' },
                                                        ].map((btn, idx) => (
                                                            <button key={idx} className="w-full flex items-center gap-2.5 p-3 bg-white border border-gray-100 rounded-md hover:border-blue-400 hover:bg-blue-50 transition-all text-left group active:scale-[0.97] shadow-sm">
                                                                <div className="shrink-0 p-1 rounded bg-gray-50 group-hover:bg-white transition-colors">
                                                                    {(() => { const Icon = btn.icon; return <Icon className="h-3.5 w-3.5" style={{ color: btn.color }} />; })()}
                                                                </div>
                                                                <span className="text-[9px] font-bold text-gray-600 leading-tight group-hover:text-blue-700 transition-colors uppercase tracking-tight">{btn.label}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {selectedNode.data.label !== 'Twilio Call' && selectedNode.data.label !== 'SMS from Twilio' && selectedNode.data.label !== 'Whatsapp' && (
                                            <div className="text-center text-gray-500 py-10 border-2 border-dashed rounded-lg">
                                                <p>Configuration for <strong>{selectedNode.data.label}</strong></p>
                                                <span className="text-xs">Coming soon</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>

            <AlertDialog open={!!nodeIdToDelete} onOpenChange={(open) => !open && setNodeIdToDelete(null)}>
                <AlertDialogContent className="bg-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>This action cannot be undone. This will permanently delete this block from your flow.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="border-gray-200">No</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700 text-white border-0">Yes</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

import { useState, useEffect, useCallback } from "react";
import { useLocation, useRoute } from "wouter";
import { Switch } from "@/components/ui/switch";
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
    FaTextHeight,
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
    FaChevronUp,
    FaBold,
    FaItalic,
    FaInfoCircle,
} from "react-icons/fa";
import { SiGoogle, SiOpenai } from "react-icons/si";
import MediaGallerySection from "@/components/workspace/MediaGallerySection";
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
import { X } from "lucide-react";
// The instruction to remove an extra closing brace at line 919 cannot be applied as the provided document does not reach line 919.
// Assuming the user intended to add the 'cn' import as shown in the example, I'm adding it here.
// If the line number was a typo and referred to a brace within the provided content, please clarify.

// define Node type
type StartNodeData = {
    label: string;
};

// Custom Start Node Component

// Custom Number Input Component with vertical controls

// Custom Assistant Dropdown Component with icons
const AssistantDropdown = ({ value, onChange, options }: { value: string, onChange: (val: string) => void, options: string[] }) => {
    const [isOpen, setIsOpen] = useState(false);

    const getIcon = (name: string) => {
        const lower = name.toLowerCase();
        if (lower.includes('gemini') || lower.includes('google')) return <SiGoogle className="w-3 h-3 text-blue-500" />;
        if (lower.includes('openai') || lower.includes('gpt')) return <SiOpenai className="w-3 h-3 text-emerald-500" />;
        if (lower.includes('anthropic') || lower.includes('claude')) return <FaBrain className="w-3 h-3 text-orange-500" />;
        if (lower.includes('deepseek')) return <FaRobot className="w-3 h-3 text-indigo-500" />;
        return <FaRobot className="w-3 h-3 text-gray-400" />;
    };

    return (
        <div className="relative">
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 cursor-pointer flex items-center justify-between hover:border-blue-300 transition-all shadow-sm"
            >
                <div className="flex items-center gap-2">
                    {getIcon(value)}
                    <span>{value || "Select an agent"}</span>
                </div>
                <FaChevronDown className={`w-2.5 h-2.5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-[100] max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-1">
                        {options.map(option => (
                            <div
                                key={option}
                                onClick={() => {
                                    onChange(option);
                                    setIsOpen(false);
                                }}
                                className="px-3 py-2 text-[11px] font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-700 rounded-md cursor-pointer transition-all flex items-center gap-2 group"
                            >
                                {getIcon(option)}
                                <span>{option}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const CustomNumberInput = ({ value, onChange, min = 1, max = 100, unit }: { value: number, onChange: (val: number) => void, min?: number, max?: number, unit: string }) => {
    return (
        <div className="flex items-center gap-0 bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:border-blue-300 transition-all">
            <input
                type="number"
                value={value}
                onChange={(e) => onChange(Math.max(min, Math.min(max, parseInt(e.target.value) || min)))}
                className="w-12 h-10 text-center text-sm font-bold text-gray-700 outline-none border-none focus:ring-0 p-0"
            />
            <div className="flex flex-col border-l border-gray-100">
                <button
                    onClick={() => onChange(Math.min(max, value + 1))}
                    className="flex-1 px-2.5 flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all border-b border-gray-50"
                >
                    <FaChevronUp className="w-2.5 h-2.5" />
                </button>
                <button
                    onClick={() => onChange(Math.max(min, value - 1))}
                    className="flex-1 px-2.5 flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                >
                    <FaChevronDown className="w-2.5 h-2.5" />
                </button>
            </div>
            <div className="h-6 w-[1px] bg-gray-200 mx-0" />
            <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider bg-gray-50/50 h-10 flex items-center">
                {unit}
            </div>
        </div>
    );
};

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

const StepNode = ({ id, data }: NodeProps<{
    label: string;
    icon?: any;
    color?: string;
    text?: string;
    buttons?: Array<{ id: string; text: string }>;
    blocks?: Array<{
        id: string;
        type: 'text';
        text: string;
        buttons?: Array<{ id: string; text: string }>;
        typingIndicator?: boolean;
    }>;
    onDelete?: (id: string) => void
}>) => {
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


    // Prepare blocks for rendering, supporting legacy structure
    const blocks = data.blocks || (data.text || data.buttons ? [{
        id: 'legacy-block',
        type: 'text',
        text: data.text || '',
        buttons: data.buttons || [],
    }] : []);

    return (
        <div className="group relative">
            <div className={`bg-white rounded-lg shadow-lg border-2 w-[240px] transition-all overflow-hidden ${blocks.length > 0 ? 'border-blue-400' : 'border-gray-200 group-hover:border-blue-200'}`}>
                {/* Header */}
                <div className="py-2.5 px-3 border-b border-gray-100 bg-blue-50/30 flex items-center gap-2">
                    <div className="p-1 rounded bg-white shadow-sm shrink-0">
                        {data.icon ? (() => { const Icon = data.icon; return <Icon className="h-4 w-4" style={{ color: data.color || '#25D366' }} />; })() : <FaRobot className="h-4 w-4 text-blue-500" />}
                    </div>
                    <div className="font-bold text-gray-800 text-sm tracking-tight">{data.label}</div>
                </div>

                <div className="p-3 space-y-4">
                    {blocks.length === 0 ? (
                        <div className="py-2.5 px-3 relative bg-gray-50 rounded border border-dashed border-gray-300 text-center transition-all">
                            <div className="text-xs text-gray-500">Click to configure</div>
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
                    ) : (
                        <div className="space-y-4">
                            {blocks.map((block, bIdx) => (
                                <div key={block.id} className="space-y-2">
                                    {(block as any).type === 'chatgpt' || (block as any).type === 'ai_studio_question' || (block as any).type === 'dify_question' ? (
                                        <div className="py-2.5 px-3 relative bg-gray-50 rounded border border-dashed border-gray-300 shadow-sm flex flex-col items-center justify-center p-4">
                                            <div className="text-xs font-bold text-gray-700 mb-2">
                                                {(block as any).type === 'chatgpt' ? 'ChatGPT Answer' :
                                                    (block as any).type === 'ai_studio_question' ? 'AI Studio Question' : 'Dify.ai Question'}
                                            </div>
                                            <div className="flex items-center gap-2 text-indigo-600 font-semibold text-xs bg-indigo-50 px-3 py-1.5 rounded-md border border-indigo-100 w-full justify-center">
                                                <FaTextHeight className="w-3 h-3" />
                                                <span>{(block as any).type === 'chatgpt' ? ((block as any).text || 'Add Text') : ((block as any).question || 'Add Question')}</span>
                                            </div>

                                            {/* Target handle on the first block */}
                                            {bIdx === 0 && (
                                                <Handle
                                                    type="target"
                                                    position={Position.Left}
                                                    id="target"
                                                    className="w-2.5 h-2.5 bg-gray-400 border-2 border-white"
                                                    style={{ left: -11, top: '50%' }}
                                                />
                                            )}

                                            {/* Source handle on individual blocks if they have no buttons */}
                                            {(!block.buttons || block.buttons.length === 0) && (
                                                <Handle
                                                    type="source"
                                                    position={Position.Right}
                                                    id={`block-source-${block.id}`}
                                                    className="w-2.5 h-2.5 bg-gray-400 border-2 border-white"
                                                    style={{ right: -11, top: '50%' }}
                                                />
                                            )}
                                        </div>
                                    ) : (
                                        <div className="py-2.5 px-3 relative bg-white rounded border border-solid border-gray-200 shadow-sm">
                                            <div className="text-[10px] text-gray-700 font-medium line-clamp-3 leading-tight">
                                                {block.text || 'Message text...'}
                                            </div>

                                            {/* Target handle on the first block */}
                                            {bIdx === 0 && (
                                                <Handle
                                                    type="target"
                                                    position={Position.Left}
                                                    id="target"
                                                    className="w-2.5 h-2.5 bg-gray-400 border-2 border-white"
                                                    style={{ left: -11, top: '50%' }}
                                                />
                                            )}

                                            {/* Source handle on individual blocks if they have no buttons */}
                                            {(!block.buttons || block.buttons.length === 0) && (
                                                <Handle
                                                    type="source"
                                                    position={Position.Right}
                                                    id={`block-source-${block.id}`}
                                                    className="w-2.5 h-2.5 bg-gray-400 border-2 border-white"
                                                    style={{ right: -11, top: '50%' }}
                                                />
                                            )}
                                        </div>
                                    )}
                                    {/* Buttons for this block */}
                                    {block.buttons && block.buttons.length > 0 && (
                                        <div className="space-y-1.5 pl-2">
                                            {block.buttons.map((btn, btnIdx) => (
                                                <div key={btn.id} className="relative group/btn">
                                                    <div className="py-1.5 px-3 bg-white border border-gray-200 rounded text-[10px] text-gray-700 font-bold text-center shadow-sm relative z-10 transition-colors hover:border-blue-300">
                                                        {btn.text || `Button ${btnIdx + 1}`}
                                                    </div>
                                                    <Handle
                                                        type="source"
                                                        position={Position.Right}
                                                        id={`btn-${btn.id}`}
                                                        className="w-2.5 h-2.5 bg-gray-400 border-2 border-white shadow-sm"
                                                        style={{ right: -11, top: '50%', zIndex: 20 }}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Duplicate & Delete Toolbar - appears on hover */}
            <div
                className="absolute -top-6 left-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all z-50 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto scale-90 group-hover:scale-100 origin-bottom-left pb-1 nodrag"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
            >
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        onDuplicate(e);
                    }}
                    className="p-1.5 text-gray-400 hover:text-blue-600 transition-all"
                    title="Duplicate"
                >
                    <FaCopy className="w-3.5 h-3.5" />
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        onDelete(e);
                    }}
                    className="p-1.5 text-gray-400 hover:text-red-500 transition-all"
                    title="Delete"
                >
                    <FaTrashAlt className="w-3.5 h-3.5" />
                </button>
            </div>
        </div >
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
    const [edgeIdToDelete, setEdgeIdToDelete] = useState<string | null>(null);


    const [showAddStepMenu, setShowAddStepMenu] = useState(false);

    // Text Editor States
    const [isTextEditorOpen, setIsTextEditorOpen] = useState(false);
    const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
    const [tempTextValue, setTempTextValue] = useState("");
    const [tempTypingIndicator, setTempTypingIndicator] = useState(false);

    // Button Editor States
    const [isButtonEditorOpen, setIsButtonEditorOpen] = useState(false);
    const [editingButtonId, setEditingButtonId] = useState<string | null>(null);
    const [tempButtonText, setTempButtonText] = useState("");

    // Image Editor & Gallery States
    const [isImageEditorOpen, setIsImageEditorOpen] = useState(false);
    const [isMediaGalleryOpen, setIsMediaGalleryOpen] = useState(false);
    const [tempImageUrl, setTempImageUrl] = useState("");

    // Audio Editor States
    const [isAudioEditorOpen, setIsAudioEditorOpen] = useState(false);
    const [tempAudioSource, setTempAudioSource] = useState<'gallery' | 'custom'>('gallery');
    const [tempAudioUrl, setTempAudioUrl] = useState("");
    const [tempCustomField, setTempCustomField] = useState("audio");

    // Custom states for Whatsapp configuration
    const [isWhatsappWindowDropdownOpen, setIsWhatsappWindowDropdownOpen] = useState(false);
    const [whatsappWindow, setWhatsappWindow] = useState("Send within 24 hours window");

    // Video Block State
    const [isAddingVideoBlock, setIsAddingVideoBlock] = useState(false);

    // Contact Response Editor States
    const [isContactResponseEditorOpen, setIsContactResponseEditorOpen] = useState(false);
    const [tempContactResponseData, setTempContactResponseData] = useState({
        message: "",
        accumulator: false,
        customField: "",
        incorrectMessage: "",
        retryAttempts: 0,
        waitDuration: 1,
        waitUnit: 'Seconds' as 'Seconds' | 'Minutes' | 'Hours'
    });
    const [isFieldSelectorOpen, setIsFieldSelectorOpen] = useState(false);
    const [fieldSearchQuery, setFieldSearchQuery] = useState("");
    const [fieldSelectorTab, setFieldSelectorTab] = useState<'System fields' | 'Custom fields' | 'Channels'>('System fields');

    // Message List Editor States
    const [isMessageListEditorOpen, setIsMessageListEditorOpen] = useState(false);
    const [tempMessageListData, setTempMessageListData] = useState({
        title: "",
        body: "",
        footer: "",
        buttonText: "",
        sections: [] as Array<{
            id: string;
            name: string;
            options: Array<{
                id: string;
                name: string;
                description: string;
            }>;
        }>
    });

    // CTA Button Editor States
    const [isCtaEditorOpen, setIsCtaEditorOpen] = useState(false);
    const [tempCtaHeader, setTempCtaHeader] = useState("");
    const [tempCtaBody, setTempCtaBody] = useState("");
    const [tempCtaFooter, setTempCtaFooter] = useState("");
    const [tempCtaButtonText, setTempCtaButtonText] = useState("");
    const [tempCtaUrl, setTempCtaUrl] = useState("");

    // Message Template Editor States
    const [isMessageTemplateEditorOpen, setIsMessageTemplateEditorOpen] = useState(false);
    const [tempMessageTemplate, setTempMessageTemplate] = useState("order_processed_v5");

    // NEW BLOCK: AI Studio Question Editor state
    const [isAiStudioEditorOpen, setIsAiStudioEditorOpen] = useState(false);
    const [tempAiStudioMode, setTempAiStudioMode] = useState<'ChatGPT' | 'Vision'>('ChatGPT');

    // ChatGPT Mode State
    const [tempAiStudioAssistant, setTempAiStudioAssistant] = useState("TestsEdilson 2 Gemini");
    const [tempAiStudioQuestion, setTempAiStudioQuestion] = useState("");
    const [tempAiStudioAccumulator, setTempAiStudioAccumulator] = useState(false);
    const [tempAiStudioSmartLoop, setTempAiStudioSmartLoop] = useState(false);
    const [tempAiStudioWaitTime, setTempAiStudioWaitTime] = useState(1);
    const [tempAiStudioSendAnswer, setTempAiStudioSendAnswer] = useState(false);
    const [tempAiStudioSaveCustomField, setTempAiStudioSaveCustomField] = useState(false);
    const [tempAiStudioWaitReplies, setTempAiStudioWaitReplies] = useState(false);
    const [tempAiStudioCounter, setTempAiStudioCounter] = useState(false);

    // AI Studio Modifier States
    const [tempAiStudioAccumulatorTime, setTempAiStudioAccumulatorTime] = useState(5);
    const [tempAiStudioSmartLoopTime, setTempAiStudioSmartLoopTime] = useState(1);
    const [tempAiStudioSmartLoopUnit, setTempAiStudioSmartLoopUnit] = useState("Minutes");
    const [tempAiStudioSaveCustomFieldValue, setTempAiStudioSaveCustomFieldValue] = useState("");
    const [tempAiStudioWaitRepliesSaveLiveChat, setTempAiStudioWaitRepliesSaveLiveChat] = useState(false);
    const [tempAiStudioWaitRepliesMessages, setTempAiStudioWaitRepliesMessages] = useState<{ id: string, text: string }[]>([]);
    const [tempAiStudioCounterCustomField, setTempAiStudioCounterCustomField] = useState("");
    const [tempAiStudioCounterMinute, setTempAiStudioCounterMinute] = useState(1);
    const [tempAiStudioSaveCustomFieldName, setTempAiStudioSaveCustomFieldName] = useState("RespostaGPT");

    // AI Studio custom field pickers state
    const [isAiStudioFieldSelectorOpen, setIsAiStudioFieldSelectorOpen] = useState(false);
    const [isAiStudioCounterFieldSelectorOpen, setIsAiStudioCounterFieldSelectorOpen] = useState(false);
    const [isAiStudioVisionFieldSelectorOpen, setIsAiStudioVisionFieldSelectorOpen] = useState(false);


    // ChatGPT Answer Editor States
    const [isChatGptEditorOpen, setIsChatGptEditorOpen] = useState(false);
    const [tempChatGptText, setTempChatGptText] = useState("");

    // Dify.ai Editor States
    const [isDifyEditorOpen, setIsDifyEditorOpen] = useState(false);
    const [tempDifyAssistant, setTempDifyAssistant] = useState("New_bot");

    // Vision Mode State
    const [tempAiStudioVisionEnabled, setTempAiStudioVisionEnabled] = useState(false);
    const [tempAiStudioVisionModel, setTempAiStudioVisionModel] = useState("gpt-4o-mini");
    const [tempAiStudioVisionPrompt, setTempAiStudioVisionPrompt] = useState("What’s in this image? black and white");
    const [tempAiStudioVisionSaveCustomField, setTempAiStudioVisionSaveCustomField] = useState(false);
    const [tempAiStudioVisionCustomField, setTempAiStudioVisionCustomField] = useState("RespostaGPT");

    // ReactFlow Instance State
    const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);

    // ReactFlow hooks
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const selectedNode = nodes.find(n => n.id === selectedNodeId);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    // Helper to close all floating editors
    const closeAllEditors = useCallback(() => {
        setIsTextEditorOpen(false);
        setIsButtonEditorOpen(false);
        setIsImageEditorOpen(false);
        setIsMediaGalleryOpen(false);
        setIsAudioEditorOpen(false);
        setIsContactResponseEditorOpen(false);
        setIsMessageListEditorOpen(false);
        setIsCtaEditorOpen(false);
        setIsMessageTemplateEditorOpen(false);
        setIsAiStudioEditorOpen(false);
        setIsFieldSelectorOpen(false);
        setIsAiStudioFieldSelectorOpen(false);
        setIsAiStudioCounterFieldSelectorOpen(false);
        setIsAiStudioVisionFieldSelectorOpen(false);
        setIsChatGptEditorOpen(false);
        setIsDifyEditorOpen(false);
        setEditingBlockId(null);
        setEditingButtonId(null);
    }, []);

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

    const confirmDeleteEdge = () => {
        if (edgeIdToDelete) {
            setEdges((eds) => eds.filter((edge) => edge.id !== edgeIdToDelete));
            setEdgeIdToDelete(null);
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
                            <button className="h-9 px-4 text-sm font-medium text-blue-600 border border-blue-200 rounded-md bg-transparent hover:bg-blue-600 hover:text-white transition-all duration-200">Edit</button>
                            <button className="h-9 px-4 text-sm font-medium text-blue-600 border border-blue-200 rounded-md bg-transparent hover:bg-blue-600 hover:text-white transition-all duration-200">Clear Queue</button>
                        </>
                    )}

                    <button className="h-9 px-4 text-sm font-medium text-gray-600 border border-gray-200 rounded-md bg-transparent hover:bg-gray-700 hover:text-white transition-all duration-200" onClick={() => setLocation("/automations")}>Exit</button>
                    {flowStatus !== "active" && <button className="h-9 px-5 text-sm font-medium text-blue-600 border border-blue-500 rounded-md bg-transparent hover:bg-blue-600 hover:text-white transition-all duration-200">Publish</button>}
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
                                closeAllEditors();
                            }}
                            onEdgeClick={(event, edge) => {
                                setEdgeIdToDelete(edge.id);
                            }}
                            onNodeClick={(event, node) => {
                                setSelectedNodeId(node.id);
                                closeAllEditors();
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
                                <div className="h-14 px-4 flex items-center justify-between bg-blue-500 text-white shrink-0">
                                    <div className="flex items-center gap-2 font-bold text-xs tracking-wide text-white">
                                        <FaTextHeight className="h-3 w-3 text-white" />
                                        <span>EDIT TEXT</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex gap-1 mr-1">
                                            <button className="p-1 px-2 hover:bg-white/20 rounded border border-white/30 bg-white/10 text-white font-bold text-[10px] shadow-sm" title="Bold">B</button>
                                            <button className="p-1 px-2 hover:bg-white/20 rounded border border-white/30 bg-white/10 text-white italic font-bold text-[10px] shadow-sm" title="Italic">I</button>
                                        </div>
                                        <button onClick={() => setIsTextEditorOpen(false)} className="text-white/70 hover:text-white transition-colors p-1.5 hover:bg-white/10 rounded-full">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <div className="flex-1 p-4 bg-white overflow-y-auto min-h-0">
                                    <textarea
                                        value={tempTextValue}
                                        onChange={(e) => setTempTextValue(e.target.value)}
                                        className="w-full min-h-[150px] p-4 border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-400 focus:border-blue-400 outline-none resize-y text-sm text-gray-700 placeholder:text-gray-400 transition-all bg-white"
                                        placeholder="Enter your Message Here"
                                    />

                                    <div className="mt-6 pt-6 border-t border-gray-100">
                                        <div className="flex items-center justify-between mb-3">
                                            <label className="text-sm font-medium text-gray-700">Display "Typing..." message.</label>
                                            <Switch
                                                checked={tempTypingIndicator}
                                                onCheckedChange={setTempTypingIndicator}
                                            />
                                        </div>
                                        <div className="flex gap-3 p-4 bg-blue-50/50 rounded-lg border border-blue-100/50">
                                            <FaInfoCircle className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                                            <p className="text-[11px] text-blue-700 leading-relaxed">
                                                This will send a 'read' receipt and display a typing indicator, letting the WhatsApp user know you're preparing a response. The typing indicator will disappear once you reply or after 25 seconds, whichever comes first. It can only be sent once.
                                            </p>
                                        </div>
                                    </div>

                                </div>
                                <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center gap-2 shrink-0">
                                    <button onClick={() => {
                                        if (selectedNodeId && editingBlockId) {
                                            setNodes(nds => nds.map(n => n.id === selectedNodeId ? {
                                                ...n,
                                                data: {
                                                    ...n.data,
                                                    blocks: (n.data.blocks || []).map((b: any) => b.id === editingBlockId ? { ...b, text: tempTextValue, typingIndicator: tempTypingIndicator } : b)
                                                }
                                            } : n));
                                        }
                                        setIsTextEditorOpen(false);
                                        setEditingBlockId(null);
                                    }} className="flex-1 py-2 text-xs font-medium text-blue-600 border border-blue-400 rounded-md bg-transparent hover:bg-blue-600 hover:text-white transition-all duration-200">Save Changes</button>
                                    <button onClick={() => { setIsTextEditorOpen(false); setEditingBlockId(null); }} className="flex-1 py-2 text-xs font-medium text-gray-600 border border-gray-200 rounded-md bg-transparent hover:bg-gray-800 hover:text-white transition-all duration-200">Close</button>
                                </div>
                            </div>
                        )}

                        {isButtonEditorOpen && (

                            <div className="absolute top-0 bottom-0 right-[400px] w-[320px] bg-white border-l border-gray-200 shadow-[-8px_0_24px_rgba(0,0,0,0.05)] z-[60] flex flex-col animate-in slide-in-from-right-1 duration-300">
                                <div className="h-14 px-4 flex items-center justify-between bg-blue-500 text-white shrink-0">
                                    <div className="flex items-center gap-2 font-bold text-xs tracking-wide text-white">
                                        <FaBolt className="h-3 w-3 text-white" />
                                        <span>Button</span>
                                    </div>
                                    <button onClick={() => setIsButtonEditorOpen(false)} className="text-white/70 hover:text-white transition-colors p-1.5 hover:bg-white/10 rounded-full">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="flex-1 p-6 bg-white overflow-y-auto">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 mb-3 uppercase tracking-widest">Button Text</label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={tempButtonText}
                                                    onChange={(e) => setTempButtonText(e.target.value.slice(0, 20))}
                                                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-400 focus:border-blue-400 outline-none text-sm text-gray-700 transition-all bg-white"
                                                    placeholder="Button Name"
                                                />
                                                <div className="text-right mt-1.5">
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Remaining: {20 - tempButtonText.length}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 bg-gray-50 border-t border-gray-100 flex flex-col gap-2 shrink-0">
                                    <button
                                        onClick={() => {
                                            if (selectedNodeId && editingBlockId && editingButtonId) {
                                                setNodes(nds => nds.map(n => n.id === selectedNodeId ? {
                                                    ...n,
                                                    data: {
                                                        ...n.data,
                                                        blocks: (n.data.blocks || []).map((b: any) => b.id === editingBlockId ? {
                                                            ...b,
                                                            buttons: (b.buttons || []).map((btn: any) => btn.id === editingButtonId ? { ...btn, text: tempButtonText } : btn)
                                                        } : b)
                                                    }
                                                } : n));
                                            }
                                            setIsButtonEditorOpen(false);
                                            setEditingBlockId(null);
                                            setEditingButtonId(null);
                                        }}
                                        className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-bold shadow-md transition-all active:scale-[0.98]"
                                    >
                                        Save Changes
                                    </button>
                                    <button onClick={() => { setIsButtonEditorOpen(false); setEditingBlockId(null); setEditingButtonId(null); }} className="flex-1 py-2 text-xs font-medium text-gray-600 border border-gray-200 rounded-md bg-transparent hover:bg-gray-800 hover:text-white transition-all duration-200">Close</button>
                                </div>
                            </div>
                        )}

                        <div className="w-[400px] bg-white border-l border-gray-200 flex flex-col shadow-[-4px_0_12px_rgba(0,0,0,0.02)] relative z-[70]">
                            <div className="h-14 border-b px-4 flex items-center justify-between bg-blue-600 text-white shrink-0">
                                <div className="flex items-center gap-2">
                                    <div className="bg-white/20 p-1 rounded">
                                        {selectedNode.data.icon ? (() => { const Icon = selectedNode.data.icon; return <Icon className="h-4 w-4" style={{ color: selectedNode.data.color || 'white' }} />; })() : <FaRobot className="h-4 w-4 text-white" />}
                                    </div>
                                    <span className="font-bold text-lg tracking-wide">{selectedNode.data.label}</span>
                                </div>
                                <button onClick={() => { setSelectedNodeId(null); closeAllEditors(); }} className="text-white hover:bg-blue-700 p-1.5 rounded transition-colors border border-white/30"><FaTimes className="h-4 w-4" /></button>
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

                                                {/* WhatsApp Multi-Block Management */}
                                                {/* WhatsApp Multi-Block Management */}
                                                <div className="space-y-4">
                                                    {(selectedNode.data.blocks || []).map((block: any) => (
                                                        <div key={block.id} className="mb-6 last:mb-0">
                                                            {block.type === 'image' ? (
                                                                <div className="bg-white rounded-lg p-1 relative group/imageblock transition-all">
                                                                    <div className="flex justify-between items-start mb-2 px-2">
                                                                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Image</span>
                                                                        <button
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                closeAllEditors();
                                                                                setNodes(nds => nds.map(n => n.id === selectedNode.id ? {
                                                                                    ...n,
                                                                                    data: {
                                                                                        ...n.data,
                                                                                        blocks: (n.data.blocks || []).filter((b: any) => b.id !== block.id)
                                                                                    }
                                                                                } : n));
                                                                            }}
                                                                            className="text-gray-400 hover:text-red-500 transition-colors"
                                                                        >
                                                                            <FaTrashAlt className="w-3 h-3" />
                                                                        </button>
                                                                    </div>
                                                                    {block.url ? (
                                                                        <div
                                                                            onClick={() => {
                                                                                closeAllEditors();
                                                                                setEditingBlockId(block.id);
                                                                                setIsMediaGalleryOpen(true);
                                                                            }}
                                                                            className="relative w-full aspect-video rounded-lg overflow-hidden border border-gray-100 cursor-pointer hover:border-blue-400 transition-all group/imgpreview bg-gray-50 flex items-center justify-center"
                                                                        >
                                                                            <img src={block.url} alt="Uploaded" className="w-full h-full object-contain" />
                                                                            <div className="absolute inset-0 bg-black/0 group-hover/imgpreview:bg-black/20 flex items-center justify-center transition-all">
                                                                                <p className="text-white text-[10px] font-bold opacity-0 group-hover/imgpreview:opacity-100">Click to change</p>
                                                                            </div>
                                                                        </div>
                                                                    ) : (
                                                                        <div className="w-full p-4 border border-solid border-gray-300 rounded-lg bg-gray-50/50 flex flex-col items-center gap-3">
                                                                            <div className="p-3 bg-white rounded-full shadow-sm">
                                                                                <FaImage className="w-6 h-6 text-gray-400" />
                                                                            </div>
                                                                            <div className="text-center space-y-2">
                                                                                <p className="text-[11px] font-medium text-gray-500 leading-tight">
                                                                                    <button
                                                                                        onClick={() => {
                                                                                            closeAllEditors();
                                                                                            setEditingBlockId(block.id);
                                                                                            setTempImageUrl(block.url || "");
                                                                                            setIsImageEditorOpen(true);
                                                                                        }}
                                                                                        className="text-blue-600 hover:underline font-bold"
                                                                                    >Select from media gallery</button>
                                                                                    <span className="mx-1 text-gray-400">Or</span>
                                                                                    <button
                                                                                        onClick={() => {
                                                                                            closeAllEditors();
                                                                                            setEditingBlockId(block.id);
                                                                                            setTempImageUrl(block.url || "");
                                                                                            setIsImageEditorOpen(true);
                                                                                        }}
                                                                                        className="text-blue-600 hover:underline font-bold"
                                                                                    >Enter a URL</button>
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ) : block.type === 'audio' ? (
                                                                <div className="bg-white rounded-lg p-1 relative group/audioblock transition-all">
                                                                    <div className="flex justify-between items-start mb-2 px-2">
                                                                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Audio</span>
                                                                        <button
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                closeAllEditors();
                                                                                setNodes(nds => nds.map(n => n.id === selectedNode.id ? {
                                                                                    ...n,
                                                                                    data: {
                                                                                        ...n.data,
                                                                                        blocks: (n.data.blocks || []).filter((b: any) => b.id !== block.id)
                                                                                    }
                                                                                } : n));
                                                                            }}
                                                                            className="text-gray-400 hover:text-red-500 transition-colors"
                                                                        >
                                                                            <FaTrashAlt className="w-3 h-3" />
                                                                        </button>
                                                                    </div>
                                                                    <div
                                                                        onClick={() => {
                                                                            closeAllEditors();
                                                                            setEditingBlockId(block.id);
                                                                            setTempAudioSource(block.source || 'gallery');
                                                                            setTempAudioUrl(block.url || "");
                                                                            setTempCustomField(block.customField || "audio");
                                                                            setIsAudioEditorOpen(true);
                                                                        }}
                                                                        className="w-full p-4 border border-solid border-gray-300 rounded-lg bg-gray-50/50 flex flex-col items-center gap-3 cursor-pointer hover:border-blue-400 transition-all"
                                                                    >
                                                                        <div className="p-3 bg-white rounded-full shadow-sm">
                                                                            <FaMicrophone className="w-6 h-6 text-gray-400" />
                                                                        </div>
                                                                        <div className="text-center space-y-1">
                                                                            <p className="text-[11px] font-bold text-gray-600 leading-tight">Click to add an audio file</p>
                                                                            {block.url && <p className="text-[9px] text-blue-500 truncate max-w-[200px]">{block.url}</p>}
                                                                            {block.source === 'custom' && block.customField && <p className="text-[9px] text-purple-500 font-bold uppercase tracking-tighter">CF: {block.customField}</p>}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ) : block.type === 'video' ? (
                                                                <div className="bg-white rounded-lg p-1 relative group/videoblock transition-all">
                                                                    <div className="flex justify-between items-start mb-2 px-2">
                                                                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Video</span>
                                                                        <button
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                closeAllEditors();
                                                                                setNodes(nds => nds.map(n => n.id === selectedNode.id ? {
                                                                                    ...n,
                                                                                    data: {
                                                                                        ...n.data,
                                                                                        blocks: (n.data.blocks || []).filter((b: any) => b.id !== block.id)
                                                                                    }
                                                                                } : n));
                                                                            }}
                                                                            className="text-gray-400 hover:text-red-500 transition-colors"
                                                                        >
                                                                            <FaTrashAlt className="w-3 h-3" />
                                                                        </button>
                                                                    </div>
                                                                    <div
                                                                        onClick={() => {
                                                                            closeAllEditors();
                                                                            setEditingBlockId(block.id);
                                                                            setIsMediaGalleryOpen(true);
                                                                        }}
                                                                        className="w-full p-4 border border-solid border-gray-300 rounded-lg bg-gray-50/50 flex flex-col items-center gap-3 cursor-pointer hover:border-blue-400 transition-all"
                                                                    >
                                                                        {block.url ? (
                                                                            <div className="w-full aspect-video bg-black rounded overflow-hidden relative">
                                                                                <video src={block.url} className="w-full h-full object-cover opacity-50" />
                                                                                <div className="absolute inset-0 flex items-center justify-center">
                                                                                    <FaPlay className="w-8 h-8 text-white opacity-80" />
                                                                                </div>
                                                                            </div>
                                                                        ) : (
                                                                            <>
                                                                                <div className="p-3 bg-white rounded-full shadow-sm">
                                                                                    <FaVideo className="w-6 h-6 text-gray-400" />
                                                                                </div>
                                                                                <div className="text-center space-y-1">
                                                                                    <p className="text-[11px] font-bold text-gray-600 leading-tight">Click to add a video</p>
                                                                                    <p className="text-[9px] text-gray-400">Select from media gallery</p>
                                                                                </div>
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            ) : block.type === 'delay' ? (
                                                                <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm relative group/delayblock transition-all flex flex-col gap-3">
                                                                    <div className="flex justify-between items-center">
                                                                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">Delay</span>
                                                                        <button
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                closeAllEditors();
                                                                                setNodes(nds => nds.map(n => n.id === selectedNode.id ? {
                                                                                    ...n,
                                                                                    data: {
                                                                                        ...n.data,
                                                                                        blocks: (n.data.blocks || []).filter((b: any) => b.id !== block.id)
                                                                                    }
                                                                                } : n));
                                                                            }}
                                                                            className="text-gray-300 hover:text-red-500 transition-colors"
                                                                        >
                                                                            <FaTrashAlt className="w-3.5 h-3.5" />
                                                                        </button>
                                                                    </div>
                                                                    <div className="flex items-center gap-3 bg-gray-100/50 p-2.5 rounded-lg border border-gray-100">
                                                                        <span className="text-xs font-bold text-gray-500 min-w-[45px]">Delay</span>
                                                                        <div className="flex-1 flex items-center gap-2">
                                                                            <input
                                                                                type="number"
                                                                                value={block.value || 1}
                                                                                min="1"
                                                                                onChange={(e) => {
                                                                                    const val = parseInt(e.target.value) || 1;
                                                                                    setNodes(nds => nds.map(n => n.id === selectedNode.id ? {
                                                                                        ...n,
                                                                                        data: {
                                                                                            ...n.data,
                                                                                            blocks: (n.data.blocks || []).map((b: any) => b.id === block.id ? { ...b, value: val } : b)
                                                                                        }
                                                                                    } : n));
                                                                                }}
                                                                                className="w-full bg-white border border-gray-200 rounded p-1.5 text-xs font-bold text-center outline-none focus:ring-1 focus:ring-blue-400"
                                                                            />
                                                                            <span className="text-xs font-bold text-gray-400">seconds</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ) : block.type === 'contact_response' ? (
                                                                <div className="bg-white rounded-lg p-1 relative group/contactrespblock transition-all flex flex-col gap-2">
                                                                    <div className="flex justify-between items-start px-2">
                                                                        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600">Contact response</span>
                                                                        <button
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                closeAllEditors();
                                                                                setNodes(nds => nds.map(n => n.id === selectedNode.id ? {
                                                                                    ...n,
                                                                                    data: {
                                                                                        ...n.data,
                                                                                        blocks: (n.data.blocks || []).filter((b: any) => b.id !== block.id)
                                                                                    }
                                                                                } : n));
                                                                            }}
                                                                            className="text-gray-400 hover:text-red-500 transition-colors"
                                                                        >
                                                                            <FaTrashAlt className="w-3 h-3" />
                                                                        </button>
                                                                    </div>
                                                                    <button
                                                                        onClick={() => {
                                                                            closeAllEditors();
                                                                            setEditingBlockId(block.id);
                                                                            setTempContactResponseData({
                                                                                message: block.message || "",
                                                                                accumulator: block.accumulator || false,
                                                                                customField: block.customField || "",
                                                                                incorrectMessage: block.incorrectMessage || "",
                                                                                retryAttempts: block.retryAttempts || 0,
                                                                                waitDuration: block.waitDuration || 1,
                                                                                waitUnit: block.waitUnit || 'Seconds'
                                                                            });
                                                                            setIsContactResponseEditorOpen(true);
                                                                        }}
                                                                        className={`w-full p-2.5 rounded-lg transition-all ${isContactResponseEditorOpen && editingBlockId === block.id ? 'border-2 border-dashed border-blue-400 bg-blue-50/30' : 'border border-solid border-gray-200 bg-white shadow-sm hover:border-blue-400'} ${block.message ? 'text-left' : 'text-center'}`}
                                                                    >
                                                                        {block.message ? (
                                                                            <p className="text-xs text-gray-700 line-clamp-2">{block.message}</p>
                                                                        ) : (
                                                                            <p className="text-xs text-gray-400 font-medium">← Add text</p>
                                                                        )}
                                                                    </button>
                                                                </div>
                                                            ) : block.type === 'message_list' ? (
                                                                <div className="bg-white rounded-lg p-1 relative group/msglistblock transition-all flex flex-col gap-2">
                                                                    <div className="flex justify-between items-start px-2">
                                                                        <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-600">Message List</span>
                                                                        <button
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                closeAllEditors();
                                                                                setNodes(nds => nds.map(n => n.id === selectedNode.id ? {
                                                                                    ...n,
                                                                                    data: {
                                                                                        ...n.data,
                                                                                        blocks: (n.data.blocks || []).filter((b: any) => b.id !== block.id)
                                                                                    }
                                                                                } : n));
                                                                            }}
                                                                            className="text-gray-400 hover:text-red-500 transition-colors"
                                                                        >
                                                                            <FaTrashAlt className="w-3 h-3" />
                                                                        </button>
                                                                    </div>
                                                                    <button
                                                                        onClick={() => {
                                                                            closeAllEditors();
                                                                            setEditingBlockId(block.id);
                                                                            setTempMessageListData({
                                                                                title: block.title || "",
                                                                                body: block.body || "",
                                                                                footer: block.footer || "",
                                                                                buttonText: block.buttonText || "",
                                                                                sections: block.sections || []
                                                                            });
                                                                            setIsMessageListEditorOpen(true);
                                                                        }}
                                                                        className={`w-full p-3 rounded-lg transition-all ${isMessageListEditorOpen && editingBlockId === block.id ? 'border-2 border-dashed border-blue-400 bg-blue-50/30' : 'border border-solid border-gray-200 bg-white shadow-sm hover:border-blue-400'} flex items-center justify-center`}
                                                                    >
                                                                        {block.title ? (
                                                                            <p className="text-xs text-gray-700 font-bold">{block.title}</p>
                                                                        ) : (
                                                                            <FaListUl className="w-4 h-4 text-gray-400" />
                                                                        )}
                                                                    </button>
                                                                </div>
                                                            ) : block.type === 'message_template' ? (
                                                                <div className="bg-white rounded-lg p-1 relative transition-all flex flex-col gap-2">
                                                                    <div className="flex justify-between items-start px-2">
                                                                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">Send a template</span>
                                                                        <button
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                closeAllEditors();
                                                                                setNodes(nds => nds.map(n => n.id === selectedNode.id ? {
                                                                                    ...n,
                                                                                    data: {
                                                                                        ...n.data,
                                                                                        blocks: (n.data.blocks || []).filter((b: any) => b.id !== block.id)
                                                                                    }
                                                                                } : n));
                                                                            }}
                                                                            className="text-gray-400 hover:text-red-500 transition-colors"
                                                                        >
                                                                            <FaTrashAlt className="w-3 h-3" />
                                                                        </button>
                                                                    </div>
                                                                    <button
                                                                        onClick={() => {
                                                                            closeAllEditors();
                                                                            setEditingBlockId(block.id);
                                                                            setTempMessageTemplate(block.template || "order_processed_v5");
                                                                            setIsMessageTemplateEditorOpen(true);
                                                                        }}
                                                                        className={`w-full p-3 rounded-lg transition-all ${isMessageTemplateEditorOpen && editingBlockId === block.id ? 'border-2 border-dashed border-blue-400 bg-blue-50/30' : 'border border-solid border-gray-200 bg-white shadow-sm hover:border-blue-400'} flex flex-col items-center justify-center text-center`}
                                                                    >
                                                                        <div className="p-2 rounded-full bg-blue-50 text-blue-600 mb-1">
                                                                            <FaFileSignature className="w-4 h-4" />
                                                                        </div>
                                                                        <span className="text-[11px] font-bold text-gray-700">{block.template || "Select a template"}</span>
                                                                    </button>
                                                                </div>
                                                            ) : block.type === 'cta' ? (
                                                                <div className="bg-white rounded-lg p-1 relative transition-all flex flex-col gap-2">
                                                                    <div className="flex justify-between items-start px-2">
                                                                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">CTA Button</span>
                                                                        <button
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                closeAllEditors();
                                                                                setNodes(nds => nds.map(n => n.id === selectedNode.id ? {
                                                                                    ...n,
                                                                                    data: {
                                                                                        ...n.data,
                                                                                        blocks: (n.data.blocks || []).filter((b: any) => b.id !== block.id)
                                                                                    }
                                                                                } : n));
                                                                            }}
                                                                            className="text-gray-400 hover:text-red-500 transition-colors"
                                                                        >
                                                                            <FaTrashAlt className="w-3 h-3" />
                                                                        </button>
                                                                    </div>
                                                                    <button
                                                                        onClick={() => {
                                                                            closeAllEditors();
                                                                            setEditingBlockId(block.id);
                                                                            setTempCtaHeader(block.header || "");
                                                                            setTempCtaBody(block.body || "");
                                                                            setTempCtaFooter(block.footer || "");
                                                                            setTempCtaButtonText(block.buttonText || "");
                                                                            setTempCtaUrl(block.url || "");
                                                                            setIsCtaEditorOpen(true);
                                                                        }}
                                                                        className={`w-full p-3 rounded-lg transition-all ${isCtaEditorOpen && editingBlockId === block.id ? 'border-2 border-dashed border-blue-400 bg-blue-50/30' : 'border border-dashed border-gray-300 bg-white hover:border-blue-400'} flex items-center justify-center`}
                                                                    >
                                                                        <div className="flex flex-col text-center gap-1.5 opacity-60 pointer-events-none w-full">
                                                                            {block.header && <span className="text-[10px] font-semibold">{block.header}</span>}
                                                                            <span className="text-xs">{block.body || "Enter the body of this message"}</span>
                                                                            {block.footer && <span className="text-[10px] text-gray-500">{block.footer}</span>}
                                                                            <div className="border border-gray-200 mt-1 py-1 px-4 text-blue-500 text-xs rounded-md shadow-sm w-full mx-auto font-medium">
                                                                                {block.buttonText || "Enter button text"}
                                                                            </div>
                                                                        </div>
                                                                    </button>
                                                                </div>
                                                            ) : block.type === 'ai_studio_question' ? (
                                                                <div className="bg-white rounded-lg p-1 relative transition-all flex flex-col gap-2">
                                                                    <div className="flex justify-between items-start px-2">
                                                                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">AI Studio Question</span>
                                                                        <button
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                closeAllEditors();
                                                                                setNodes(nds => nds.map(n => n.id === selectedNode.id ? {
                                                                                    ...n,
                                                                                    data: {
                                                                                        ...n.data,
                                                                                        blocks: (n.data.blocks || []).filter((b: any) => b.id !== block.id)
                                                                                    }
                                                                                } : n));
                                                                            }}
                                                                            className="text-gray-400 hover:text-red-500 transition-colors"
                                                                        >
                                                                            <FaTrashAlt className="w-3 h-3" />
                                                                        </button>
                                                                    </div>
                                                                    <button
                                                                        onClick={() => {
                                                                            closeAllEditors();
                                                                            setEditingBlockId(block.id);
                                                                            setTempAiStudioMode(block.mode || 'ChatGPT');
                                                                            setTempAiStudioAssistant(block.assistant || 'TestsEdilson 2 Gemini');
                                                                            setTempAiStudioQuestion(block.question || '');
                                                                            setTempAiStudioAccumulator(block.accumulator || false);
                                                                            setTempAiStudioAccumulatorTime(block.accumulatorTime || 5);
                                                                            setTempAiStudioSmartLoop(block.smartLoop || false);
                                                                            setTempAiStudioSmartLoopTime(block.smartLoopTime || 1);
                                                                            setTempAiStudioSmartLoopUnit(block.smartLoopUnit || 'Minutes');
                                                                            setTempAiStudioWaitTime(block.waitTime || 1);
                                                                            setTempAiStudioSendAnswer(block.sendAnswer || false);
                                                                            setTempAiStudioSaveCustomField(block.saveCustomField || false);
                                                                            setTempAiStudioSaveCustomFieldValue(block.saveCustomFieldValue || '');
                                                                            setTempAiStudioWaitReplies(block.waitReplies || false);
                                                                            setTempAiStudioWaitRepliesSaveLiveChat(block.waitRepliesSaveLiveChat || false);
                                                                            setTempAiStudioWaitRepliesMessages(block.waitRepliesMessages || []);
                                                                            setTempAiStudioCounter(block.counter || false);
                                                                            setTempAiStudioCounterCustomField(block.counterCustomField || '');
                                                                            setTempAiStudioVisionEnabled(block.visionEnabled || false);
                                                                            setTempAiStudioVisionModel(block.visionModel || 'gpt-4o-mini');
                                                                            setTempAiStudioVisionPrompt(block.visionPrompt || 'What’s in this image? black and white');
                                                                            setTempAiStudioVisionSaveCustomField(block.visionSaveCustomField || false);
                                                                            setTempAiStudioVisionCustomField(block.visionCustomField || 'RespostaGPT');
                                                                            setIsAiStudioEditorOpen(true);
                                                                        }}
                                                                        className={`w-full p-4 rounded-lg transition-all ${isAiStudioEditorOpen && editingBlockId === block.id ? 'border-2 border-dashed border-blue-400 bg-blue-50/30' : 'border-2 border-dashed border-gray-300 bg-gray-50/50 hover:border-blue-400'} flex items-center justify-center cursor-pointer`}
                                                                    >
                                                                        <span className="text-xs font-semibold text-gray-500">← Add Question</span>
                                                                    </button>
                                                                </div>
                                                            ) : block.type === 'dify_question' ? (
                                                                <div className="bg-white rounded-lg p-1 relative transition-all flex flex-col gap-2">
                                                                    <div className="flex justify-between items-start px-2">
                                                                        <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600">Dify.ai Question</span>
                                                                        <button
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                closeAllEditors();
                                                                                setNodes(nds => nds.map(n => n.id === selectedNode.id ? {
                                                                                    ...n,
                                                                                    data: {
                                                                                        ...n.data,
                                                                                        blocks: (n.data.blocks || []).filter((b: any) => b.id !== block.id)
                                                                                    }
                                                                                } : n));
                                                                            }}
                                                                            className="text-gray-400 hover:text-red-500 transition-colors"
                                                                        >
                                                                            <FaTrashAlt className="w-3 h-3" />
                                                                        </button>
                                                                    </div>
                                                                    <button
                                                                        onClick={() => {
                                                                            closeAllEditors();
                                                                            setEditingBlockId(block.id);
                                                                            setTempDifyAssistant(block.assistant || 'New_bot');
                                                                            setTempAiStudioQuestion(block.question || '');
                                                                            setTempAiStudioAccumulator(block.accumulator || false);
                                                                            setTempAiStudioAccumulatorTime(block.accumulatorTime || 5);
                                                                            setTempAiStudioSmartLoop(block.smartLoop || false);
                                                                            setTempAiStudioSmartLoopTime(block.smartLoopTime || 1);
                                                                            setTempAiStudioSmartLoopUnit(block.smartLoopUnit || 'Minutes');
                                                                            setTempAiStudioWaitTime(block.waitTime || 1);
                                                                            setTempAiStudioSendAnswer(block.sendAnswer || false);
                                                                            setTempAiStudioSaveCustomField(block.saveCustomField || false);
                                                                            setTempAiStudioSaveCustomFieldValue(block.saveCustomFieldValue || '');
                                                                            setTempAiStudioWaitReplies(block.waitReplies || false);
                                                                            setTempAiStudioWaitRepliesSaveLiveChat(block.waitRepliesSaveLiveChat || false);
                                                                            setTempAiStudioWaitRepliesMessages(block.waitRepliesMessages || []);
                                                                            setTempAiStudioCounter(block.counter || false);
                                                                            setTempAiStudioCounterCustomField(block.counterCustomField || '');
                                                                            setTempAiStudioVisionEnabled(block.visionEnabled || false);
                                                                            setTempAiStudioVisionModel(block.visionModel || 'gpt-4o-mini');
                                                                            setTempAiStudioVisionPrompt(block.visionPrompt || 'What’s in this image? black and white');
                                                                            setTempAiStudioVisionSaveCustomField(block.visionSaveCustomField || false);
                                                                            setTempAiStudioVisionCustomField(block.visionCustomField || 'RespostaGPT');
                                                                            setIsDifyEditorOpen(true);
                                                                        }}
                                                                        className={`w-full p-4 rounded-lg transition-all ${isDifyEditorOpen && editingBlockId === block.id ? 'border-2 border-dashed border-blue-400 bg-blue-50/30' : 'border-2 border-dashed border-gray-300 bg-gray-50/50 hover:border-blue-400'} flex items-center justify-center cursor-pointer`}
                                                                    >
                                                                        <span className="text-xs font-semibold text-gray-500">← Add Question</span>
                                                                    </button>
                                                                </div>
                                                            ) : block.type === 'chatgpt' ? (
                                                                <div className="bg-white rounded-lg p-1 relative transition-all flex flex-col gap-2">
                                                                    <div className="flex justify-between items-start px-2">
                                                                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">ChatGPT Answer</span>
                                                                        <button
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                closeAllEditors();
                                                                                setNodes(nds => nds.map(n => n.id === selectedNode.id ? {
                                                                                    ...n,
                                                                                    data: {
                                                                                        ...n.data,
                                                                                        blocks: (n.data.blocks || []).filter((b: any) => b.id !== block.id)
                                                                                    }
                                                                                } : n));
                                                                            }}
                                                                            className="text-gray-400 hover:text-red-500 transition-colors"
                                                                        >
                                                                            <FaTrashAlt className="w-3 h-3" />
                                                                        </button>
                                                                    </div>
                                                                    <button
                                                                        onClick={() => {
                                                                            closeAllEditors();
                                                                            setEditingBlockId(block.id);
                                                                            setTempChatGptText(block.text || '');
                                                                            setIsChatGptEditorOpen(true);
                                                                        }}
                                                                        className={`w-full p-4 rounded-lg transition-all ${isChatGptEditorOpen && editingBlockId === block.id ? 'border-2 border-dashed border-blue-400 bg-blue-50/30' : 'border-2 border-dashed border-gray-300 bg-gray-50/50 hover:border-blue-400'} flex items-center justify-center cursor-pointer`}
                                                                    >
                                                                        <span className="text-xs font-semibold text-gray-500">← Add Text</span>
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <div className="bg-white rounded-lg p-1 relative group/textblock transition-all flex flex-col gap-2">
                                                                    <div className="flex justify-between items-start px-2">
                                                                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Text</span>
                                                                        <button
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                closeAllEditors();
                                                                                if (editingBlockId === block.id) {
                                                                                    setIsTextEditorOpen(false);
                                                                                    setIsButtonEditorOpen(false);
                                                                                    setEditingBlockId(null);
                                                                                    setEditingButtonId(null);
                                                                                }
                                                                                setNodes(nds => nds.map(n => n.id === selectedNode.id ? {
                                                                                    ...n,
                                                                                    data: {
                                                                                        ...n.data,
                                                                                        blocks: (n.data.blocks || []).filter((b: any) => b.id !== block.id)
                                                                                    }
                                                                                } : n));
                                                                            }}
                                                                            className="text-gray-400 hover:text-red-500 transition-colors"
                                                                        >
                                                                            <FaTrashAlt className="w-3 h-3" />
                                                                        </button>
                                                                    </div>
                                                                    <button
                                                                        onClick={() => {
                                                                            closeAllEditors();
                                                                            setEditingBlockId(block.id);
                                                                            setTempTextValue(block.text || "");
                                                                            setTempTypingIndicator(block.typingIndicator || false);
                                                                            setIsTextEditorOpen(true);
                                                                        }}
                                                                        className={`w-full p-2.5 rounded-lg transition-all ${isTextEditorOpen && editingBlockId === block.id ? 'border-2 border-dashed border-blue-400 bg-blue-50/30' : 'border border-solid border-gray-200 bg-white shadow-sm hover:border-blue-400'} ${block.text ? 'text-left' : 'text-center'}`}
                                                                    >
                                                                        {block.text ? (
                                                                            <p className="text-xs text-gray-700 line-clamp-2">{block.text}</p>
                                                                        ) : (
                                                                            <p className="text-xs text-gray-400 font-medium">← Add text</p>
                                                                        )}
                                                                    </button>

                                                                    {block.buttons && block.buttons.length > 0 && (
                                                                        <div className="flex flex-wrap items-center gap-2 mt-1">
                                                                            {block.buttons.map((btn: any) => (
                                                                                <div key={btn.id} className="bg-white border border-gray-200 rounded-full pl-3 pr-2 py-1.5 shadow-sm hover:border-blue-400 transition-all flex items-center gap-2">
                                                                                    <button
                                                                                        onClick={() => {
                                                                                            setEditingBlockId(block.id);
                                                                                            setEditingButtonId(btn.id);
                                                                                            setTempButtonText(btn.text);
                                                                                            setIsButtonEditorOpen(true);
                                                                                        }}
                                                                                        className="text-xs font-bold text-gray-700 hover:text-blue-600 truncate max-w-[80px]"
                                                                                    >
                                                                                        {btn.text || "Untitled"}
                                                                                    </button>
                                                                                    <button
                                                                                        onClick={(e) => {
                                                                                            e.stopPropagation();
                                                                                            closeAllEditors();
                                                                                            if (editingButtonId === btn.id) {
                                                                                                setIsButtonEditorOpen(false);
                                                                                                setEditingBlockId(null);
                                                                                                setEditingButtonId(null);
                                                                                            }
                                                                                            setNodes(nds => nds.map(n => n.id === selectedNode.id ? {
                                                                                                ...n,
                                                                                                data: {
                                                                                                    ...n.data,
                                                                                                    blocks: (n.data.blocks || []).map((b: any) => b.id === block.id ? {
                                                                                                        ...b,
                                                                                                        buttons: (b.buttons || []).filter((bt: any) => bt.id !== btn.id)
                                                                                                    } : b)
                                                                                                }
                                                                                            } : n));
                                                                                        }}
                                                                                        className="text-gray-300 hover:text-red-500 p-0.5"
                                                                                    >
                                                                                        <FaTrashAlt className="w-2.5 h-2.5" />
                                                                                    </button>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    )}

                                                                    {(block.buttons?.length || 0) < 3 && (
                                                                        <div className="mt-1 flex">
                                                                            <button
                                                                                onClick={() => {
                                                                                    const newButtonId = Date.now().toString();
                                                                                    setNodes(nds => nds.map(n => n.id === selectedNode.id ? {
                                                                                        ...n,
                                                                                        data: {
                                                                                            ...n.data,
                                                                                            blocks: (n.data.blocks || []).map((b: any) => b.id === block.id ? {
                                                                                                ...b,
                                                                                                buttons: [...(b.buttons || []), { id: newButtonId, text: "" }]
                                                                                            } : b)
                                                                                        }
                                                                                    } : n));
                                                                                    closeAllEditors();
                                                                                    setEditingBlockId(block.id);
                                                                                    setEditingButtonId(newButtonId);
                                                                                    setTempButtonText("");
                                                                                    setIsButtonEditorOpen(true);
                                                                                }}
                                                                                className="inline-flex items-center gap-1.5 p-1.5 px-3 text-blue-600 border border-blue-200 rounded-md bg-transparent hover:bg-blue-600 hover:text-white transition-all duration-200 font-medium text-xs"
                                                                            >
                                                                                <FaPlus className="w-2.5 h-2.5" />
                                                                                <span>Add Button</span>
                                                                            </button>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="h-[1px] bg-gray-200 w-full" />

                                                <div className="flex gap-4 relative">
                                                    <div className="flex-1 space-y-2">
                                                        {[
                                                            { label: 'T Text', icon: FaTextHeight, color: '#0084FF' },
                                                            { label: 'Audio', icon: FaMicrophone, color: '#25D366' },
                                                            { label: 'Docmunt', icon: FaFileAlt, color: '#FF3366' },
                                                            { label: 'Contact response', icon: FaUserEdit, color: '#6554C0' },
                                                            { label: 'Message Templates', icon: FaFileSignature, color: '#008CFF' },
                                                            { label: '? AI Studio Question', icon: FaQuestionCircle, color: '#6366F1' },
                                                            { label: '? ChatGPT Question', icon: FaBrain, color: '#10A37F' },
                                                        ].map((btn, idx) => (
                                                            <button
                                                                key={idx}
                                                                onClick={() => {
                                                                    if (btn.label === 'T Text') {
                                                                        closeAllEditors();
                                                                        const newBlockId = `text-${Date.now()}`;
                                                                        const newBlock = {
                                                                            id: newBlockId,
                                                                            type: 'text' as const,
                                                                            text: "",
                                                                            buttons: [],
                                                                            typingIndicator: false
                                                                        };
                                                                        setNodes(nds => nds.map(n => n.id === selectedNode.id ? {
                                                                            ...n,
                                                                            data: {
                                                                                ...n.data,
                                                                                blocks: [...(n.data.blocks || []), newBlock]
                                                                            }
                                                                        } : n));
                                                                        setEditingBlockId(newBlockId);
                                                                        setTempTextValue("");
                                                                        setTempTypingIndicator(false);
                                                                        setIsTextEditorOpen(true);
                                                                    } else if (btn.label === 'Audio') {
                                                                        closeAllEditors();
                                                                        const newBlockId = `audio-${Date.now()}`;
                                                                        const newBlock = {
                                                                            id: newBlockId,
                                                                            type: 'audio' as const,
                                                                            source: 'gallery' as const,
                                                                            url: "",
                                                                            customField: "audio"
                                                                        };
                                                                        setNodes(nds => nds.map(n => n.id === selectedNode.id ? {
                                                                            ...n,
                                                                            data: {
                                                                                ...n.data,
                                                                                blocks: [...(n.data.blocks || []), newBlock]
                                                                            }
                                                                        } : n));
                                                                        setEditingBlockId(newBlockId);
                                                                        setTempAudioSource('gallery');
                                                                        setTempAudioUrl("");
                                                                        setTempCustomField("audio");
                                                                        setIsAudioEditorOpen(true);
                                                                    } else if (btn.label === 'Contact response') {
                                                                        closeAllEditors();
                                                                        const newBlockId = `contact-resp-${Date.now()}`;
                                                                        const newBlock = {
                                                                            id: newBlockId,
                                                                            type: 'contact_response' as const,
                                                                            message: "",
                                                                            accumulator: false,
                                                                            customField: "",
                                                                            incorrectMessage: "",
                                                                            retryAttempts: 0,
                                                                            waitDuration: 1,
                                                                            waitUnit: 'Seconds' as const
                                                                        };
                                                                        setNodes(nds => nds.map(n => n.id === selectedNode.id ? {
                                                                            ...n,
                                                                            data: {
                                                                                ...n.data,
                                                                                blocks: [...(n.data.blocks || []), newBlock]
                                                                            }
                                                                        } : n));
                                                                        setEditingBlockId(newBlockId);
                                                                        setTempContactResponseData({
                                                                            message: "",
                                                                            accumulator: false,
                                                                            customField: "",
                                                                            incorrectMessage: "",
                                                                            retryAttempts: 0,
                                                                            waitDuration: 1,
                                                                            waitUnit: 'Seconds'
                                                                        });
                                                                        setIsContactResponseEditorOpen(true);
                                                                    } else if (btn.label === 'Message Template' || btn.label === 'Message Templates') {
                                                                        closeAllEditors();
                                                                        const newBlockId = `msg-tpl-${Date.now()}`;
                                                                        const newBlock = {
                                                                            id: newBlockId,
                                                                            type: 'message_template' as const,
                                                                            template: "order_processed_v5"
                                                                        };
                                                                        setNodes(nds => nds.map(n => n.id === selectedNode.id ? {
                                                                            ...n,
                                                                            data: {
                                                                                ...n.data,
                                                                                blocks: [...(n.data.blocks || []), newBlock]
                                                                            }
                                                                        } : n));
                                                                        setEditingBlockId(newBlockId);
                                                                        setTempMessageTemplate("order_processed_v5");
                                                                        setIsMessageTemplateEditorOpen(true);
                                                                    } else if (btn.label === '? AI Studio Question') {
                                                                        closeAllEditors();
                                                                        const newBlockId = `aistudio-${Date.now()}`;
                                                                        const newBlock = {
                                                                            id: newBlockId,
                                                                            type: 'ai_studio_question' as const,
                                                                            mode: 'ChatGPT',
                                                                            assistant: 'TestsEdilson 2 Gemini',
                                                                            question: '',
                                                                            accumulator: false,
                                                                            smartLoop: false,
                                                                            waitTime: 1,
                                                                            sendAnswer: false,
                                                                            saveCustomField: false,
                                                                            waitReplies: false,
                                                                            counter: false,
                                                                            visionEnabled: false,
                                                                            visionModel: 'gpt-4o-mini',
                                                                            visionPrompt: 'What’s in this image? black and white',
                                                                            visionSaveCustomField: false,
                                                                            visionCustomField: 'RespostaGPT'
                                                                        };
                                                                        setNodes(nds => nds.map(n => n.id === selectedNode.id ? {
                                                                            ...n,
                                                                            data: {
                                                                                ...n.data,
                                                                                blocks: [...(n.data.blocks || []), newBlock]
                                                                            }
                                                                        } : n));
                                                                        setEditingBlockId(newBlockId);
                                                                        setTempAiStudioMode('ChatGPT');
                                                                        setTempAiStudioAssistant('TestsEdilson 2 Gemini');
                                                                        setTempAiStudioQuestion('');
                                                                        setTempAiStudioAccumulator(false);
                                                                        setTempAiStudioAccumulatorTime(5);
                                                                        setTempAiStudioSmartLoop(false);
                                                                        setTempAiStudioSmartLoopTime(1);
                                                                        setTempAiStudioSmartLoopUnit('Minutes');
                                                                        setTempAiStudioWaitTime(1);
                                                                        setTempAiStudioSendAnswer(false);
                                                                        setTempAiStudioSaveCustomField(false);
                                                                        setTempAiStudioSaveCustomFieldValue('');
                                                                        setTempAiStudioWaitReplies(false);
                                                                        setTempAiStudioWaitRepliesSaveLiveChat(false);
                                                                        setTempAiStudioWaitRepliesMessages([]);
                                                                        setTempAiStudioCounter(false);
                                                                        setTempAiStudioCounterCustomField('');
                                                                        setTempAiStudioVisionEnabled(false);
                                                                        setTempAiStudioVisionModel('gpt-4o-mini');
                                                                        setTempAiStudioVisionPrompt('What’s in this image? black and white');
                                                                        setTempAiStudioVisionSaveCustomField(false);
                                                                        setTempAiStudioVisionCustomField('RespostaGPT');
                                                                        setIsAiStudioEditorOpen(true);
                                                                    } else if (btn.label === 'Docmunt') {
                                                                        closeAllEditors();
                                                                        setIsAddingVideoBlock(true);
                                                                        setIsMediaGalleryOpen(true);
                                                                    } else if (btn.label === 'Image') {
                                                                        closeAllEditors();
                                                                        const newBlockId = `block-${Date.now()}`;
                                                                        setNodes(nds => nds.map(n => n.id === selectedNode.id ? {
                                                                            ...n,
                                                                            data: {
                                                                                ...n.data,
                                                                                blocks: [...(n.data.blocks || []), { id: newBlockId, type: 'image', url: '' }]
                                                                            }
                                                                        } : n));
                                                                    }
                                                                }}
                                                                className="w-full flex items-center gap-2.5 p-3 bg-white border border-gray-100 rounded-md hover:border-blue-400 hover:bg-blue-50 transition-all text-left group active:scale-[0.97] shadow-sm"
                                                            >
                                                                <div className="shrink-0 p-1 rounded bg-gray-50 group-hover:bg-white transition-colors">
                                                                    {(() => { const Icon = btn.icon; return <Icon className="h-4 w-4" style={{ color: btn.color }} />; })()}
                                                                </div>
                                                                <span className={`${(btn.label.includes('Question') || btn.label.includes('Answer')) ? 'text-[12px]' : 'text-[10px]'} font-bold text-gray-600 leading-tight group-hover:text-blue-700 transition-colors uppercase tracking-tight`}>{btn.label}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                    <div className="flex-1 space-y-2">
                                                        {[
                                                            { label: 'Image', icon: FaImage, color: '#E1306C' },
                                                            { label: 'Video', icon: FaVideo, color: '#FF0000' },
                                                            { label: 'Delay', icon: FaClock, color: '#FFAB00' },
                                                            { label: 'Message list', icon: FaListUl, color: '#00B8D9' },
                                                            { label: 'CTA Button', icon: FaMousePointer, color: '#2563eb' },
                                                            { label: 'Dify.ai Question', icon: FaCogs, color: '#0EA5E9' },
                                                            { label: 'ChatGPT Answer', icon: FaBrain, color: '#F59E0B' },
                                                        ].map((btn, idx) => (
                                                            <button
                                                                key={idx}
                                                                onClick={() => {
                                                                    closeAllEditors();
                                                                    if (btn.label === 'Image') {
                                                                        const newBlockId = `block-${Date.now()}`;
                                                                        setNodes(nds => nds.map(n => n.id === selectedNode.id ? {
                                                                            ...n,
                                                                            data: {
                                                                                ...n.data,
                                                                                blocks: [...(n.data.blocks || []), { id: newBlockId, type: 'image', url: '' }]
                                                                            }
                                                                        } : n));
                                                                    } else if (btn.label === 'Video') {
                                                                        closeAllEditors();
                                                                        setIsAddingVideoBlock(true);
                                                                        setIsMediaGalleryOpen(true);
                                                                    } else if (btn.label === 'Message list' || btn.label === 'Message List') {
                                                                        closeAllEditors();
                                                                        const newBlockId = `msg-list-${Date.now()}`;
                                                                        const newBlock = {
                                                                            id: newBlockId,
                                                                            type: 'message_list',
                                                                            title: "",
                                                                            body: "",
                                                                            footer: "",
                                                                            buttonText: "",
                                                                            sections: []
                                                                        };
                                                                        setNodes(nds => nds.map(n => n.id === selectedNode.id ? {
                                                                            ...n,
                                                                            data: {
                                                                                ...n.data,
                                                                                blocks: [...(n.data.blocks || []), newBlock]
                                                                            }
                                                                        } : n));
                                                                        setEditingBlockId(newBlockId);
                                                                        setTempMessageListData({
                                                                            title: "",
                                                                            body: "",
                                                                            footer: "",
                                                                            buttonText: "",
                                                                            sections: []
                                                                        });
                                                                        setIsMessageListEditorOpen(true);
                                                                    } else if (btn.label === 'Delay') {
                                                                        const newBlockId = `delay-${Date.now()}`;
                                                                        setNodes(nds => nds.map(n => n.id === selectedNode.id ? {
                                                                            ...n,
                                                                            data: {
                                                                                ...n.data,
                                                                                blocks: [...(n.data.blocks || []), { id: newBlockId, type: 'delay', value: 1 }]
                                                                            }
                                                                        } : n));
                                                                    } else if (btn.label === 'CTA Button') {
                                                                        const newBlockId = `cta-${Date.now()}`;
                                                                        const newBlock = {
                                                                            id: newBlockId,
                                                                            type: 'cta' as const,
                                                                            header: "",
                                                                            body: "",
                                                                            footer: "",
                                                                            buttonText: "",
                                                                            url: ""
                                                                        };
                                                                        setNodes(nds => nds.map(n => n.id === selectedNode.id ? {
                                                                            ...n,
                                                                            data: {
                                                                                ...n.data,
                                                                                blocks: [...(n.data.blocks || []), newBlock]
                                                                            }
                                                                        } : n));
                                                                        setEditingBlockId(newBlockId);
                                                                        setTempCtaHeader("");
                                                                        setTempCtaBody("");
                                                                        setTempCtaFooter("");
                                                                        setTempCtaButtonText("");
                                                                        setTempCtaUrl("");
                                                                        setIsCtaEditorOpen(true);
                                                                    } else if (btn.label === 'ChatGPT Answer') {
                                                                        const newBlockId = `chatgpt-${Date.now()}`;
                                                                        const newBlock = {
                                                                            id: newBlockId,
                                                                            type: 'chatgpt' as const,
                                                                            text: ""
                                                                        };
                                                                        setNodes(nds => nds.map(n => n.id === selectedNode.id ? {
                                                                            ...n,
                                                                            data: {
                                                                                ...n.data,
                                                                                blocks: [...(n.data.blocks || []), newBlock]
                                                                            }
                                                                        } : n));
                                                                        setEditingBlockId(newBlockId);
                                                                        setTempChatGptText("");
                                                                        setIsChatGptEditorOpen(true);
                                                                    } else if (btn.label === '? ChatGPT Question') {
                                                                        const newBlockId = `chatgpt-q-${Date.now()}`;
                                                                        const newBlock = {
                                                                            id: newBlockId,
                                                                            type: 'ai_studio_question' as const,
                                                                            mode: 'ChatGPT' as const,
                                                                            assistant: 'TestsEdilson 2 Gemini',
                                                                            question: '',
                                                                            accumulator: false,
                                                                            smartLoop: false,
                                                                            waitTime: 1,
                                                                            sendAnswer: false,
                                                                            saveCustomField: false,
                                                                            waitReplies: false,
                                                                            counter: false,
                                                                            visionEnabled: false,
                                                                            visionModel: 'gpt-4o-mini',
                                                                            visionPrompt: 'What’s in this image? black and white',
                                                                            visionSaveCustomField: false,
                                                                            visionCustomField: 'RespostaGPT'
                                                                        };
                                                                        setNodes(nds => nds.map(n => n.id === selectedNode.id ? {
                                                                            ...n,
                                                                            data: {
                                                                                ...n.data,
                                                                                blocks: [...(n.data.blocks || []), newBlock]
                                                                            }
                                                                        } : n));
                                                                        setEditingBlockId(newBlockId);
                                                                        setTempAiStudioMode('ChatGPT');
                                                                        setTempAiStudioAssistant('TestsEdilson 2 Gemini');
                                                                        setTempAiStudioQuestion('');
                                                                        setTempAiStudioAccumulator(false);
                                                                        setTempAiStudioAccumulatorTime(5);
                                                                        setTempAiStudioSmartLoop(false);
                                                                        setTempAiStudioSmartLoopTime(1);
                                                                        setTempAiStudioSmartLoopUnit('Minutes');
                                                                        setTempAiStudioWaitTime(1);
                                                                        setTempAiStudioSendAnswer(false);
                                                                        setTempAiStudioSaveCustomField(false);
                                                                        setTempAiStudioSaveCustomFieldValue('');
                                                                        setTempAiStudioWaitReplies(false);
                                                                        setTempAiStudioWaitRepliesSaveLiveChat(false);
                                                                        setTempAiStudioWaitRepliesMessages([]);
                                                                        setTempAiStudioCounter(false);
                                                                        setTempAiStudioCounterCustomField('');
                                                                        setTempAiStudioVisionEnabled(false);
                                                                        setTempAiStudioVisionModel('gpt-4o-mini');
                                                                        setTempAiStudioVisionPrompt('What’s in this image? black and white');
                                                                        setTempAiStudioVisionSaveCustomField(false);
                                                                        setTempAiStudioVisionCustomField('RespostaGPT');
                                                                        setIsAiStudioEditorOpen(true);
                                                                    }
                                                                    else if (btn.label === 'Dify.ai Question') {
                                                                        const newBlockId = `dify-${Date.now()}`;
                                                                        const newBlock = {
                                                                            id: newBlockId,
                                                                            type: 'dify_question' as const,
                                                                            assistant: 'New_bot',
                                                                            question: '',
                                                                            accumulator: false,
                                                                            accumulatorTime: 5,
                                                                            smartLoop: false,
                                                                            smartLoopTime: 1,
                                                                            smartLoopUnit: 'Minutes',
                                                                            waitTime: 1,
                                                                            sendAnswer: false,
                                                                            saveCustomField: false,
                                                                            saveCustomFieldValue: '',
                                                                            waitReplies: false,
                                                                            waitRepliesSaveLiveChat: false,
                                                                            waitRepliesMessages: [],
                                                                        };
                                                                        setNodes(nds => nds.map(n => n.id === selectedNode.id ? {
                                                                            ...n,
                                                                            data: {
                                                                                ...n.data,
                                                                                blocks: [...(n.data.blocks || []), newBlock]
                                                                            }
                                                                        } : n));
                                                                        setEditingBlockId(newBlockId);
                                                                        setTempDifyAssistant('New_bot');
                                                                        setTempAiStudioQuestion('');
                                                                        setTempAiStudioAccumulator(false);
                                                                        setTempAiStudioAccumulatorTime(5);
                                                                        setTempAiStudioSmartLoop(false);
                                                                        setTempAiStudioSmartLoopTime(1);
                                                                        setTempAiStudioSmartLoopUnit('Minutes');
                                                                        setTempAiStudioWaitTime(1);
                                                                        setTempAiStudioSendAnswer(false);
                                                                        setTempAiStudioSaveCustomField(false);
                                                                        setTempAiStudioSaveCustomFieldValue('');
                                                                        setTempAiStudioWaitReplies(false);
                                                                        setTempAiStudioWaitRepliesSaveLiveChat(false);
                                                                        setTempAiStudioWaitRepliesMessages([]);
                                                                        setIsDifyEditorOpen(true);
                                                                    }
                                                                }}
                                                                className="w-full flex items-center gap-2.5 p-3 bg-white border border-gray-100 rounded-md hover:border-blue-400 hover:bg-blue-50 transition-all text-left group active:scale-[0.97] shadow-sm"
                                                            >
                                                                <div className="shrink-0 p-1 rounded bg-gray-50 group-hover:bg-white transition-colors">
                                                                    {(() => { const Icon = btn.icon; return <Icon className="h-4 w-4" style={{ color: btn.color }} />; })()}
                                                                </div>
                                                                <span className="text-[10.5px] font-bold text-gray-600 leading-tight group-hover:text-blue-700 transition-colors uppercase tracking-tight">{btn.label}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {selectedNode.data.label !== 'Twilio Call' && selectedNode.data.label !== 'SMS from Twilio' && selectedNode.data.label !== 'Whatsapp' && (
                                <div className="text-center text-gray-500 py-10 border-2 border-dashed rounded-lg">
                                    <p>Configuration for <strong>{selectedNode.data.label}</strong></p>
                                    <span className="text-xs">Coming soon</span>
                                </div>
                            )}
                        </div>

                        {
                            isImageEditorOpen && (
                                <div className="absolute top-0 bottom-0 right-[400px] w-[320px] bg-white border-l border-gray-200 shadow-[-8px_0_24px_rgba(0,0,0,0.05)] z-[60] flex flex-col animate-in slide-in-from-right-1 duration-300">
                                    <div className="h-14 px-4 flex items-center justify-between bg-blue-500 text-white shrink-0">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 rounded bg-blue-500/30">
                                                <FaImage className="w-3.5 h-3.5 text-white" />
                                            </div>
                                            <h3 className="font-bold text-white text-xs tracking-tight uppercase">Image URL</h3>
                                        </div>
                                        <button onClick={() => setIsImageEditorOpen(false)} className="text-white/70 hover:text-white transition-colors p-1.5 hover:bg-white/10 rounded-full">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="flex-1 overflow-y-auto p-5 space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Insert Image URL</label>
                                            <textarea
                                                value={tempImageUrl}
                                                onChange={(e) => setTempImageUrl(e.target.value)}
                                                placeholder="http://www.example.com/yourimage.jpg"
                                                className="w-full min-h-[100px] p-3 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all resize-y text-gray-700 placeholder:text-gray-300"
                                            />
                                        </div>
                                    </div>

                                    <div className="p-4 border-t border-gray-50 bg-gray-50/50 flex items-center gap-3 shrink-0">
                                        <button
                                            onClick={() => {
                                                if (selectedNodeId && editingBlockId) {
                                                    setNodes(nds => nds.map(n => n.id === selectedNodeId ? {
                                                        ...n,
                                                        data: {
                                                            ...n.data,
                                                            blocks: (n.data.blocks || []).map((b: any) => b.id === editingBlockId ? { ...b, url: tempImageUrl } : b)
                                                        }
                                                    } : n));
                                                }
                                                setIsImageEditorOpen(false);
                                                setEditingBlockId(null);
                                            }}
                                            className="flex-1 py-2 text-xs font-medium text-blue-600 border border-blue-400 rounded-md bg-transparent hover:bg-blue-600 hover:text-white transition-all duration-200"
                                        >
                                            Save Changes
                                        </button>
                                        <button onClick={() => { setIsImageEditorOpen(false); setEditingBlockId(null); }} className="flex-1 py-2 text-xs font-medium text-gray-600 border border-gray-200 rounded-md bg-transparent hover:bg-gray-800 hover:text-white transition-all duration-200">Close</button>
                                    </div>
                                </div>
                            )
                        }

                        {
                            isAudioEditorOpen && (
                                <div className="absolute top-0 bottom-0 right-[400px] w-[320px] bg-white border-l border-gray-200 shadow-[-8px_0_24px_rgba(0,0,0,0.05)] z-[60] flex flex-col animate-in slide-in-from-right-1 duration-300">
                                    <div className="h-14 px-4 flex items-center justify-between bg-blue-500 text-white shrink-0">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 rounded bg-blue-500/30">
                                                <FaMicrophone className="w-3.5 h-3.5 text-white" />
                                            </div>
                                            <h3 className="font-bold text-white text-xs tracking-tight uppercase">Audio</h3>
                                        </div>
                                        <button onClick={() => setIsAudioEditorOpen(false)} className="text-white/70 hover:text-white transition-colors p-1.5 hover:bg-white/10 rounded-full">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="flex-1 overflow-y-auto p-5 space-y-6">
                                        <div className="space-y-3">
                                            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Select audio source</label>
                                            <div className="flex bg-gray-100 p-1 rounded-lg">
                                                <button
                                                    onClick={() => setTempAudioSource('gallery')}
                                                    className={`flex-1 py-1.5 text-[10px] font-bold rounded-md transition-all ${tempAudioSource === 'gallery' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                                                >
                                                    Media Gallery
                                                </button>
                                                <button
                                                    onClick={() => setTempAudioSource('custom')}
                                                    className={`flex-1 py-1.5 text-[10px] font-bold rounded-md transition-all ${tempAudioSource === 'custom' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                                                >
                                                    Custom field
                                                </button>
                                            </div>
                                        </div>

                                        <div className="p-4 bg-orange-50 rounded-lg border border-orange-100 flex gap-3">
                                            <FaInfoCircle className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                                            <p className="text-[10px] text-orange-700 leading-relaxed font-medium">
                                                <span className="font-bold">IMPORTANT:</span> For the best compatibility across all mobile devices, we recommend using .mp3 files. Other audio formats may not play correctly on some phones.
                                            </p>
                                        </div>

                                        {tempAudioSource === 'gallery' ? (
                                            <div className="space-y-2">
                                                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Audio File</label>
                                                <button
                                                    onClick={() => setIsMediaGalleryOpen(true)}
                                                    className="w-full p-6 border-2 border-dashed border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all flex flex-col items-center gap-2 group"
                                                >
                                                    <div className="p-3 bg-gray-50 rounded-full group-hover:bg-white shadow-sm transition-colors">
                                                        <FaPlus className="w-4 h-4 text-gray-400 group-hover:text-blue-500" />
                                                    </div>
                                                    <span className="text-[11px] font-bold text-gray-500 group-hover:text-blue-600 transition-colors uppercase tracking-tight">Click to add an audio file</span>
                                                    {tempAudioUrl && <span className="text-[9px] text-blue-500 truncate max-w-full font-medium px-4">{tempAudioUrl}</span>}
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Select custom field</label>
                                                <div className="relative">
                                                    <select
                                                        value={tempCustomField}
                                                        onChange={(e) => setTempCustomField(e.target.value)}
                                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer"
                                                    >
                                                        <option value="audio">audio</option>
                                                        <option value="last_voice_msg">last_voice_msg</option>
                                                        <option value="recording_url">recording_url</option>
                                                    </select>
                                                    <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-2.5 h-2.5 text-gray-400 pointer-events-none" />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-4 border-t border-gray-100 bg-white flex items-center gap-3 shrink-0">
                                        <button
                                            onClick={() => {
                                                if (selectedNodeId && editingBlockId) {
                                                    setNodes(nds => nds.map(n => n.id === selectedNodeId ? {
                                                        ...n,
                                                        data: {
                                                            ...n.data,
                                                            blocks: (n.data.blocks || []).map((b: any) => b.id === editingBlockId ? {
                                                                ...b,
                                                                source: tempAudioSource,
                                                                url: tempAudioUrl,
                                                                customField: tempCustomField
                                                            } : b)
                                                        }
                                                    } : n));
                                                }
                                                setIsAudioEditorOpen(false);
                                                setEditingBlockId(null);
                                            }}
                                            className="flex-1 py-2 text-xs font-medium text-blue-600 border border-blue-400 rounded-md bg-transparent hover:bg-blue-600 hover:text-white transition-all duration-200"
                                        >
                                            Save Changes
                                        </button>
                                        <button
                                            onClick={() => setIsAudioEditorOpen(false)}
                                            className="flex-1 py-2 text-xs font-medium text-gray-600 border border-gray-200 rounded-md bg-transparent hover:bg-gray-800 hover:text-white transition-all duration-200"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div >
                            )
                        }

                        {/* Contact Response Editor Panel */}
                        {
                            isContactResponseEditorOpen && (
                                <div className="absolute top-0 bottom-0 right-[400px] w-[320px] bg-white border-l border-gray-200 shadow-[-8px_0_24px_rgba(0,0,0,0.05)] z-[60] flex flex-col animate-in slide-in-from-right-1 duration-300 pointer-events-auto">
                                    <div className="h-14 px-4 flex items-center justify-between bg-blue-500 text-white shrink-0">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 rounded bg-blue-500/30">
                                                <FaUserEdit className="w-3.5 h-3.5 text-white" />
                                            </div>
                                            <h3 className="font-bold text-white text-xs tracking-tight uppercase">Contact response</h3>
                                        </div>
                                        <button onClick={() => setIsContactResponseEditorOpen(false)} className="text-white/70 hover:text-white transition-colors p-1.5 hover:bg-white/10 rounded-full">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="flex-1 overflow-y-auto p-5 space-y-6">
                                        {/* Message Section */}
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Enter Message (Optional)</label>
                                            <textarea
                                                value={tempContactResponseData.message}
                                                onChange={(e) => setTempContactResponseData(prev => ({ ...prev, message: e.target.value }))}
                                                placeholder="Enter your message here"
                                                className="w-full min-h-[100px] p-3 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all resize-y text-gray-700 placeholder:text-gray-300"
                                            />
                                        </div>

                                        {/* Accumulator Section */}
                                        <div className="flex items-center justify-between py-2 border-y border-gray-50">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Accumulator</span>
                                                <TooltipProvider delayDuration={300}>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <span><FaInfoCircle className="w-3 h-3 text-gray-400 cursor-help" /></span>
                                                        </TooltipTrigger>
                                                        <TooltipContent side="top" className="max-w-[200px] text-[10px] leading-tight font-medium p-2 bg-gray-800 text-white border-none rounded-md shadow-xl">
                                                            This option allows the system to process multiple questions received simultaneously during the waiting period.
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </div>
                                            <Switch
                                                checked={tempContactResponseData.accumulator}
                                                onCheckedChange={(checked) => setTempContactResponseData(prev => ({ ...prev, accumulator: checked }))}
                                                className="scale-90"
                                            />
                                        </div>

                                        {/* Custom Field Selection */}
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Save input to a custom field</label>
                                            <div className="relative flex items-center gap-2">
                                                <div
                                                    onClick={() => setIsFieldSelectorOpen(!isFieldSelectorOpen)}
                                                    className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 cursor-pointer flex items-center justify-between hover:border-blue-300 transition-colors"
                                                >
                                                    <span className={tempContactResponseData.customField ? "text-gray-700" : "text-gray-400"}>
                                                        {tempContactResponseData.customField || "Select field"}
                                                    </span>
                                                    <FaChevronDown className="w-2.5 h-2.5 text-gray-400" />
                                                </div>
                                                <button
                                                    onClick={() => setIsFieldSelectorOpen(!isFieldSelectorOpen)}
                                                    className="p-3 bg-white border border-gray-200 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors shadow-sm active:scale-95"
                                                >
                                                    <FaPlus className="w-3 h-3" />
                                                </button>

                                                {/* Field Picker Sub-menu */}
                                                {isFieldSelectorOpen && (
                                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl z-[70] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                                        <div className="p-3 border-b border-gray-100">
                                                            <div className="relative">
                                                                <input
                                                                    type="text"
                                                                    placeholder="Search..."
                                                                    value={fieldSearchQuery}
                                                                    onChange={(e) => setFieldSearchQuery(e.target.value)}
                                                                    className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs outline-none focus:ring-1 focus:ring-blue-500/20"
                                                                />
                                                                <FaSearchPlus className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
                                                            </div>
                                                        </div>
                                                        <div className="flex border-b border-gray-100 bg-gray-50/50">
                                                            {(['System fields', 'Custom fields', 'Channels'] as const).map(tab => (
                                                                <button
                                                                    key={tab}
                                                                    onClick={() => setFieldSelectorTab(tab)}
                                                                    className={`flex-1 py-2 text-[9px] font-bold uppercase tracking-tight transition-all border-b-2 ${fieldSelectorTab === tab ? 'border-blue-500 text-blue-600 bg-white' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                                                                >
                                                                    {tab}
                                                                </button>
                                                            ))}
                                                        </div>
                                                        <div className="max-h-[250px] overflow-y-auto p-2">
                                                            {fieldSelectorTab === 'System fields' && (
                                                                <div className="space-y-1">
                                                                    {[
                                                                        'Contact ID', 'First Name', 'Last Name', 'Title',
                                                                        'Phone Number (Primary)', 'Whatsapp Number (Primary)',
                                                                        'Email Address (Primary)', 'Source', 'Instagram',
                                                                        'Subscribed', 'Avatar'
                                                                    ].filter(f => f.toLowerCase().includes(fieldSearchQuery.toLowerCase())).map(field => (
                                                                        <button
                                                                            key={field}
                                                                            onClick={() => {
                                                                                setTempContactResponseData(prev => ({ ...prev, customField: field }));
                                                                                setIsFieldSelectorOpen(false);
                                                                            }}
                                                                            className="w-full text-left px-3 py-2 text-[11px] font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-700 rounded-md transition-all flex items-center justify-between group"
                                                                        >
                                                                            {field}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            )}
                                                            {fieldSelectorTab === 'Custom fields' && (
                                                                <div className="space-y-1">
                                                                    {[
                                                                        'RespostaGPT', 'Payload', 'Ultimo Imovel', 'RespostaVision', 'Date Time',
                                                                        'booking_date_time', 'user_confirm', 'user_email', 'booking id',
                                                                        'booking_resechedule', 'resechedule_user_confirm', 'eventTypeID',
                                                                        'Roger Booking Name', 'Roger Booking Email', 'Roger Book Date Time',
                                                                        'Roger Doctor Name', 'Text area 2', 'Json', 'Resposta LLMW',
                                                                        'current_date_time', 'resposta_vision', 'perganta_gpt', 'buscabaserow',
                                                                        'endAtual', 'campotexto', 'Multiselect', 'Nometst', 'emailtst',
                                                                        'cidadetst', 'number_ia', 'campo_lista', 'tel', 'total_invetimento',
                                                                        'nota_dinamica', 'date_oportunidade', 'confianca_oportunidade',
                                                                        'valor_oportunidade', 'idMember', 'min max length', 'resposta_cal',
                                                                        'audio', 'whisperer_resposta', 'event_id', 'CustomFieldJSON',
                                                                        'test_edilson_apagar', 'lower case test', 'testing lower case paragraph',
                                                                        'number field test', 'haider1', 'testing haider field', 'fixo_test_apagar',
                                                                        'broadcasting', 'json_test_tiago', 'phone number'
                                                                    ].filter(f => f.toLowerCase().includes(fieldSearchQuery.toLowerCase())).map(field => (
                                                                        <button
                                                                            key={field}
                                                                            onClick={() => {
                                                                                setTempContactResponseData(prev => ({ ...prev, customField: field }));
                                                                                setIsFieldSelectorOpen(false);
                                                                            }}
                                                                            className="w-full text-left px-3 py-2 text-[11px] font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-700 rounded-md transition-all flex items-center justify-between group"
                                                                        >
                                                                            {field}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            )}
                                                            {fieldSelectorTab === 'Channels' && (
                                                                <div className="space-y-1">
                                                                    {[
                                                                        { name: 'whatsapp', icon: FaWhatsapp, color: '#25D366' },
                                                                        { name: 'instagram', icon: FaInstagram, color: '#E1306C' },
                                                                        { name: 'telegram', icon: FaTelegram, color: '#24A1DE' }
                                                                    ].filter(c => c.name.toLowerCase().includes(fieldSearchQuery.toLowerCase())).map(channel => {
                                                                        const Icon = channel.icon;
                                                                        return (
                                                                            <button
                                                                                key={channel.name}
                                                                                onClick={() => {
                                                                                    setTempContactResponseData(prev => ({ ...prev, customField: channel.name }));
                                                                                    setIsFieldSelectorOpen(false);
                                                                                }}
                                                                                className="w-full text-left px-3 py-2 text-[11px] font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-700 rounded-md transition-all flex items-center gap-2 group"
                                                                            >
                                                                                <Icon className="w-3 h-3" style={{ color: channel.color }} />
                                                                                <span className="flex-1">{channel.name}</span>
                                                                            </button>
                                                                        );
                                                                    })}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Retry Strategy & Timeout (Only visible if field selected) */}
                                        {tempContactResponseData.customField && (
                                            <>
                                                <div className="space-y-4 pt-4 border-t border-gray-50">
                                                    <div className="space-y-2">
                                                        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider leading-tight block">Send this message if the input is incorrect</label>
                                                        <textarea
                                                            value={tempContactResponseData.incorrectMessage}
                                                            onChange={(e) => setTempContactResponseData(prev => ({ ...prev, incorrectMessage: e.target.value }))}
                                                            placeholder="Enter your message here"
                                                            className="w-full min-h-[80px] p-3 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition-all resize-y text-gray-700 placeholder:text-gray-300"
                                                        />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Number of retry attempts for invalid contact replies</label>
                                                        <div className="relative group/attempts">
                                                            <select
                                                                value={tempContactResponseData.retryAttempts}
                                                                onChange={(e) => setTempContactResponseData(prev => ({ ...prev, retryAttempts: parseInt(e.target.value) }))}
                                                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer transition-all hover:border-gray-300"
                                                            >
                                                                <option value={0}>0 Attempts</option>
                                                                <option value={1}>1 Times</option>
                                                                <option value={2}>2 Times</option>
                                                                <option value={3}>3 Times</option>
                                                                <option value={4}>4 Times</option>
                                                                <option value={5}>5 Times</option>
                                                            </select>
                                                            <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-2.5 h-2.5 text-gray-400 pointer-events-none group-hover/attempts:text-gray-600 transition-colors" />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="space-y-2 pt-4 border-t border-gray-50">
                                                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Wait for the contact to respond until</label>
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex-1 relative group/duration">
                                                            <input
                                                                type="number"
                                                                min="1"
                                                                value={tempContactResponseData.waitDuration}
                                                                onChange={(e) => setTempContactResponseData(prev => ({ ...prev, waitDuration: parseInt(e.target.value) || 1 }))}
                                                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all pr-12"
                                                            />
                                                            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-0.5 pointer-events-none">
                                                                <FaChevronDown className="w-2 h-2 text-gray-400 rotate-180" />
                                                                <FaChevronDown className="w-2 h-2 text-gray-400" />
                                                            </div>
                                                        </div>
                                                        <div className="flex-1 relative group/unit">
                                                            <select
                                                                value={tempContactResponseData.waitUnit}
                                                                onChange={(e) => setTempContactResponseData(prev => ({ ...prev, waitUnit: e.target.value as any }))}
                                                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer"
                                                            >
                                                                <option value="Seconds">Seconds</option>
                                                                <option value="Minutes">Minutes</option>
                                                                <option value="Hours">Hours</option>
                                                            </select>
                                                            <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-2.5 h-2.5 text-gray-400 pointer-events-none group-hover/unit:text-gray-600 transition-colors" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    <div className="p-4 border-t border-gray-100 bg-white flex items-center gap-3 shrink-0">
                                        <button
                                            onClick={() => {
                                                if (selectedNodeId && editingBlockId) {
                                                    setNodes(nds => nds.map(n => n.id === selectedNodeId ? {
                                                        ...n,
                                                        data: {
                                                            ...n.data,
                                                            blocks: (n.data.blocks || []).map((b: any) => b.id === editingBlockId ? {
                                                                ...b,
                                                                ...tempContactResponseData
                                                            } : b)
                                                        }
                                                    } : n));
                                                }
                                                setIsContactResponseEditorOpen(false);
                                                setEditingBlockId(null);
                                            }}
                                            className="flex-1 py-2 text-xs font-medium text-blue-600 border border-blue-400 rounded-md bg-transparent hover:bg-blue-600 hover:text-white transition-all duration-200"
                                        >
                                            Save Changes
                                        </button>
                                        <button
                                            onClick={() => setIsContactResponseEditorOpen(false)}
                                            className="flex-1 py-2 text-xs font-medium text-gray-600 border border-gray-200 rounded-md bg-transparent hover:bg-gray-800 hover:text-white transition-all duration-200"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            )}

                        {/* CTA Editor Panel */}
                        {
                            isCtaEditorOpen && (
                                <div className="absolute top-0 bottom-0 right-[400px] w-[320px] bg-white border-l border-gray-200 shadow-[-8px_0_24px_rgba(0,0,0,0.05)] z-[60] flex flex-col animate-in slide-in-from-right-1 duration-300 pointer-events-auto">
                                    <div className="h-14 px-4 flex items-center justify-between bg-blue-600 text-white shrink-0">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 rounded bg-white/20">
                                                <FaMousePointer className="w-3.5 h-3.5 text-white" />
                                            </div>
                                            <h3 className="font-bold text-white text-xs tracking-tight uppercase">CTA Button</h3>
                                        </div>
                                        <button onClick={() => setIsCtaEditorOpen(false)} className="text-white/70 hover:text-white transition-colors p-1.5 hover:bg-white/10 rounded-full">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="flex-1 overflow-y-auto p-5 space-y-6">
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2 block">Header</label>
                                                <input
                                                    type="text"
                                                    value={tempCtaHeader}
                                                    onChange={(e) => setTempCtaHeader(e.target.value)}
                                                    className="w-full p-2.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500/30 text-gray-700"
                                                />
                                            </div>

                                            <div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Body</label>
                                                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-black text-white uppercase tracking-wider">Required</span>
                                                </div>
                                                <textarea
                                                    value={tempCtaBody}
                                                    onChange={(e) => setTempCtaBody(e.target.value)}
                                                    placeholder="Enter your message here"
                                                    className="w-full min-h-[80px] p-2.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500/30 text-gray-700 resize-none"
                                                />
                                            </div>

                                            <div>
                                                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2 block">Footer</label>
                                                <input
                                                    type="text"
                                                    value={tempCtaFooter}
                                                    onChange={(e) => setTempCtaFooter(e.target.value)}
                                                    className="w-full p-2.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500/30 text-gray-700"
                                                />
                                            </div>

                                            <div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Button text</label>
                                                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-black text-white uppercase tracking-wider">Required</span>
                                                </div>
                                                <input
                                                    type="text"
                                                    value={tempCtaButtonText}
                                                    onChange={(e) => setTempCtaButtonText(e.target.value)}
                                                    className="w-full p-2.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500/30 text-gray-700"
                                                />
                                            </div>

                                            <div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Enter action URL</label>
                                                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-black text-white uppercase tracking-wider">Required</span>
                                                </div>
                                                <input
                                                    type="text"
                                                    value={tempCtaUrl}
                                                    onChange={(e) => setTempCtaUrl(e.target.value)}
                                                    placeholder="http://www.example.com"
                                                    className="w-full p-2.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500/30 text-gray-700"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 border-t border-gray-100 bg-white flex items-center gap-3 shrink-0">
                                        <button
                                            onClick={() => {
                                                if (!editingBlockId) return;
                                                setNodes(nds => nds.map(n => n.id === selectedNode.id ? {
                                                    ...n,
                                                    data: {
                                                        ...n.data,
                                                        blocks: (n.data.blocks || []).map((b: any) => b.id === editingBlockId ? {
                                                            ...b,
                                                            header: tempCtaHeader,
                                                            body: tempCtaBody,
                                                            footer: tempCtaFooter,
                                                            buttonText: tempCtaButtonText,
                                                            url: tempCtaUrl
                                                        } : b)
                                                    }
                                                } : n));
                                                setIsCtaEditorOpen(false);
                                                setEditingBlockId(null);
                                            }}
                                            className="flex-1 py-2 text-xs font-medium text-blue-600 border border-blue-400 rounded-md bg-transparent hover:bg-blue-600 hover:text-white transition-all duration-200"
                                        >
                                            Save Changes
                                        </button>
                                        <button
                                            onClick={() => setIsCtaEditorOpen(false)}
                                            className="flex-1 py-2 text-xs font-medium text-gray-600 border border-gray-200 rounded-md bg-transparent hover:bg-gray-800 hover:text-white transition-all duration-200"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            )}

                        {/* Message Template Editor Panel */}
                        {
                            isMessageTemplateEditorOpen && (
                                <div className="absolute top-0 bottom-0 right-[400px] w-[320px] bg-white border-l border-gray-200 shadow-[-8px_0_24px_rgba(0,0,0,0.05)] z-[60] flex flex-col animate-in slide-in-from-right-1 duration-300 pointer-events-auto">
                                    <div className="h-14 px-4 flex items-center justify-between bg-blue-600 text-white shrink-0">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 rounded bg-white/20">
                                                <FaFileSignature className="w-3.5 h-3.5 text-white" />
                                            </div>
                                            <h3 className="font-bold text-white text-xs tracking-tight uppercase">Send a template</h3>
                                        </div>
                                        <button onClick={() => setIsMessageTemplateEditorOpen(false)} className="text-white/70 hover:text-white transition-colors p-1.5 hover:bg-white/10 rounded-full">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="flex-1 overflow-y-auto p-5 space-y-6">
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2 block">Choose a template</label>
                                                <div className="relative group/template">
                                                    <select
                                                        value={tempMessageTemplate}
                                                        onChange={(e) => setTempMessageTemplate(e.target.value)}
                                                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 focus:outline-none focus:ring-1 focus:ring-green-500 appearance-none cursor-pointer transition-all hover:border-gray-300"
                                                    >
                                                        <option value="order_processed_v5">order_processed_v5</option>
                                                        <option value="offer_existing_customer">offer_existing_customer</option>
                                                        <option value="offer">offer</option>
                                                        <option value="order_update_status">order_update_status</option>
                                                        <option value="broadcast_marketing">broadcast_marketing</option>
                                                    </select>
                                                    <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-2.5 h-2.5 text-gray-400 pointer-events-none group-hover/template:text-gray-600 transition-colors" />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2 block">Template Message</label>
                                                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                                                    {tempMessageTemplate === "order_processed_v5" && "Dear Customer, Your order has processed and it will delivered to your address in next 3 days. Thanks for your order."}
                                                    {tempMessageTemplate === "offer_existing_customer" && "Dear Existing Customer, There is Flat 50% off on our existing customer. Visit Our OutLet and get the chance to grab the deal. Thankyou"}
                                                    {tempMessageTemplate === "offer" && "Hello Customer. There is an offer on EZnet store, 50% off on all shopping till next week. Thankyou"}
                                                    {tempMessageTemplate === "order_update_status" && "Dear customer, You order has been dispatched and you will be contacted soon. Thankyou for your order."}
                                                    {tempMessageTemplate === "broadcast_marketing" && "Dear Customer, There is an offer for up to 50 percent dscount if you visit the store. Thankyou"}

                                                    {tempMessageTemplate === "broadcast_marketing" && (
                                                        <div className="mt-4 pt-4 border-t border-gray-200 flex flex-col gap-2">
                                                            <div className="w-full text-center py-2 px-3 border border-gray-300 text-blue-600 font-medium text-xs rounded shadow-sm bg-white cursor-pointer hover:bg-gray-50">
                                                                visit us ?
                                                            </div>
                                                            <div className="w-full text-center py-2 px-3 border border-gray-300 text-blue-600 font-medium text-xs rounded shadow-sm bg-white cursor-pointer hover:bg-gray-50">
                                                                Don’t visit us?
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center gap-3 shrink-0">
                                        <button
                                            onClick={() => {
                                                if (selectedNodeId && editingBlockId) {
                                                    setNodes(nds => nds.map(n => n.id === selectedNodeId ? {
                                                        ...n,
                                                        data: {
                                                            ...n.data,
                                                            blocks: (n.data.blocks || []).map((b: any) => b.id === editingBlockId ? {
                                                                ...b,
                                                                template: tempMessageTemplate
                                                            } : b)
                                                        }
                                                    } : n));
                                                }
                                                setIsMessageTemplateEditorOpen(false);
                                                setEditingBlockId(null);
                                            }}
                                            className="flex-1 py-2 text-xs font-medium text-blue-600 border border-blue-400 rounded-md bg-transparent hover:bg-blue-600 hover:text-white transition-all duration-200"
                                        >
                                            Save Changes
                                        </button>
                                        <button
                                            onClick={() => setIsMessageTemplateEditorOpen(false)}
                                            className="flex-1 py-2 text-xs font-medium text-gray-600 border border-gray-200 rounded-md bg-transparent hover:bg-gray-800 hover:text-white transition-all duration-200"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            )}

                        {/* Message List Editor Panel */}
                        {
                            isMessageListEditorOpen && (
                                <div className="absolute top-0 bottom-0 right-[400px] w-[320px] bg-white border-l border-gray-200 shadow-[-8px_0_24px_rgba(0,0,0,0.05)] z-[60] flex flex-col animate-in slide-in-from-right-1 duration-300 pointer-events-auto">
                                    <div className="h-14 px-4 flex items-center justify-between bg-blue-600 text-white shrink-0">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 rounded bg-white/20">
                                                <FaListUl className="w-3.5 h-3.5 text-white" />
                                            </div>
                                            <h3 className="font-bold text-white text-xs tracking-tight uppercase">Message List</h3>
                                        </div>
                                        <button onClick={() => setIsMessageListEditorOpen(false)} className="text-white/70 hover:text-white transition-colors p-1.5 hover:bg-white/10 rounded-full">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="flex-1 overflow-y-auto p-5 space-y-6">
                                        {/* Header Props */}
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2 block">Menu Title (Optional)</label>
                                                <input
                                                    type="text"
                                                    value={tempMessageListData.title}
                                                    onChange={(e) => setTempMessageListData(prev => ({ ...prev, title: e.target.value }))}
                                                    placeholder="Example: Menu"
                                                    className="w-full p-2.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500/30 text-gray-700"
                                                />
                                            </div>

                                            <div>
                                                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2 block">Body Text</label>
                                                <textarea
                                                    value={tempMessageListData.body}
                                                    onChange={(e) => setTempMessageListData(prev => ({ ...prev, body: e.target.value }))}
                                                    placeholder="Enter message body"
                                                    className="w-full min-h-[80px] p-2.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500/30 text-gray-700 resize-none"
                                                />
                                            </div>

                                            <div>
                                                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2 block">Footer Text (Optional)</label>
                                                <input
                                                    type="text"
                                                    value={tempMessageListData.footer}
                                                    onChange={(e) => setTempMessageListData(prev => ({ ...prev, footer: e.target.value }))}
                                                    placeholder="Example: Select an option"
                                                    className="w-full p-2.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500/30 text-gray-700"
                                                />
                                            </div>

                                            <div>
                                                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2 block">Button Text</label>
                                                <input
                                                    type="text"
                                                    value={tempMessageListData.buttonText}
                                                    onChange={(e) => setTempMessageListData(prev => ({ ...prev, buttonText: e.target.value.slice(0, 20) }))}
                                                    placeholder="Example: Open Menu"
                                                    className="w-full p-2.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500/30 text-gray-700"
                                                />
                                                <div className="text-[9px] text-right text-gray-400 mt-1 uppercase font-bold tracking-tighter">Remaining: {20 - tempMessageListData.buttonText.length}</div>
                                            </div>
                                        </div>

                                        {/* Sections Manager */}
                                        <div className="pt-6 border-t border-gray-100 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Sections ({tempMessageListData.sections.length}/10)</label>
                                                {tempMessageListData.sections.length < 10 && (
                                                    <button
                                                        onClick={() => {
                                                            const newSection = { id: `sec-${Date.now()}`, name: "", options: [] };
                                                            setTempMessageListData(prev => ({ ...prev, sections: [...prev.sections, newSection] }));
                                                        }}
                                                        className="text-[10px] font-bold text-blue-600 hover:text-blue-700 transition-colors uppercase flex items-center gap-1"
                                                    >
                                                        <FaPlus className="w-2 h-2" /> Add Section
                                                    </button>
                                                )}
                                            </div>

                                            <div className="space-y-4">
                                                {tempMessageListData.sections.map((section, sIdx) => (
                                                    <div key={section.id} className="border border-gray-200 rounded-lg p-3 space-y-3 bg-white relative group">
                                                        <button
                                                            onClick={() => {
                                                                setTempMessageListData(prev => ({
                                                                    ...prev,
                                                                    sections: prev.sections.filter(s => s.id !== section.id)
                                                                }));
                                                            }}
                                                            className="absolute top-2 right-2 text-gray-300 hover:text-red-500 transition-colors"
                                                        >
                                                            <X className="w-3.5 h-3.5" />
                                                        </button>

                                                        <div className="pr-6">
                                                            <input
                                                                type="text"
                                                                value={section.name}
                                                                onChange={(e) => {
                                                                    const newSections = [...tempMessageListData.sections];
                                                                    newSections[sIdx].name = e.target.value;
                                                                    setTempMessageListData(prev => ({ ...prev, sections: newSections }));
                                                                }}
                                                                placeholder={`Section ${sIdx + 1} Name`}
                                                                className="w-full text-xs font-bold text-gray-800 outline-none border-b border-transparent focus:border-blue-100 pb-1"
                                                            />
                                                        </div>

                                                        {/* Options within Section */}
                                                        <div className="space-y-2">
                                                            {section.options.map((option, oIdx) => (
                                                                <div key={option.id} className="p-2.5 border border-gray-100 rounded bg-gray-50/50 relative group/opt">
                                                                    <button
                                                                        onClick={() => {
                                                                            const newSections = [...tempMessageListData.sections];
                                                                            newSections[sIdx].options = newSections[sIdx].options.filter(o => o.id !== option.id);
                                                                            setTempMessageListData(prev => ({ ...prev, sections: newSections }));
                                                                        }}
                                                                        className="absolute top-2 right-2 text-gray-300 hover:text-red-400 opacity-0 group-hover/opt:opacity-100 transition-all"
                                                                    >
                                                                        <X className="w-3 h-3" />
                                                                    </button>
                                                                    <div className="space-y-1.5 pr-4">
                                                                        <input
                                                                            type="text"
                                                                            value={option.name}
                                                                            onChange={(e) => {
                                                                                const newSections = [...tempMessageListData.sections];
                                                                                newSections[sIdx].options[oIdx].name = e.target.value;
                                                                                setTempMessageListData(prev => ({ ...prev, sections: newSections }));
                                                                            }}
                                                                            placeholder="Option name"
                                                                            className="w-full text-[11px] font-bold text-gray-700 bg-transparent border-none outline-none"
                                                                        />
                                                                        <input
                                                                            type="text"
                                                                            value={option.description}
                                                                            onChange={(e) => {
                                                                                const newSections = [...tempMessageListData.sections];
                                                                                newSections[sIdx].options[oIdx].description = e.target.value;
                                                                                setTempMessageListData(prev => ({ ...prev, sections: newSections }));
                                                                            }}
                                                                            placeholder="Enter description (optional)"
                                                                            className="w-full text-[10px] text-gray-400 bg-transparent border-none outline-none italic"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            ))}

                                                            {section.options.length < 10 && (
                                                                <button
                                                                    onClick={() => {
                                                                        const newOption = { id: `opt-${Date.now()}`, name: "", description: "" };
                                                                        const newSections = [...tempMessageListData.sections];
                                                                        newSections[sIdx].options.push(newOption);
                                                                        setTempMessageListData(prev => ({ ...prev, sections: newSections }));
                                                                    }}
                                                                    className="w-full py-2 border border-dashed border-gray-200 rounded text-[10px] font-bold text-gray-400 hover:border-blue-300 hover:text-blue-500 hover:bg-blue-50/30 transition-all flex items-center justify-center gap-1.5"
                                                                >
                                                                    <FaPlus className="w-2 h-2" />
                                                                    Add an option
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 border-t border-gray-100 bg-white flex items-center gap-3 shrink-0">
                                        <button
                                            onClick={() => {
                                                if (selectedNodeId && editingBlockId) {
                                                    setNodes(nds => nds.map(n => n.id === selectedNodeId ? {
                                                        ...n,
                                                        data: {
                                                            ...n.data,
                                                            blocks: (n.data.blocks || []).map((b: any) => b.id === editingBlockId ? {
                                                                ...b,
                                                                ...tempMessageListData
                                                            } : b)
                                                        }
                                                    } : n));
                                                }
                                                setIsMessageListEditorOpen(false);
                                                setEditingBlockId(null);
                                            }}
                                            className="flex-1 py-2 text-xs font-medium text-blue-600 border border-blue-400 rounded-md bg-transparent hover:bg-blue-600 hover:text-white transition-all duration-200"
                                        >
                                            Save Changes
                                        </button>
                                        <button
                                            onClick={() => setIsMessageListEditorOpen(false)}
                                            className="flex-1 py-2 text-xs font-medium text-gray-600 border border-gray-200 rounded-md bg-transparent hover:bg-gray-800 hover:text-white transition-all duration-200"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            )}

                        {/* AI Studio Question Editor */}
                        {isAiStudioEditorOpen && (
                            <div className="absolute top-0 bottom-0 right-[400px] w-[320px] bg-white border-l border-gray-200 shadow-[-8px_0_24px_rgba(0,0,0,0.05)] z-[60] flex flex-col animate-in slide-in-from-right-1 duration-300 pointer-events-auto">
                                {/* Header */}
                                <div className="h-14 px-4 flex items-center justify-between bg-indigo-600 text-white shrink-0">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 rounded bg-white/20">
                                            <FaQuestionCircle className="w-3.5 h-3.5 text-white" />
                                        </div>
                                        <h3 className="font-bold text-white text-xs tracking-tight uppercase">AI Studio Question</h3>
                                    </div>
                                    <button onClick={() => setIsAiStudioEditorOpen(false)} className="text-white/70 hover:text-white transition-colors p-1.5 hover:bg-white/10 rounded-full">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Tabs */}
                                <div className="flex border-b border-gray-200 shrink-0">
                                    <button
                                        className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${tempAiStudioMode === 'ChatGPT' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                                        onClick={() => setTempAiStudioMode('ChatGPT')}
                                    >ChatGPT</button>
                                    <button
                                        className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${tempAiStudioMode === 'Vision' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                                        onClick={() => setTempAiStudioMode('Vision')}
                                    >Vision</button>
                                </div>

                                {/* Body */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-5">
                                    {tempAiStudioMode === 'ChatGPT' ? (
                                        <div className="space-y-5">
                                            {/* Select Assistant */}
                                            <div>
                                                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2 block">Select Assistant</label>
                                                <AssistantDropdown
                                                    value={tempAiStudioAssistant}
                                                    onChange={setTempAiStudioAssistant}
                                                    options={[
                                                        "testehttp", "TestTiago", "TestsEdilson 2 Gemini", "open ai test agent", "Rental Car",
                                                        "Test Edilson 1 DeepSeek", "Test Edilson 1 Gemini", "Test Edilson 1 Anthropic", "Test Edilson 1 OpenAI",
                                                        "Test Tiago", "afadsfafa", "Checking ai studio model and fuciton", "TestTiagoGoogle",
                                                        "Test Edilson 2", "Fn Test Gemini", "agent-test-jaderson", "Reply Agent Website Assistance",
                                                        "Teste Edilson", "Anthropic with KB", "Test Anthropic", "Test DeepSeek", "Test Google",
                                                        "Gemini", "Anthropic", "DeepSeek", "Simple Agent"
                                                    ]}
                                                />
                                            </div>

                                            {/* Add Question */}
                                            <div>
                                                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2 block">Add Question (Optional)</label>
                                                <textarea
                                                    value={tempAiStudioQuestion}
                                                    onChange={(e) => setTempAiStudioQuestion(e.target.value)}
                                                    placeholder="Enter Your Message Here"
                                                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 outline-none text-sm text-gray-700 transition-all min-h-[80px] resize-y bg-gray-50"
                                                />
                                            </div>

                                            {/* Toggles Section */}
                                            <div className="space-y-4">
                                                {/* Accumulator */}
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-1.5">
                                                            <div className="relative group/tip">
                                                                <FaInfoCircle className="w-3 h-3 text-gray-400 cursor-help" />
                                                                <div className="absolute left-5 top-0 z-50 hidden group-hover/tip:block w-52 bg-gray-800 text-white text-[10px] rounded-lg p-2.5 shadow-xl leading-relaxed">
                                                                    This option enables the system to process multiple questions received simultaneously during the wait time.
                                                                </div>
                                                            </div>
                                                            <span className="text-xs font-bold text-gray-700">Accumulator</span>
                                                        </div>
                                                        <button onClick={() => setTempAiStudioAccumulator(!tempAiStudioAccumulator)} className={`w-8 h-4 rounded-full relative transition-colors ${tempAiStudioAccumulator ? 'bg-indigo-500' : 'bg-gray-300'}`}>
                                                            <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${tempAiStudioAccumulator ? 'translate-x-[18px]' : 'left-0.5'}`} />
                                                        </button>
                                                    </div>
                                                    {tempAiStudioAccumulator && (
                                                        <div className="pl-5 space-y-1.5">
                                                            <CustomNumberInput value={tempAiStudioAccumulatorTime} onChange={setTempAiStudioAccumulatorTime} min={5} max={60} unit="Seconds" />
                                                            <p className="text-[10px] text-gray-400 italic">Time should be between 5 to 20 seconds.</p>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Smart Loop */}
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-1.5">
                                                            <div className="relative group/tip">
                                                                <FaInfoCircle className="w-3 h-3 text-gray-400 cursor-help" />
                                                                <div className="absolute left-5 top-0 z-50 hidden group-hover/tip:block w-52 bg-gray-800 text-white text-[10px] rounded-lg p-2.5 shadow-xl leading-relaxed">
                                                                    Smart Loop keeps the contact in this ChatGPT module and waits for the next question until the specified time below.
                                                                </div>
                                                            </div>
                                                            <span className="text-xs font-bold text-gray-700">Smart loop</span>
                                                        </div>
                                                        <button onClick={() => setTempAiStudioSmartLoop(!tempAiStudioSmartLoop)} className={`w-8 h-4 rounded-full relative transition-colors ${tempAiStudioSmartLoop ? 'bg-indigo-500' : 'bg-gray-300'}`}>
                                                            <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${tempAiStudioSmartLoop ? 'translate-x-[18px]' : 'left-0.5'}`} />
                                                        </button>
                                                    </div>
                                                    {tempAiStudioSmartLoop && (
                                                        <div className="pl-5 space-y-2">
                                                            <p className="text-[10px] text-gray-500 leading-relaxed">The contact will proceed to the next step once the timer to wait for the next question runs out. If the contact asks a new question within the time frame, the system restarts the timer and generates a fresh answer, restarting the whole process.</p>
                                                            <div className="flex items-center gap-1.5">
                                                                <div className="relative group/tip">
                                                                    <FaInfoCircle className="w-3 h-3 text-gray-400 cursor-help" />
                                                                    <div className="absolute left-5 top-0 z-50 hidden group-hover/tip:block w-44 bg-gray-800 text-white text-[10px] rounded-lg p-2 shadow-xl">
                                                                        Time to wait for the next question
                                                                    </div>
                                                                </div>
                                                                <span className="text-[11px] font-bold text-gray-600">Time to wait for the next question</span>
                                                            </div>
                                                            <div className="flex gap-2 items-center">
                                                                <CustomNumberInput value={tempAiStudioSmartLoopTime} onChange={setTempAiStudioSmartLoopTime} min={1} max={60} unit={tempAiStudioSmartLoopUnit} />
                                                                <div className="relative">
                                                                    <select value={tempAiStudioSmartLoopUnit} onChange={(e) => setTempAiStudioSmartLoopUnit(e.target.value)} className="pl-2 pr-6 py-2 bg-white border border-gray-200 rounded-md text-xs font-bold text-gray-600 appearance-none focus:outline-none focus:border-indigo-400 transition-colors cursor-pointer">
                                                                        <option value="Minutes">Minutes</option>
                                                                        <option value="Hours">Hours</option>
                                                                    </select>
                                                                    <FaChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-2 h-2 text-gray-400 pointer-events-none" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* When smart loop OFF — show all toggles. When ON — show only Wait Replies + Counter */}
                                                {!tempAiStudioSmartLoop && (
                                                    <>
                                                        {/* Send the AI answer message */}
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-1.5">
                                                                <div className="relative group/tip">
                                                                    <FaInfoCircle className="w-3 h-3 text-gray-400 cursor-help" />
                                                                    <div className="absolute left-5 top-0 z-50 hidden group-hover/tip:block w-52 bg-gray-800 text-white text-[10px] rounded-lg p-2.5 shadow-xl leading-relaxed">
                                                                        Send the AI-generated response directly from this module. Be sure not to send answers from other modules to avoid duplicate responses.
                                                                    </div>
                                                                </div>
                                                                <span className="text-xs font-bold text-gray-700">Send the AI answer message</span>
                                                            </div>
                                                            <button onClick={() => setTempAiStudioSendAnswer(!tempAiStudioSendAnswer)} className={`w-8 h-4 rounded-full relative transition-colors ${tempAiStudioSendAnswer ? 'bg-indigo-500' : 'bg-gray-300'}`}>
                                                                <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${tempAiStudioSendAnswer ? 'translate-x-[18px]' : 'left-0.5'}`} />
                                                            </button>
                                                        </div>

                                                        {/* Save response to a custom field */}
                                                        <div className="space-y-2">
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-1.5">
                                                                    <div className="relative group/tip">
                                                                        <FaInfoCircle className="w-3 h-3 text-gray-400 cursor-help" />
                                                                        <div className="absolute left-5 top-0 z-50 hidden group-hover/tip:block w-52 bg-gray-800 text-white text-[10px] rounded-lg p-2.5 shadow-xl leading-relaxed">
                                                                            Save the last answer from ChatGPT to a custom field.
                                                                        </div>
                                                                    </div>
                                                                    <span className="text-xs font-bold text-gray-700">Save response to a custom field</span>
                                                                </div>
                                                                <button onClick={() => setTempAiStudioSaveCustomField(!tempAiStudioSaveCustomField)} className={`w-8 h-4 rounded-full relative transition-colors ${tempAiStudioSaveCustomField ? 'bg-indigo-500' : 'bg-gray-300'}`}>
                                                                    <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${tempAiStudioSaveCustomField ? 'translate-x-[18px]' : 'left-0.5'}`} />
                                                                </button>
                                                            </div>
                                                            {tempAiStudioSaveCustomField && (
                                                                <div className="pl-5">
                                                                    <div className="relative">
                                                                        <select value={tempAiStudioSaveCustomFieldName} onChange={(e) => setTempAiStudioSaveCustomFieldName(e.target.value)} className="w-full p-2 pr-7 bg-white border border-gray-200 rounded-md text-xs font-medium text-gray-700 appearance-none focus:outline-none focus:border-indigo-400 cursor-pointer">
                                                                            {["RespostaGPT", "Payload", "Ultimo Imovel", "RespostaVision", "booking_date_time", "user_confirm", "user_email", "booking_id", "booking_reschedule", "Reschedule_user_confirm", "eventTypeID", "Roger Booking Name", "Roger Book Date Time", "Roger Doctor Name", "Text area 2", "resposta_vision", "pergunta_gpt", "endAtual", "campotexto", "Nometst", "emailtst", "cidadetst", "total_invetimento", "nota_dinamica", "idMember", "resposta_cal", "Whisperer", "Whisperer_resposta", "event_id", "teste_edilson_apagar", "haider1", "Broadcasting"].map(f => <option key={f} value={f}>{f}</option>)}
                                                                        </select>
                                                                        <FaChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-2 h-2 text-gray-400 pointer-events-none" />
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </>
                                                )}

                                                {/* Wait Replies (shown always in ChatGPT mode) */}
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-1.5">
                                                            <div className="relative group/tip">
                                                                <FaInfoCircle className="w-3 h-3 text-gray-400 cursor-help" />
                                                                <div className="absolute left-5 top-0 z-50 hidden group-hover/tip:block w-52 bg-gray-800 text-white text-[10px] rounded-lg p-2.5 shadow-xl leading-relaxed">
                                                                    Send a random wait message while fetching answer from ChatGPT.
                                                                </div>
                                                            </div>
                                                            <span className="text-xs font-bold text-gray-700">Wait replies</span>
                                                        </div>
                                                        <button onClick={() => setTempAiStudioWaitReplies(!tempAiStudioWaitReplies)} className={`w-8 h-4 rounded-full relative transition-colors ${tempAiStudioWaitReplies ? 'bg-indigo-500' : 'bg-gray-300'}`}>
                                                            <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${tempAiStudioWaitReplies ? 'translate-x-[18px]' : 'left-0.5'}`} />
                                                        </button>
                                                    </div>
                                                    {tempAiStudioWaitReplies && (
                                                        <div className="pl-5 space-y-3">
                                                            <label className="flex items-center gap-2 cursor-pointer">
                                                                <input type="checkbox" checked={tempAiStudioWaitRepliesSaveLiveChat} onChange={(e) => setTempAiStudioWaitRepliesSaveLiveChat(e.target.checked)} className="w-3.5 h-3.5 rounded border-gray-300 accent-indigo-600" />
                                                                <span className="text-[11px] text-gray-600 leading-relaxed">Save wait message to Live Chat notes and contact history.</span>
                                                            </label>
                                                            {tempAiStudioWaitRepliesMessages.map((msg, idx) => (
                                                                <div key={msg.id} className="flex items-center gap-1.5">
                                                                    <input
                                                                        value={msg.text}
                                                                        onChange={(e) => setTempAiStudioWaitRepliesMessages(prev => prev.map((m, i) => i === idx ? { ...m, text: e.target.value } : m))}
                                                                        placeholder={`Message ${idx + 1}`}
                                                                        className="flex-1 p-2 text-xs border border-gray-200 rounded-md focus:outline-none focus:border-indigo-400 bg-gray-50"
                                                                    />
                                                                    <button onClick={() => setTempAiStudioWaitRepliesMessages(prev => prev.filter((_, i) => i !== idx))} className="text-gray-300 hover:text-red-400 transition-colors">
                                                                        <X className="w-3.5 h-3.5" />
                                                                    </button>
                                                                </div>
                                                            ))}
                                                            {tempAiStudioWaitRepliesMessages.length < 10 && (
                                                                <button onClick={() => setTempAiStudioWaitRepliesMessages(prev => [...prev, { id: `wr-${Date.now()}`, text: '' }])} className="w-full py-1.5 text-[11px] font-bold text-indigo-600 border border-dashed border-indigo-300 rounded-md hover:bg-indigo-50 transition-colors">
                                                                    + Add Message
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Counter */}
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-1.5">
                                                            <div className="relative group/tip">
                                                                <FaInfoCircle className="w-3 h-3 text-gray-400 cursor-help" />
                                                                <div className="absolute left-5 top-0 z-50 hidden group-hover/tip:block w-52 bg-gray-800 text-white text-[10px] rounded-lg p-2.5 shadow-xl leading-relaxed">
                                                                    Enable counter to increment value each time AI answer generated.
                                                                </div>
                                                            </div>
                                                            <span className="text-xs font-bold text-gray-700">Counter</span>
                                                        </div>
                                                        <button onClick={() => setTempAiStudioCounter(!tempAiStudioCounter)} className={`w-8 h-4 rounded-full relative transition-colors ${tempAiStudioCounter ? 'bg-indigo-500' : 'bg-gray-300'}`}>
                                                            <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${tempAiStudioCounter ? 'translate-x-[18px]' : 'left-0.5'}`} />
                                                        </button>
                                                    </div>
                                                    {tempAiStudioCounter && (
                                                        <div className="pl-5 space-y-2">
                                                            <div className="relative">
                                                                <select value={tempAiStudioCounterCustomField} onChange={(e) => setTempAiStudioCounterCustomField(e.target.value)} className="w-full p-2 pr-7 bg-white border border-gray-200 rounded-md text-xs font-medium text-gray-700 appearance-none focus:outline-none focus:border-indigo-400 cursor-pointer">
                                                                    <option value="">Select a field</option>
                                                                    {["RespostaGPT", "Payload", "Ultimo Imovel", "RespostaVision", "booking_date_time", "user_confirm", "user_email", "booking_id", "booking_reschedule", "Reschedule_user_confirm", "eventTypeID", "Roger Booking Name", "Roger Book Date Time", "Roger Doctor Name", "Text area 2", "resposta_vision", "pergunta_gpt", "endAtual", "campotexto", "Nometst", "emailtst", "cidadetst", "total_invetimento", "nota_dinamica", "idMember", "resposta_cal", "Whisperer", "Whisperer_resposta", "event_id", "teste_edilson_apagar", "haider1", "Broadcasting"].map(f => <option key={f} value={f}>{f}</option>)}
                                                                </select>
                                                                <FaChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-2 h-2 text-gray-400 pointer-events-none" />
                                                            </div>
                                                            <div className="flex items-center gap-1.5 p-2.5 bg-blue-50 border border-blue-100 rounded-lg">
                                                                <FaInfoCircle className="w-3 h-3 text-blue-400 shrink-0" />
                                                                <p className="text-[10px] text-blue-600 leading-relaxed">The contact will proceed to the next step once their question is answered. If no question is asked within 1 minute, the contact will still advance to the next step automatically.</p>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <CustomNumberInput value={tempAiStudioCounterMinute} onChange={setTempAiStudioCounterMinute} min={1} max={60} unit="Minute" />
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        /* Vision Tab */
                                        <div className="space-y-5">
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-1.5">
                                                        <div className="relative group/tip">
                                                            <FaInfoCircle className="w-3 h-3 text-gray-400 cursor-help" />
                                                            <div className="absolute left-5 top-0 z-50 hidden group-hover/tip:block w-52 bg-gray-800 text-white text-[10px] rounded-lg p-2.5 shadow-xl leading-relaxed">
                                                                Enable ChatGPT Vision for incoming images.
                                                            </div>
                                                        </div>
                                                        <span className="text-xs font-bold text-gray-700">ChatGPT Vision</span>
                                                    </div>
                                                    <button onClick={() => setTempAiStudioVisionEnabled(!tempAiStudioVisionEnabled)} className={`w-8 h-4 rounded-full relative transition-colors ${tempAiStudioVisionEnabled ? 'bg-indigo-500' : 'bg-gray-300'}`}>
                                                        <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${tempAiStudioVisionEnabled ? 'translate-x-[18px]' : 'left-0.5'}`} />
                                                    </button>
                                                </div>

                                                {tempAiStudioVisionEnabled && (
                                                    <div className="space-y-4 pt-2">
                                                        <div>
                                                            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2 block">Select GPT model</label>
                                                            <div className="relative">
                                                                <select value={tempAiStudioVisionModel} onChange={(e) => setTempAiStudioVisionModel(e.target.value)} className="w-full p-2.5 pr-7 bg-white border border-gray-200 rounded-md text-xs font-medium text-gray-700 appearance-none focus:outline-none focus:border-indigo-400 cursor-pointer">
                                                                    <option value="gpt-4o-mini">gpt-4o-mini</option>
                                                                    <option value="gpt-4o">gpt-4o</option>
                                                                    <option value="gpt-4o-turbo">gpt-4o-turbo</option>
                                                                </select>
                                                                <FaChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-2 h-2 text-gray-400 pointer-events-none" />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2 block">Enter the prompt below</label>
                                                            <textarea
                                                                value={tempAiStudioVisionPrompt}
                                                                onChange={(e) => setTempAiStudioVisionPrompt(e.target.value)}
                                                                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 outline-none text-sm text-gray-700 bg-gray-50 min-h-[80px] resize-y"
                                                                placeholder="What's in this image? black and white"
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <div className="flex items-center gap-1.5">
                                                                <div className="relative group/tip">
                                                                    <FaInfoCircle className="w-3 h-3 text-gray-400 cursor-help" />
                                                                    <div className="absolute left-5 top-0 z-50 hidden group-hover/tip:block w-52 bg-gray-800 text-white text-[10px] rounded-lg p-2.5 shadow-xl leading-relaxed">
                                                                        Save the last answer from ChatGPT to a custom field.
                                                                    </div>
                                                                </div>
                                                                <span className="text-[11px] font-bold text-gray-600">Save response to a custom field</span>
                                                            </div>
                                                            <div className="relative">
                                                                <select value={tempAiStudioVisionCustomField} onChange={(e) => setTempAiStudioVisionCustomField(e.target.value)} className="w-full p-2 pr-7 bg-white border border-gray-200 rounded-md text-xs font-medium text-gray-700 appearance-none focus:outline-none focus:border-indigo-400 cursor-pointer">
                                                                    {["RespostaGPT", "Payload", "Ultimo Imovel", "RespostaVision", "booking_date_time", "user_confirm", "user_email", "booking_id", "booking_reschedule", "Reschedule_user_confirm", "eventTypeID", "Roger Booking Name", "Roger Book Date Time", "Roger Doctor Name", "Text area 2", "resposta_vision", "pergunta_gpt", "endAtual", "campotexto", "Nometst", "emailtst", "cidadetst", "total_invetimento", "nota_dinamica", "idMember", "resposta_cal", "Whisperer", "Whisperer_resposta", "event_id", "teste_edilson_apagar", "haider1", "Broadcasting"].map(f => <option key={f} value={f}>{f}</option>)}
                                                                </select>
                                                                <FaChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-2 h-2 text-gray-400 pointer-events-none" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Footer */}
                                <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center gap-3 shrink-0">
                                    <button
                                        onClick={() => {
                                            if (selectedNodeId && editingBlockId) {
                                                setNodes(nds => nds.map(n => n.id === selectedNodeId ? {
                                                    ...n,
                                                    data: {
                                                        ...n.data,
                                                        blocks: (n.data.blocks || []).map((b: any) => b.id === editingBlockId ? {
                                                            ...b,
                                                            mode: tempAiStudioMode,
                                                            assistant: tempAiStudioAssistant,
                                                            question: tempAiStudioQuestion,
                                                            accumulator: tempAiStudioAccumulator,
                                                            accumulatorTime: tempAiStudioAccumulatorTime,
                                                            smartLoop: tempAiStudioSmartLoop,
                                                            smartLoopTime: tempAiStudioSmartLoopTime,
                                                            smartLoopUnit: tempAiStudioSmartLoopUnit,
                                                            sendAnswer: tempAiStudioSendAnswer,
                                                            saveCustomField: tempAiStudioSaveCustomField,
                                                            saveCustomFieldName: tempAiStudioSaveCustomFieldName,
                                                            waitReplies: tempAiStudioWaitReplies,
                                                            waitRepliesSaveLiveChat: tempAiStudioWaitRepliesSaveLiveChat,
                                                            waitRepliesMessages: tempAiStudioWaitRepliesMessages,
                                                            counter: tempAiStudioCounter,
                                                            counterCustomField: tempAiStudioCounterCustomField,
                                                            counterMinute: tempAiStudioCounterMinute,
                                                            visionEnabled: tempAiStudioMode === 'Vision',
                                                            visionModel: tempAiStudioVisionModel,
                                                            visionPrompt: tempAiStudioVisionPrompt,
                                                            visionCustomField: tempAiStudioVisionCustomField,
                                                        } : b)
                                                    }
                                                } : n));
                                            }
                                            setIsAiStudioEditorOpen(false);
                                            setEditingBlockId(null);
                                        }}
                                        className="flex-1 py-2 text-xs font-medium text-blue-600 border border-blue-400 rounded-md bg-transparent hover:bg-blue-600 hover:text-white transition-all duration-200"
                                    >Save Changes</button>
                                    <button
                                        onClick={() => setIsAiStudioEditorOpen(false)}
                                        className="flex-1 py-2 text-xs font-medium text-gray-600 border border-gray-200 rounded-md bg-transparent hover:bg-gray-800 hover:text-white transition-all duration-200"
                                    >Close</button>
                                </div>
                            </div>
                        )}


                        {/* Dify.ai Question Editor */}


                        {/* Dify.ai Question Editor */}
                        {isDifyEditorOpen && (
                            <div className="absolute top-0 bottom-0 right-[400px] w-[320px] bg-white border-l border-gray-200 shadow-[-8px_0_24px_rgba(0,0,0,0.05)] z-[60] flex flex-col animate-in slide-in-from-right-1 duration-300 pointer-events-auto">
                                <div className="h-14 px-4 flex items-center justify-between bg-sky-600 text-white shrink-0">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 rounded bg-white/20">
                                            <FaCogs className="w-3.5 h-3.5 text-white" />
                                        </div>
                                        <h3 className="font-bold text-white text-xs tracking-tight uppercase">Dify.ai Question</h3>
                                    </div>
                                    <button onClick={() => setIsDifyEditorOpen(false)} className="text-white/70 hover:text-white transition-colors p-1.5 hover:bg-white/10 rounded-full">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="flex-1 overflow-y-auto p-5 space-y-6">
                                    <div>
                                        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2 block text-left">Select Assistant</label>
                                        <AssistantDropdown
                                            value={tempAiStudioAssistant}
                                            onChange={setTempAiStudioAssistant}
                                            options={[
                                                "TestsEdilson 2 Gemini", "Test Edilson 1 Gemini", "Test Google", "Gemini", "TestTiagoGoogle",
                                                "Test Edilson 1 OpenAI", "Test Edilson 1 Anthropic", "Test Edilson 1 DeepSeek",
                                                "open ai test agent", "Rental Car", "Test DeepSeek", "DeepSeek", "Test Anthropic", "Anthropic",
                                                "Anthropic with KB", "Simple Agent", "Test Tiago", "TestTiago", "testehttp"
                                            ]}
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-bold text-gray-700">Counter</span>
                                                <button
                                                    onClick={() => setTempAiStudioCounter(!tempAiStudioCounter)}
                                                    className={`w-8 h-4 rounded-full relative transition-colors ${tempAiStudioCounter ? 'bg-sky-500' : 'bg-gray-300'}`}
                                                >
                                                    <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${tempAiStudioCounter ? 'translate-x-[18px]' : 'left-0.5'}`} />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-2 mt-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-bold text-gray-700">Accumulator</span>
                                                <button
                                                    onClick={() => setTempAiStudioAccumulator(!tempAiStudioAccumulator)}
                                                    className={`w-8 h-4 rounded-full relative transition-colors ${tempAiStudioAccumulator ? 'bg-sky-500' : 'bg-gray-300'}`}
                                                >
                                                    <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${tempAiStudioAccumulator ? 'translate-x-[18px]' : 'left-0.5'}`} />
                                                </button>
                                            </div>
                                            {tempAiStudioAccumulator && (
                                                <div className="pl-6 mt-1 space-y-2 text-left">
                                                    <CustomNumberInput
                                                        value={tempAiStudioAccumulatorTime}
                                                        onChange={setTempAiStudioAccumulatorTime}
                                                        min={5}
                                                        max={60}
                                                        unit="Seconds"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center gap-3 shrink-0">
                                    <button
                                        onClick={() => {
                                            if (selectedNodeId && editingBlockId) {
                                                setNodes(nds => nds.map(n => n.id === selectedNodeId ? {
                                                    ...n,
                                                    data: {
                                                        ...n.data,
                                                        blocks: (n.data.blocks || []).map((b: any) => b.id === editingBlockId ? {
                                                            ...b,
                                                            assistant: tempAiStudioAssistant,
                                                            counter: tempAiStudioCounter,
                                                            accumulator: tempAiStudioAccumulator,
                                                            accumulatorTime: tempAiStudioAccumulatorTime
                                                        } : b)
                                                    }
                                                } : n));
                                            }
                                            setIsDifyEditorOpen(false);
                                            setEditingBlockId(null);
                                        }}
                                        className="flex-1 py-2 text-xs font-medium text-blue-600 border border-blue-400 rounded-md bg-transparent hover:bg-blue-600 hover:text-white transition-all duration-200"
                                    >
                                        Save Changes
                                    </button>
                                    <button
                                        onClick={() => setIsDifyEditorOpen(false)}
                                        className="flex-1 py-2 text-xs font-medium text-gray-600 border border-gray-200 rounded-md bg-transparent hover:bg-gray-800 hover:text-white transition-all duration-200"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ChatGPT Answer Editor */}
                        {isChatGptEditorOpen && (
                            <div className="absolute top-0 bottom-0 right-[400px] w-[320px] bg-white border-l border-gray-200 shadow-[-8px_0_24px_rgba(0,0,0,0.05)] z-[60] flex flex-col animate-in slide-in-from-right-1 duration-300 pointer-events-auto">
                                <div className="h-14 px-4 flex items-center justify-between bg-white border-b border-gray-200 shrink-0">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 rounded bg-gray-100">
                                            <FaBrain className="w-3.5 h-3.5 text-orange-500" />
                                        </div>
                                        <h3 className="font-bold text-gray-800 text-xs tracking-tight uppercase">ChatGPT Answer</h3>
                                    </div>
                                    <button onClick={() => setIsChatGptEditorOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors p-1.5 hover:bg-gray-100 rounded-full">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-gray-50/50">
                                    <div>
                                        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2 block text-left">Message content</label>
                                        <textarea
                                            value={tempChatGptText}
                                            onChange={(e) => setTempChatGptText(e.target.value)}
                                            placeholder="Enter Your Message Here"
                                            className="w-full p-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all min-h-[120px] resize-y placeholder:text-gray-300 shadow-sm"
                                        />
                                    </div>

                                    <div className="p-3 bg-gray-100 rounded-lg border border-gray-200 flex gap-2.5">
                                        <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                                            <span className="text-[10px] font-bold text-gray-500">i</span>
                                        </div>
                                        <p className="text-[11px] text-gray-600 leading-relaxed text-left">
                                            This module automatically breaks down message paragraphs into multiple fragmented messages, making the conversation feel more natural and human.
                                        </p>
                                    </div>
                                </div>

                                <div className="p-4 border-t border-gray-100 bg-white flex items-center gap-3 shrink-0">
                                    <button
                                        onClick={() => {
                                            if (selectedNodeId && editingBlockId) {
                                                setNodes(nds => nds.map(n => n.id === selectedNodeId ? {
                                                    ...n,
                                                    data: {
                                                        ...n.data,
                                                        blocks: (n.data.blocks || []).map((b: any) => b.id === editingBlockId ? {
                                                            ...b,
                                                            text: tempChatGptText
                                                        } : b)
                                                    }
                                                } : n));
                                            }
                                            setIsChatGptEditorOpen(false);
                                            setEditingBlockId(null);
                                        }}
                                        className="flex-1 py-2 text-xs font-medium text-blue-600 border border-blue-400 rounded-md bg-transparent hover:bg-blue-600 hover:text-white transition-all duration-200"
                                    >
                                        Save Changes
                                    </button>
                                    <button
                                        onClick={() => setIsChatGptEditorOpen(false)}
                                        className="flex-1 py-2 text-xs font-medium text-gray-600 border border-gray-200 rounded-md bg-transparent hover:bg-gray-800 hover:text-white transition-all duration-200"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        )}
                        \n            {/* Media Gallery Modal */}
                        <AlertDialog open={isMediaGalleryOpen} onOpenChange={setIsMediaGalleryOpen}>
                            <AlertDialogContent className="fixed inset-0 w-full h-full p-0 border-none bg-white rounded-none flex flex-col overflow-hidden z-[9999] max-w-none translate-x-0 translate-y-0 top-0 left-0">
                                <div className="flex flex-col h-full relative">
                                    <div className="absolute top-4 right-4 z-[110]">
                                        <button onClick={() => setIsMediaGalleryOpen(false)} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 transition-all">
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <div className="flex-1 overflow-y-auto">
                                        <MediaGallerySection
                                            onSelect={(file) => {
                                                if (isAddingVideoBlock && selectedNodeId) {
                                                    const newBlockId = `video-${Date.now()}`;
                                                    const newBlock = {
                                                        id: newBlockId,
                                                        type: 'video' as const,
                                                        url: file.url
                                                    };
                                                    setNodes(nds => nds.map(n => n.id === selectedNodeId ? {
                                                        ...n,
                                                        data: {
                                                            ...n.data,
                                                            blocks: [...(n.data.blocks || []), newBlock]
                                                        }
                                                    } : n));
                                                    setIsMediaGalleryOpen(false);
                                                    setIsAddingVideoBlock(false);
                                                } else if (selectedNodeId && editingBlockId) {
                                                    if (isAudioEditorOpen) {
                                                        setTempAudioUrl(file.url);
                                                        setIsMediaGalleryOpen(false);
                                                    } else if (isImageEditorOpen) {
                                                        setTempImageUrl(file.url);
                                                        setIsMediaGalleryOpen(false);
                                                    } else {
                                                        setNodes((nds) => nds.map((n) => n.id === selectedNodeId ? {
                                                            ...n,
                                                            data: {
                                                                ...n.data,
                                                                blocks: (n.data.blocks || []).map((b: any) => b.id === editingBlockId ? {
                                                                    ...b,
                                                                    url: file.url
                                                                } : b)
                                                            }
                                                        } : n));
                                                        setIsMediaGalleryOpen(false);
                                                        setEditingBlockId(null);
                                                    }
                                                }
                                            }}
                                        />
                                    </div>
                                    <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end shrink-0">
                                        <button
                                            onClick={() => setIsMediaGalleryOpen(false)}
                                            className="px-6 py-2 text-sm font-medium text-blue-600 border border-blue-400 rounded-lg bg-transparent hover:bg-blue-600 hover:text-white transition-all duration-200 active:scale-[0.98]"
                                        >
                                            Done
                                        </button>
                                    </div>
                                </div>
                            </AlertDialogContent>
                        </AlertDialog>
                    </>
                )}

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

                <AlertDialog open={!!edgeIdToDelete} onOpenChange={(open) => !open && setEdgeIdToDelete(null)}>
                    <AlertDialogContent className="bg-white">
                        <AlertDialogHeader>
                            <AlertDialogTitle>Delete Connection?</AlertDialogTitle>
                            <AlertDialogDescription>Are you sure you want to delete this connection?</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel className="border-gray-200">No</AlertDialogCancel>
                            <AlertDialogAction onClick={confirmDeleteEdge} className="bg-red-600 hover:bg-red-700 text-white border-0">Yes</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div >
        </div >
    );
};

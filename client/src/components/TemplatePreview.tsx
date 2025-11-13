import React from "react";
import { FileText, Send, Play } from "react-feather";

interface TemplatePreviewProps {
  // Template content
  headerText?: string;
  bodyText?: string;
  footerText?: string;
  selectedMediaFile?: File | null;
  templateButtons?: Array<any>;
  variableSamples?: Record<string, string>;

  // Styling props for outer container
  containerClassName?: string;
  phoneClassName?: string;
  chatAreaClassName?: string;
  messageBoxClassName?: string;

  // Placeholder text
  placeholderText?: string;
  showMessage?: boolean;
}

export default function TemplatePreview({
  headerText = "",
  bodyText = "",
  footerText = "",
  selectedMediaFile = null,
  templateButtons = [],
  variableSamples = {},
  containerClassName = "flex-1 flex items-center justify-center min-h-0",
  phoneClassName = "h-full aspect-[9/18] bg-black rounded-3xl p-3 shadow-lg flex flex-col overflow-hidden",
  chatAreaClassName = "flex-1 bg-[#ECE5DD] px-4 pt-4 pb-4 overflow-y-auto overflow-x-hidden flex flex-col space-y-3 scrollbar-hide",
  messageBoxClassName = "bg-white rounded-2xl rounded-bl-none px-3 py-2 max-w-xs shadow-sm overflow-hidden",
  placeholderText = "Start typing to see your template preview...",
  showMessage = true,
}: TemplatePreviewProps) {
  // Helper to split text by newlines and insert <br /> tags
  const splitByNewlines = (text: string, startKey: number) => {
    const lines = text.split('\n');
    const result: React.ReactNode[] = [];

    lines.forEach((line, index) => {
      // Check if line starts with "- " for bullet points
      if (line.trim().startsWith('- ')) {
        const bulletText = line.replace(/^\s*-\s/, '');
        result.push(
          <span key={startKey + index * 2}>
            <span className="inline-block mr-1">•</span>
            {bulletText}
          </span>
        );
      } else {
        result.push(<span key={startKey + index * 2}>{line}</span>);
      }

      if (index < lines.length - 1) {
        result.push(<br key={startKey + index * 2 + 1} />);
      }
    });

    return result;
  };

  // Format text with variables - handles formatting that wraps variables like *{{1}}*
  const formatTextWithVariables = (text: string): React.ReactNode => {
    const parts: React.ReactNode[] = [];
    let currentIndex = 0;
    let key = 0;

    // Match formatting patterns that may contain variables: *...*,  _..._,  ~...~
    const regex = /(\*[^*]*\*|_[^_]*_|~[^~]*~)/g;
    let match;

    while ((match = regex.exec(text)) !== null) {
      // Add text before the match
      if (match.index > currentIndex) {
        const beforeText = text.substring(currentIndex, match.index);
        // Split by variables and format
        beforeText.split(/(\{\{[^}]+\}\})/).forEach((part) => {
          if (part.match(/\{\{[^}]+\}\}/)) {
            const variableKey = part.match(/\{\{([^}]+)\}\}/)?.[1] || "";
            const value = variableSamples[variableKey];
            parts.push(
              <span key={key++} className={value ? "text-[#111B21]" : "text-[#0084FF] font-medium"}>
                {value || part}
              </span>
            );
          } else if (part) {
            parts.push(...splitByNewlines(part, key));
            key += part.split('\n').length;
          }
        });
      }

      const matchedText = match[0];
      const innerText = matchedText.substring(1, matchedText.length - 1);
      const formatChar = matchedText[0];

      // Process inner text for variables
      const innerContent = innerText.split(/(\{\{[^}]+\}\})/).map((part, idx) => {
        if (part.match(/\{\{[^}]+\}\}/)) {
          const variableKey = part.match(/\{\{([^}]+)\}\}/)?.[1] || "";
          const value = variableSamples[variableKey];
          return (
            <span key={idx} className={value ? "text-[#111B21]" : "text-[#0084FF] font-medium"}>
              {value || part}
            </span>
          );
        }
        return <span key={idx}>{part}</span>;
      });

      // Apply formatting based on WhatsApp syntax
      if (formatChar === '*') {
        parts.push(<strong key={key++}>{innerContent}</strong>);
      } else if (formatChar === '_') {
        parts.push(<em key={key++}>{innerContent}</em>);
      } else if (formatChar === '~') {
        parts.push(<s key={key++}>{innerContent}</s>);
      }

      currentIndex = match.index + matchedText.length;
    }

    // Add remaining text
    if (currentIndex < text.length) {
      const remainingText = text.substring(currentIndex);
      remainingText.split(/(\{\{[^}]+\}\})/).forEach((part) => {
        if (part.match(/\{\{[^}]+\}\}/)) {
          const variableKey = part.match(/\{\{([^}]+)\}\}/)?.[1] || "";
          const value = variableSamples[variableKey];
          parts.push(
            <span key={key++} className={value ? "text-[#111B21]" : "text-[#0084FF] font-medium"}>
              {value || part}
            </span>
          );
        } else if (part) {
          parts.push(...splitByNewlines(part, key));
          key += part.split('\n').length;
        }
      });
    }

    return parts.length > 0 ? parts : text;
  };

  // Get button display text with emoji mapping
  const getButtonDisplayText = (button: any): string => {
    const emojiMap: Record<string, string> = {
      "copy-offer": "💻",
      "complete-flow": "📋",
      "call-phone": "📞",
      "call-whatsapp": "📞",
      "visit-website": "↗️",
      "quick-reply": ""
    };

    let emoji = emojiMap[button.type] || "";

    if (button.type === "complete-flow") {
      const flowEmojiMap: Record<string, string> = {
        "default": "📋",
        "document": "📄",
        "promotion": "🎁",
        "review": "⭐"
      };
      const flowEmoji = flowEmojiMap[button.flowButton] || "📋";
      emoji = `📋 ${flowEmoji}`;
    }

    const text = button.buttonText || "Button";
    return emoji ? `${emoji} ${text}` : text;
  };

  const hasContent = headerText || bodyText || footerText || templateButtons.length > 0 || selectedMediaFile;

  return (
    <div className={containerClassName}>
      {/* Phone mockup */}
      <div className={phoneClassName}>
        {/* Phone header - WhatsApp green */}
        <div className="bg-[#075E54] rounded-t-2xl px-4 py-2 flex items-center justify-between" style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#25D366] rounded-full"></div>
            <div>
              <p className="text-xs font-semibold text-white">WhatsApp</p>
              <p className="text-xs text-[#DCF8C6]">Online</p>
            </div>
          </div>
        </div>

        {/* Chat area - WhatsApp light background */}
        <div
          className={chatAreaClassName}
          style={{
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
                    {/* Spacer to push message to bottom */}
                    <div className="flex-1 min-h-0"></div>
                    
                    {showMessage && (
                      <>
                        {/* Template message preview */}
                        <div className="flex justify-start flex-shrink-0">
                          <div className={messageBoxClassName} style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
                            {/* Media Sample */}
                            {selectedMediaFile && (
                              <div className="mb-2 mt-1">
                                {selectedMediaFile.type.startsWith('image/') ? (
                                  <img
                                    src={URL.createObjectURL(selectedMediaFile)}
                                    alt="Media preview"
                                    className="max-w-full h-auto rounded max-h-48 object-cover"
                                  />
                                ) : selectedMediaFile.type.startsWith('video/') ? (
                                  <video
                                    src={URL.createObjectURL(selectedMediaFile)}
                                    className="max-w-full h-auto rounded max-h-48 object-cover"
                                    controls
                                  />
                                ) : (
                                  <div className="flex items-center gap-2 p-2 bg-[#F0F0F0] rounded">
                                    <FileText size={20} className="text-[#666666]" />
                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs font-medium text-[#111B21] truncate">{selectedMediaFile.name}</p>
                                      <p className="text-xs text-[#666666]">({(selectedMediaFile.size / 1024).toFixed(1)}KB)</p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
          
                            {/* Header */}
                            {headerText && (
                              <div className="mb-2">
                                <p className="text-sm font-semibold text-[#111B21] leading-relaxed whitespace-pre-wrap break-words overflow-wrap-anywhere">
                                  {headerText.split(/(\{\{[^}]+\}\})/).map((part, idx) => {
                                    const variableMatch = part.match(/\{\{([^}]+)\}\}/);
                                    if (variableMatch) {
                                      const variableKey = variableMatch[1];
                                      const value = variableSamples[variableKey];
                                      return (
                                        <span key={idx} className={value ? "text-[#111B21]" : "text-[#0084FF] font-medium"}>
                                          {value || part}
                                        </span>
                                      );
                                    }
                                    return <span key={idx}>{part}</span>;
                                  })}
                                </p>
                              </div>
                            )}
          
                            {/* Body */}
                            {bodyText && (
                              <p className="text-sm text-[#111B21] leading-relaxed whitespace-pre-wrap break-words overflow-wrap-anywhere">
                                {formatTextWithVariables(bodyText)}
                              </p>
                            )}
          
                            {/* Buttons */}
                            {templateButtons.length > 0 && (
                              <div className="mt-1.5 mb-2.5 space-y-2">
                                {templateButtons.slice(0, 3).map((button) => (
                                  <div
                                    key={button.id}
                                    className="bg-[#EFEFEF] border border-[#DDDDDD] rounded-lg px-3 py-2 text-center"
                                  >
                                    <p className="text-sm text-[#0064FF] font-normal break-words">
                                      {getButtonDisplayText(button)}
                                    </p>
                                  </div>
                                ))}
                                {templateButtons.length > 3 && (
                                  <div className="bg-[#EFEFEF] border border-[#DDDDDD] rounded-lg px-3 py-2 text-center flex items-center justify-center gap-2">
                                    <Play size={14} className="text-[#0064FF]" />
                                    <p className="text-sm text-[#0064FF] font-normal">See all options</p>
                                  </div>
                                )}
                              </div>
                            )}
          
                            {/* Footer */}
                            {footerText && (
                              <>
                                <div className="w-[calc(100%+1.5rem)] mt-1 -mx-3" style={{borderTopWidth: "1px", borderTopColor: "#000000", transform: "scaleY(0.25)"}}></div>
                                <div className="mt-1.5">
                                  <p className="text-xs text-[#666666] leading-relaxed whitespace-pre-wrap break-words overflow-wrap-anywhere">
                                    {footerText}
                                  </p>
                                </div>
                              </>
                            )}
          
                            {/* Placeholder when no content */}
                            {!hasContent && (
                              <p className="text-sm text-[#999999] italic">
                                {placeholderText}
                              </p>
                            )}
          
                            <p className="text-[0.7rem] text-[#999999] text-right">9:41 AM</p>
                          </div>
                        </div>
                      </>
                    )}        </div>

        {/* Input area */}
        <div className="bg-[#E8E8E8] rounded-b-2xl px-4 py-2 flex items-center gap-2" style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
          <div className="h-8 flex flex-1 bg-white rounded-full px-3 py-1 items-center border border-[#E5E5EA]">
            <p className="text-sm text-[#999999]">Type a message...</p>
          </div>
          <button className="w-8 h-8 bg-[#25D366] rounded-full flex items-center justify-center hover:bg-[#20BA5A] transition-colors">
            <Send size={16} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}


import React, { useRef, useEffect } from 'react';
import { ChevronLeft, Wifi, Battery, ArrowLeft, Square, Circle, MoreVertical, FileText, Play, Smile, Camera } from 'react-feather';
import { MdMic, MdAttachFile, MdSend, MdDoneAll } from 'react-icons/md';

type Mode = "chat" | "profile";

interface PreviewV2Props {
  mode?: Mode;

  // Optional Template content:
  showPlaceholderMessageInTemplate?: boolean;
  showTopBar?: boolean;
  showBottomBar?: boolean;
  
  // Optional Message Related
  headerText?: string;
  bodyText?: string;
  placeholderText?: string;
  footerText?: string;
  selectedMediaFile?: File | string | null;
  templateButtons?: Array<any>;
  variableSamples?: Record<string, string>;
 
  // Optional Command related
  commands?: { commandText: string; commandDescription: string; }[];

  // Optional Ice Breaker content
  icebreakers?: string[];

  // Optional profile content
  profilePhoneNumber?: string;
  profileDescription?: string;
  profileCategory?: string;
  profileAddress?: string;
  profileEmail?: string;
  profileWebsite?: string;
  profileAbout?: string;

  // Optional Universal stuff
  showMobile?: boolean;
  profileName?: string;
  profileSubText?: string;
  profilePfpUrl?: string;
}

const PreviewV2: React.FC<PreviewV2Props> = ({
  mode = "chat",
  headerText = "",
  bodyText = "",
  placeholderText = "Start typing to see your template preview...",
  footerText = "",
  selectedMediaFile = "",
  templateButtons = [],
  icebreakers = [],
  commands = [],
  variableSamples = {},
  showPlaceholderMessageInTemplate = true, 
  showMobile = true,
  
  // Business Name after testing
  profileName = "Fake Business Name for Testing Purposes - This is a long name to test the limit".padEnd(75, 'x').substring(0, 75),
  
  profileSubText = "Business Account",
  profilePfpUrl = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='50' fill='%23DFE5E7'/%3E%3Cg fill='white'%3E%3Ccircle cx='50' cy='40' r='15'/%3E%3Cpath d='M50,60 C30,60 20,80 20,100 L80,100 C80,80 70,60 50,60 Z'/%3E%3C/g%3E%3C/svg%3E",
  
  // Empty after testing
  profilePhoneNumber = "+1 (555) 123-4567",
  profileDescription = "This is a fake business description for testing purposes. It needs to be quite long to reach the character limit of 512. We will repeat some text to ensure it fills up the space. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.".padEnd(512, 'x').substring(0, 512),
  profileCategory = "E-commerce",
  profileAddress = "123 Fake Street, Suite 400, Fictional City, State, 90210, United States of America. This address is intentionally long to test the character limit of 512. We are adding more details to make sure it reaches the maximum allowed length. This is a very detailed address for a very important fake business. Testing the boundaries of address fields is crucial for robust UI design and data handling. Ensuring that all characters are displayed correctly and that the layout adapts is key to a good user experience.".padEnd(512, 'x').substring(0, 512),
  profileEmail = "test.email.for.fake.business.purposes.to.reach.the.character.limit@example.com".padEnd(128, 'x').substring(0, 128),
  profileWebsite = "https://www.fake-business-website-for-testing-purposes-that-is-very-long-to-reach-the-character-limit.com/some/very/deep/path/to/a/specific/page/with/many/parameters?param1=value1&param2=value2&param3=value3&param4=value4&param5=value5".padEnd(256, 'x').substring(0, 256),
  profileAbout = "This is a detailed 'About Us' section for our fake business, designed to test the character limit of 139. It provides a brief overview.".padEnd(139, 'x').substring(0, 139),
  
  showTopBar = true,
  showBottomBar = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scaleWrapperRef = useRef<HTMLDivElement>(null);
  const chatAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const baseWidth = 450;
  const baseHeight = 900;

  const splitByNewlines = (text: string, startKey: number) => {
    const lines = text.split('\n');
    const result: React.ReactNode[] = [];

    lines.forEach((line, index) => {
      // Check if line starts with "- " for bullet points
      if (line.trim().startsWith('- ')) {
        const bulletText = line.replace(/^\s*-\s/, '');
        result.push(
          <span key={startKey + index * 2}>
            <span className="inline-block mr-[4px]">•</span>
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

  useEffect(() => {
    const container = containerRef.current;
    const scaleWrapper = scaleWrapperRef.current;

    if (!container || !scaleWrapper) return;

    let animationFrameId: number;

    const resizeObserver = new ResizeObserver(entries => {
      cancelAnimationFrame(animationFrameId);

      animationFrameId = requestAnimationFrame(() => {
        try {
          for (let entry of entries) {
            const { width, height } = entry.contentRect;

            const scaleX = width / baseWidth;
            const scaleY = height / baseHeight;
            const scale = Math.min(scaleX, scaleY);

            scaleWrapper.style.transform = `scale(${scale})`;
          }
        } catch (error) {
          console.error('Error in ResizeObserver:', error);
        }
      });
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTo({
        top: chatAreaRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [bodyText, headerText, footerText, selectedMediaFile, templateButtons]);

  const mobilePadding = 30;

  const whiteContentDiv = (
    <div className='flex flex-col flex-grow rounded-[14px] -m-px'
      style={{
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        width: `${baseWidth - (showMobile ? mobilePadding * 2 : 0)}px`
      }}
    >
      {showTopBar && (
        <div className='w-full max-h-[35px] h-full bg-gray-900 rounded-t-[14px] flex items-center justify-between px-[16px] text-white'>
          <span className="text-[14.5px] font-semibold">9:41</span>
          <div className="flex items-center space-x-[4px]">
            <Wifi size={17} />
            <Battery size={17} fill="white" />
          </div>
        </div>
      )}

      {mode === 'chat' && (
        <>
          <div className={`w-full max-h-[72px] h-full bg-white -mt-px flex items-center justify-between px-[16px] ${!showTopBar ? 'rounded-t-[14px]' : ''}`} style={{ boxShadow: 'inset 0 -3px 0 0 #e6e6e6' }}>
            <div className="flex items-center">
              <ArrowLeft size={24}/>
              <img src={profilePfpUrl} className="ml-[10px] mr-[9px] w-[40px] h-[40px] bg-gray-300 rounded-full object-cover" alt="Profile Picture" />
              <div className="flex flex-col">
                <span className="text-[19px] font-semibold truncate w-[230px]">{profileName}</span>
                <span className="text-[15px] mt-[-3.5px] truncate w-[230px]">{profileSubText}</span>
              </div>
            </div>
            <MoreVertical size={24} />
          </div>
          <div 
            ref={chatAreaRef}
            className={`w-full h-full bg-[#ECE5DD] -mt-px px-[17px] overflow-y-auto overflow-x-hidden flex flex-col scrollbar-hide ${!showBottomBar ? 'rounded-b-[14px]' : ''}`}
          >
            {showPlaceholderMessageInTemplate && (
              <>
                <div className="flex-1 min-h-0 pb-[16px]"></div>
                <div className="relative flex justify-start flex-shrink-0">
                  <div className="absolute w-[25px] h-[30px] left-[-10px] top-[0px] bg-white" style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}></div>       
                  <div className="z-10 bg-white rounded-[16px] px-[12px] py-[8px] max-w-[300px] shadow-sm overflow-hidden">
                    {selectedMediaFile && (
                      <div className="mb-[8px] mt-[4px]">
                        {typeof selectedMediaFile === 'string' ? (
                          <img
                            src={selectedMediaFile}
                            alt="Media preview"
                            className="max-w-full h-auto rounded max-h-[192px] object-cover"
                          />
                        ) : selectedMediaFile.type.startsWith('image/') ? (
                          <img
                            src={URL.createObjectURL(selectedMediaFile)}
                            alt="Media preview"
                            className="max-w-full h-auto rounded max-h-[192px] object-cover"
                          />
                        ) : selectedMediaFile.type.startsWith('video/') ? (
                          <video
                            src={URL.createObjectURL(selectedMediaFile)}
                            className="max-w-full h-auto rounded max-h-[192px] object-cover"
                            controls
                          />
                        ) : (
                          <div className="flex items-center gap-[8px] p-[8px] bg-[#F0F0F0] rounded">
                            <FileText size={20} className="text-[#666666]" />
                            <div className="flex-1 min-w-0">
                              <p className="text-[12px] font-medium text-[#111B21] truncate">{selectedMediaFile.name}</p>
                              <p className="text-[12px] text-[#666666]">({(selectedMediaFile.size / 1024).toFixed(1)}KB)</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    <div className='flex flex-col space-y-[6px]'>
                      {headerText && (
                        <div>
                          <p className="text-[19px] font-semibold text-[#111B21] leading-relaxed whitespace-pre-wrap break-words overflow-wrap-anywhere">
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

                      {bodyText && (
                        <p className="leading-[25px] text-[18px] text-[#111B21] leading-relaxed whitespace-pre-wrap break-words overflow-wrap-anywhere">
                          {formatTextWithVariables(bodyText)}
                        </p>
                      )}

                      {footerText && (
                        <p className="text-[16.5px] text-[#666666] leading-relaxed whitespace-pre-wrap break-words overflow-wrap-anywhere">
                          {footerText}
                        </p>
                      )}
      
                    </div>

                    {!hasContent && (
                      <p className="text-[17.5px] text-[#999999] italic">
                        {placeholderText}
                      </p>
                    )}

                    <div className='flex w-full justify-end gap-[2px]'>
                      <p className="text-[14px] text-[#999999] font-medium">9:41 AM</p>
                      <MdDoneAll size={22} fill='#999999'/>
                    </div>

                    {templateButtons.length > 0 && (
                      <div className="mt-[2px] space-y-[4px]">
                        {templateButtons.slice(0, 3).map((button) => (
                          <>
                            <div className="w-[calc(100% + 24px)] -mx-[12px]" style={{borderTopWidth: "2px", borderTopColor: "#e7e7e7ff"}}></div>
                            <div key={button.id} className="px-[12px] py-[8px] text-center">
                              <p className="text-[18px] text-[#0064FF] font-normal break-words">
                                {getButtonDisplayText(button)}
                              </p>
                            </div>
                          </>
                        ))}
                        {templateButtons.length > 3 && (
                          <>
                            <div className="w-[calc(100% + 24px)] -mx-[12px]" style={{borderTopWidth: "2px", borderTopColor: "#e7e7e7ff"}}></div>
                            <div className="px-[12px] py-[8px] text-center">
                              <Play size={14} className="text-[#0064FF]" />
                              <p className="text-[18px] text-[#0064FF] font-normal">See all options</p>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          <div className="bg-[#ECE5DD] -mt-[2px] w-full flex items-end pt-[12px] pb-[10px] px-[8px]">
            <div className="flex-1 bg-white w-full rounded-[24px] flex flex-col items-center">
              <div className="w-full">
                {icebreakers.length > 0 && icebreakers.some(icebreaker => icebreaker.trim() !== "") && (
                  <div className="pt-[12px] pb-[4px] pl-[12px] pr-[16px] max-h-[500px] overflow-y-auto"
                  style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                  }}>
                    {icebreakers.filter(icebreaker => icebreaker.trim() !== "").map((icebreaker, index) => (
                      <div key={index} className='flex justify-between items-center '>
                        <div className="p-[8px] text-gray-700 text-[18px] break-all">
                          {icebreaker}
                        </div>
                        <div className='h-[22px] w-[22px]'>
                          <MdSend size={22} fill='#36AD60'/>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {commands.length > 0  && commands.some(commands => commands.commandText.trim() !== "") && (
                  <div className="pt-[10px] pb-[4px] pl-[5px] pr-[16px] max-h-[500px] overflow-y-auto"
                  style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                  }}>
                    {commands.map((command, index) => (
                      <>
                        { command.commandText.trim() !== "" && (
                          <div key={index} className="flex items-start p-[8px] bg-gray-100">
                            <img src={profilePfpUrl} className="w-[28px] mr-[10px] h-[28px] bg-gray-300 rounded-full object-cover" alt="Profile Picture" />
                            <div className="flex flex-col">
                              <span className="text-[16px] font-semibold text-[#111B21] break-all">{command.commandText}</span>
                              <span className="text-[14.5px] text-[#666666] break-all">{command.commandDescription}</span>
                            </div>
                          </div>
                        )}
                      </>
                    ))}
                  </div>
                )}
              </div>
              <div className="w-full min-h-[50px] flex items-center px-[15px]">
                <Smile size={25} className="text-gray-500" />
                <input
                  type="text"
                  placeholder={commands.length > 0 ? "\\" : "Message"}
                  className={`flex-1 bg-transparent outline-none px-[10px] placeholder:text-[19px] ${commands.length > 0 ? 'placeholder:text-[#111B21]' : 'placeholder:text-gray-500'}`}
                  disabled
                />
                <MdAttachFile size={25} className="text-gray-500" />
                <Camera size={24} className="text-gray-500 ml-[10px]" />
              </div>
            </div>
            <button className="flex items-center justify-center h-[50px] w-[50px] ml-[8px] bg-[#36AD60] rounded-full">
              <MdMic color='white' size={28} />
            </button>
          </div>
        </>
      )}

      {mode === 'profile' && (
        <>
          <div className={`w-full max-h-[72px] h-full bg-white -mt-px flex items-center justify-between px-[16px] ${!showTopBar ? 'rounded-t-[14px]' : ''}`}>
            <ArrowLeft size={24}/>
            <MoreVertical size={24} />
          </div>
          <div className={`w-full h-full bg-white -mt-px px-[17px] overflow-y-auto overflow-x-hidden flex flex-col scrollbar-hide ${!showBottomBar ? 'rounded-b-[14px]' : ''}`}>
            {/* Profile Picture, Name, ~Phone Number, Share Button */}
            <div className="flex flex-col items-center text-center py-4">
              <img src={profilePfpUrl} className="w-24 h-24 rounded-full mb-2 object-cover" alt="Profile" />
              <h2 className="text-2xl font-bold">{profileName}</h2>
              {profilePhoneNumber && <p className="text-gray-500">{profilePhoneNumber}</p>}
              <button className="mt-2 px-4 py-2 text-blue-500 font-semibold rounded-lg">Share</button>
            </div>

            {/* Description, Category, Address, Email, Website*/}
            {(profileDescription || profileCategory || profileAddress || profileEmail || profileWebsite) && (
              <div className="py-4 border-t border-b">
                {profileDescription && <p className="text-gray-700 mb-2">{profileDescription}</p>}
                {profileCategory && <p className="text-gray-500 mb-2">{profileCategory}</p>}
                {profileAddress && <p className="text-gray-500 mb-2">{profileAddress}</p>}
                {profileEmail && <p className="text-blue-500 mb-2">{profileEmail}</p>}
                {profileWebsite && <p className="text-blue-500">{profileWebsite}</p>}
              </div>
            )}

            {/* About and phonenumber */}
            {(profileAbout || profilePhoneNumber) && (
              <div className="py-4 border-t border-b">
                {profileAbout && (
                  <div>
                    <h3 className="font-semibold mb-1">About</h3>
                    <p className="text-gray-700">{profileAbout}</p>
                  </div>
                )}
                {profilePhoneNumber && (
                  <div className="mt-2">
                    <h3 className="font-semibold mb-1">Phone Number</h3>
                    <p className="text-gray-700">{profilePhoneNumber}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}

      {showBottomBar && (
        <div className='z-20 w-full max-h-[55px] h-full bg-gray-900 rounded-b-[14px] -mt-px flex items-center justify-around text-white'>
          <ChevronLeft size={28} />
          <Circle size={20} />
          <Square size={20} />
        </div>
      )}
    </div>
  );

  return (
    <div ref={containerRef} className='w-full h-full flex items-center justify-center'>
      <div 
        ref={scaleWrapperRef} 
        style={{ width: `${baseWidth}px`, height: `${baseHeight}px`, transformOrigin: 'center center' }}
      >
        <div className='flex p-[0px] h-full w-full'>
          {showMobile ? (
            <div className={`flex flex-grow bg-black rounded-[24px]`} style={{padding: `${mobilePadding}px`}}>
              {whiteContentDiv}
            </div>
          ) : (
            whiteContentDiv
          )}
        </div>
      </div>
    </div>
  );
};

export default PreviewV2;


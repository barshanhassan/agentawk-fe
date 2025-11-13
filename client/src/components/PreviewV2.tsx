import React, { useRef, useEffect } from 'react';
import { ChevronLeft, Wifi, Battery, ArrowLeft, Square, Circle, MoreVertical } from 'react-feather';

type Mode = "template" | "profile";

interface PreviewV2Props {
  // Optional Template content
  // Optional Message Related
  headerText?: string;
  bodyText?: string;
  footerText?: string;
  selectedMediaFile?: File | null;
  templateButtons?: Array<any>;
  variableSamples?: Record<string, string>;
 
  // Optional Command related

  // Optional Ice Breaker content

  // Optional profile content

  mode?: Mode;
  showMobile?: boolean;
  showPlaceholderMessageInTemplate?: boolean
}

const PreviewV2: React.FC<PreviewV2Props> = ({
  headerText = "",
  bodyText = "",
  footerText = "",
  selectedMediaFile = null,
  templateButtons = [],
  variableSamples = {},
  showPlaceholderMessageInTemplate = true, 
  showMobile = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scaleWrapperRef = useRef<HTMLDivElement>(null);

  const baseWidth = 450;
  const baseHeight = 900;

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

  const whiteContentDiv = (
    <div className='flex flex-col flex-grow rounded-[14px] -m-px'>
      <div className='w-full h-[35px] bg-gray-900 rounded-t-[14px] flex items-center justify-between px-4 text-white'>
        <span className="text-sm font-semibold">9:41</span>
        <div className="flex items-center space-x-1">
          <Wifi size={16} />
          <Battery size={16} />
        </div>
      </div>
      <div className='w-full h-[68px] bg-white -mt-px flex items-center justify-between px-4'>
        <div className="flex items-center space-x-2">
          <ArrowLeft size={24} className="text-gray-600" />
          <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
          <div className="flex flex-col">
            <span className="text-base font-semibold text-gray-800">Name</span>
            <span className="text-xs text-gray-500">Chat Support</span>
          </div>
        </div>
        <MoreVertical size={24} className="text-gray-600" />
      </div>
      <div className='w-full h-full bg-green-500 -mt-px'>
        
      </div>
      <div className='w-full h-[55px] bg-gray-900 rounded-b-[14px] -mt-px flex items-center justify-around text-white'>
        <ChevronLeft size={28} />
        <Circle size={20} />
        <Square size={20} />
      </div>
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
            <div className='flex flex-grow bg-black rounded-[24px] p-[28px]'>
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

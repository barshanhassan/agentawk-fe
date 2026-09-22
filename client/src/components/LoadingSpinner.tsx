// App-wide default loading indicator — small AgentAwk bot with a spinning
// ring around it. Use this wherever a page/section shows a loading state
// instead of a bare Loader2 spin, so loading looks the same everywhere.
export default function LoadingSpinner({
  size = 56,
  fullScreen = false,
  className = "",
}: {
  size?: number;
  fullScreen?: boolean;
  className?: string;
}) {
  const spinner = (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <div className="absolute inset-0 rounded-full border-[3px] border-primary/20 border-t-primary animate-spin" />
      <img src="/images/agentawk-bot-green.svg" alt="" className="w-[43%] h-[43%]" />
    </div>
  );

  if (!fullScreen) return <div className={className}>{spinner}</div>;

  return (
    <div className={`flex items-center justify-center w-full h-full py-12 ${className}`}>
      {spinner}
    </div>
  );
}

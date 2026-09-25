import { useEffect, useRef, useState } from "react";

interface PreviewProps {
  curlString: string;
}

function Preview({ curlString }: PreviewProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const hideTimer = useRef<number | undefined>(undefined);
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    });
  }, [curlString]);

  useEffect(() => () => window.clearTimeout(hideTimer.current), []);

  const showCopied = () => {
    setIsNotificationVisible(true);
    window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(
      () => setIsNotificationVisible(false),
      2500,
    );
  };

  const handleCopyButtonClick = async () => {
    try {
      await navigator.clipboard.writeText(curlString);
      showCopied();
    } catch {
      // Clipboard API unavailable (e.g. insecure context); nothing to copy.
    }
  };

  if (!curlString) return null;

  return (
    <div
      ref={scrollRef}
      className="mt-4 h-full max-w-full flex-1 justify-center"
    >
      <div className="mockup-code">
        <pre>
          <code>{curlString}</code>
        </pre>
      </div>
      <div className="mt-2 flex items-center justify-end space-x-2 text-success">
        {isNotificationVisible && (
          <h1 className="text-sm font-bold tracking-wide">Copied!</h1>
        )}
        <button className="btn btn-sm" onClick={handleCopyButtonClick}>
          Copy
        </button>
      </div>
    </div>
  );
}

export default Preview;

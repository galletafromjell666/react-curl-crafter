import { useTimeoutFn } from "react-use";
import { isEmpty } from "lodash";
import { useCurlString } from "../../store/crafterStore";
import { useState } from "react";

function Preview() {
  const curlString = useCurlString();

  const [isNotificationVisible, setIsNotificationVisible] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_isReady, _cancel, reset] = useTimeoutFn(() => {
    setIsNotificationVisible(false);
  }, 2500);

  const triggerTimeout = () => {
    setIsNotificationVisible(true);
    reset();
  };

  const handleCopyButtonClick = () => {
    triggerTimeout();
    navigator.clipboard.writeText(curlString);
  };

  if (isEmpty(curlString)) return null;

  return (
    <div className="mt-4 h-full max-w-full flex-1 justify-center">
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

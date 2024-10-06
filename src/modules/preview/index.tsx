import { isEmpty } from "lodash";
import { useCurlString } from "../../store/crafterStore";

function Preview() {
  const curlString = useCurlString();

  if (isEmpty(curlString)) return null;
  return (
    <div className="h-full flex-1 mt-4 justify-center  max-w-full">
      <div className="mockup-code">
        <pre>
          <code>{curlString}</code>
        </pre>
      </div>
    </div>
  );
}

export default Preview;

import { useCurlString } from "../../store/crafterStore";

function Preview() {
  const curlString = useCurlString();
  return (
    <div className="h-full flex-1 justify-center bg-base-200">
      <div className="mockup-code">
        <pre>
          <code>{curlString}</code>
        </pre>
      </div>
    </div>
  );
}

export default Preview;

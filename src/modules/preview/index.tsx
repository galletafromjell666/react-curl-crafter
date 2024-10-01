import { useCurlString } from "../../store/crafterStore";

function Preview() {
  const curlString = useCurlString();
  return (
    <div className="h-full flex-1 justify-center bg-base-200">
      <div className="mockup-code">
        <code>{curlString}</code>
      </div>
    </div>
  );
}

export default Preview;

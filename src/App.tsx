import { useState } from "react";
import Form from "./modules/form";
import Preview from "./modules/preview";

function App() {
  const [curlString, setCurlString] = useState("");

  return (
    <div className="m-1 flex flex-col gap-y-4 bg-base-100 md:m-4 md:gap-y-0">
      <Form onCraft={setCurlString} />
      <Preview curlString={curlString} />
    </div>
  );
}

export default App;

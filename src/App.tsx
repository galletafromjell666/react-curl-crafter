import Form from "./modules/form";
import Preview from "./modules/preview";

function App() {
  return (
    <div className="m-4 flex flex-col gap-y-4 bg-base-100  md:gap-y-0">
      <Form />
      <Preview />
    </div>
  );
}

export default App;

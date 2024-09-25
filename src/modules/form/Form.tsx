import { useForm } from "react-hook-form";
import Logo from "./components/Logo";

function Form() {
  const { register, watch } = useForm();

  const watchAllFields = watch();
  console.log(watchAllFields);
  return (
    <div className="flex-1">
      <Logo />
      <div
        data-test-id="url-section"
        className="m-4 flex flex-col gap-y-2 rounded-xl border-2 border-base-content/10 p-2"
      >
        <label htmlFor="url">URL</label>
        <input
          id="url"
          {...register("url")}
          type="text"
          placeholder="http://127.0.0.1:8080/test"
          className="input input-bordered w-full"
        />
      </div>
      <div
        data-test-id="url-section"
        className="m-4 flex flex-col gap-y-2 rounded-xl border-2 border-base-content/10 p-2"
      >
        <h2>Headers</h2>
        <div className="flex flex-row items-center gap-x-2">
          <input
            id="header_1_key"
            {...register("header_1_key")}
            type="text"
            placeholder="Header key"
            className="input input-bordered w-full max-w-xs"
          />
          <input
            id="header_1_value"
            {...register("header_1_value")}
            type="text"
            placeholder="Header value"
            className="input input-bordered w-full max-w-xs"
          />
          <button className="btn btn-outline btn-warning btn-sm">Remove</button>
        </div>
        <button className="btn btn-outline btn-sm w-2/5 mx-auto">Add</button>
      </div>
      <div
        data-test-id="url-section"
        className="m-4 flex flex-col gap-y-2 rounded-xl border-2 border-base-content/10 p-2"
      >
        <h2>Data</h2>
        <div className="flex flex-col items-start gap-y-2">
          <textarea
            className="textarea textarea-bordered w-full resize-none h-[200px]"
            id="data"
            {...register("data")}
          />
          <button className="btn btn-outline btn-sm">Format</button>
        </div>
      </div>
      <div className="flex justify-center">
        <button className="btn btn-outline w-3/5">Craft!</button>
      </div>
    </div>
  );
}

export default Form;

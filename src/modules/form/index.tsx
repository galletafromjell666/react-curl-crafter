import React, { useCallback } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import Logo from "./components/Logo";

function Form() {
  const { register, handleSubmit, control } = useForm({
    defaultValues: {
      headers: [{ key: "X-AUTH-TOKEN", value: "" }],
      url: "",
      data: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "headers",
    control,
  });

  // const watchAllFields = watch();
  // console.log(watchAllFields);

  const onAddHeader = useCallback(() => {
    append({ key: "", value: "" });
  }, [append]);

  const onRemoveHeader = useCallback(
    (index: number) => {
      remove(index);
    },
    [remove],
  );

  const onSubmit: SubmitHandler<any> = (data) => console.log("submit", data);

  return (
    <div className="flex-1">
      <Logo />
      <form onSubmit={handleSubmit(onSubmit)}>
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
          <div className="flex flex-col gap-y-2">
            {fields.map((field, index) => {
              return (
                <div
                  className="flex flex-row items-center gap-x-2"
                  key={field.id}
                >
                  <input
                    id="header_1_key"
                    {...register(`headers.${index}.key` as const)}
                    type="text"
                    placeholder="Header key"
                    className="input input-bordered w-full max-w-xs"
                  />
                  <input
                    id="header_1_value"
                    {...register(`headers.${index}.value` as const)}
                    type="text"
                    placeholder="Header value"
                    className="input input-bordered w-full max-w-xs"
                  />
                  <button
                    onClick={() => onRemoveHeader(index)}
                    className="btn btn-outline btn-warning btn-sm"
                  >
                    Remove
                  </button>
                </div>
              );
            })}
          </div>
          <button
            className="btn btn-outline btn-sm mx-auto w-2/5"
            onClick={onAddHeader}
          >
            Add
          </button>
        </div>
        <div
          data-test-id="url-section"
          className="m-4 flex flex-col gap-y-2 rounded-xl border-2 border-base-content/10 p-2"
        >
          <h2>Data</h2>
          <div className="flex flex-col items-start gap-y-2">
            <textarea
              className="textarea textarea-bordered h-[200px] w-full resize-none"
              id="data"
              {...register("data")}
            />
            <button className="btn btn-outline btn-sm">Format</button>
          </div>
        </div>
        <div className="flex justify-center">
          <button className="btn btn-outline w-3/5">Craft!</button>
        </div>
      </form>
    </div>
  );
}

export default Form;

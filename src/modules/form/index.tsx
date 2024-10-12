import { useCallback, useMemo, useState } from "react";
import clsx from "clsx";
import {
  SubmitHandler,
  useFieldArray,
  useForm,
  useFormState,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Logo from "./components/Logo";
import { getFormattedData } from "../../utils";
import { craftCurl } from "../crafter";
import { useSetCurlString } from "../../store/crafterStore";
import { formSchema } from "./resolvers";
import { FormState, Methods } from "../../types";
import { isEmpty } from "lodash";

const availableMethods: Methods[] = ["GET", "DELETE", "PUT", "POST", "PATCH"];

function Form() {
  const setCurlString = useSetCurlString();
  const [isFormatDataError, setIsFormatDataError] = useState(false);

  const { register, handleSubmit, control, setValue, getValues, watch } =
    useForm<FormState>({
      mode: "onBlur",
      defaultValues: {
        method: availableMethods[0],
        headers: [{ key: "X-Auth-Token", value: "" }],
        url: "",
        data: "",
      },
      resolver: zodResolver(formSchema),
    });

  const { isValid } = useFormState({
    control,
  });

  const [method] = watch(["method"]);

  const { fields, append, remove } = useFieldArray({
    name: "headers",
    control,
  });

  const onAddHeader = useCallback(() => {
    append({ key: "", value: "" });
  }, [append]);

  const onRemoveHeader = useCallback(
    (index: number) => {
      remove(index);
    },
    [remove],
  );

  const onFormatData = () => {
    const inputData = getValues("data");
    const { stringResult, isError } = getFormattedData(inputData ?? "");

    setValue("data", stringResult);
    setIsFormatDataError(isError);
  };

  const cleanMethods = useMemo(() => {
    return availableMethods.filter((m) => m !== method);
  }, [method]);

  const onSubmit: SubmitHandler<FormState> = (data) => {
    const value = craftCurl(data);
    console.log(value);
    if (!isEmpty(value.contentTypeHeader)) {
      append(value.contentTypeHeader);
    }
    setCurlString(value.curlString);
  };

  return (
    <div className="flex-1">
      <Logo />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mx-2 mt-2 flex flex-col items-center gap-x-4 gap-y-2 md:mx-4 md:mt-4 md:flex-row">
          <div className="flex w-full flex-col gap-y-2 rounded-xl border-2 border-base-content/10 p-2 md:w-auto">
            <label>Method</label>
            <div className="dropdown dropdown-bottom">
              <div tabIndex={0} role="button" className="btn m-1 w-32">
                {method}
              </div>
              <ul
                tabIndex={0}
                className="menu dropdown-content z-[1] w-52 rounded-box bg-base-100 p-2 shadow"
              >
                {cleanMethods.map((method, index) => {
                  return (
                    <li
                      key={index}
                      role="button"
                      onClick={() => {
                        setValue("method", method);
                      }}
                    >
                      <a>{method}</a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
          <div
            data-test-id="url-section"
            className="flex w-full flex-col gap-y-2 rounded-xl border-2 border-base-content/10 px-2 py-3 md:h-full md:flex-1"
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
        </div>
        <div
          data-test-id="url-section"
          className="m-2 flex flex-col gap-y-2 rounded-xl border-2 border-base-content/10 p-2 md:m-4"
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
                    {...register(`headers.${index}.key` as const)}
                    type="text"
                    placeholder="Header key"
                    className="input input-bordered w-full"
                  />
                  <input
                    {...register(`headers.${index}.value` as const)}
                    type="text"
                    placeholder="Header value"
                    className="input input-bordered w-full"
                  />
                  <button
                    type="button"
                    onClick={() => onRemoveHeader(index)}
                    className="btn btn-outline btn-warning btn-xs md:btn-sm"
                  >
                    Remove
                  </button>
                </div>
              );
            })}
          </div>
          <button
            type="button"
            className="btn btn-outline btn-sm mx-auto w-2/5"
            onClick={onAddHeader}
          >
            Add
          </button>
        </div>
        <div
          data-test-id="url-section"
          className="m-2 flex flex-col gap-y-2 rounded-xl border-2 border-base-content/10 p-2 md:m-4"
        >
          <h2>Data</h2>
          <div className="flex flex-col items-start gap-y-2">
            <textarea
              className={clsx(
                "textarea h-[200px] w-full resize-none",
                { "input-error": isFormatDataError },
                { "textarea-bordered": !isFormatDataError },
              )}
              id="data"
              {...register("data")}
            />
            <div className="flex items-center gap-x-2">
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={onFormatData}
              >
                Format
              </button>
              {isFormatDataError && (
                <h3 className="text-error">Unable to format data</h3>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className="btn btn-outline w-3/5"
            disabled={!isValid}
          >
            Craft!
          </button>
        </div>
      </form>
    </div>
  );
}

export default Form;

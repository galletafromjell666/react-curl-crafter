import fmt2json from "format-to-json";

export function getFormattedData(value: string) {
  const {
    result: stringResult,
    errFormat: isError,
    ...rest
  } = fmt2json(value, {
    withDetails: true,
    strict: true,
  });
  console.log("format:", { stringResult, isError, rest });
  return { stringResult, isError };
}

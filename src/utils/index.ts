import fmt2json from "format-to-json";

export function getFormattedData(value: string) {
  const { result: stringResult, errFormat: isError } = fmt2json(value, {
    withDetails: true,
    strict: true,
  });
  return { stringResult, isError };
}

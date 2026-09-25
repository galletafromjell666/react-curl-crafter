export function getFormattedData(value: string) {
  try {
    return {
      stringResult: JSON.stringify(JSON.parse(value), null, 2),
      isError: false,
    };
  } catch {
    return { stringResult: value, isError: true };
  }
}

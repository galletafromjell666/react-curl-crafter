import { isEmpty } from "lodash";
import { FormState, Header } from "../../types";

const NEW_LINE = "\n";
const TAB = "\t";
const CONTINUE_ON_NEW_LINE = ` \\${NEW_LINE}${TAB}`;

export function craftCurl(formState: FormState) {
  let curlString = `curl '${formState.url}'${CONTINUE_ON_NEW_LINE}-X '${formState.method}'`;
  const data = getData(formState);
  const headers = [...formState.headers];
  if (data) headers.push(data.contentHeader);
  const headersString = getHeadersString(headers);

  if (headers) curlString = curlString.concat(headersString);
  if (data?.stringData) curlString = curlString.concat(data.stringData);

  return curlString;
}

export function getHeadersString(headers: Header[]): string {
  if (isEmpty(headers)) return "";
  // not empty
  let headersString = "";
  headers.forEach((header) => {
    const headerString = `${CONTINUE_ON_NEW_LINE}-H '${header.key}: ${header.value}'`;
    headersString = headersString.concat(headerString);
  });
  return headersString;
}

export function getData(
  formState: FormState,
): { contentHeader: Header; stringData: string } | null {
  const { data } = formState;
  if (isEmpty(data)) return null;
  // Not empty
  let stringData = "";
  const contentHeader = { key: "Content-Type", value: "" };
  try {
    const jsonStringData = JSON.stringify(JSON.parse(data as string));
    stringData = stringData.concat("$", `'${jsonStringData}'`);
    contentHeader.value = "application/json";
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    stringData = data as string;
    contentHeader.value = "text/plain";
  }

  // Remove all whitespace and \r or \n characters
  let newStr = stringData.replace(/\\r|\\n/g, "").replace(/\s+/g, "");

  // Add the necessary prefix for CONTINUE_ON_NEW_LINE
  newStr = `${CONTINUE_ON_NEW_LINE}--data-raw ${newStr}`;

  return { contentHeader, stringData: newStr };
}

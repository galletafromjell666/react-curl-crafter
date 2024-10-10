import { isEmpty } from "lodash";
import { FormState, Header } from "../../types";

const NEW_LINE = "\n";
const TAB = "\t";
const CONTINUE_ON_NEW_LINE = ` \\${NEW_LINE}${TAB}`;

export function craftCurl(formState: FormState) {
  console.log(formState);
  let curlString = `curl '${formState.url}'${CONTINUE_ON_NEW_LINE}-X '${formState.method}'`;
  const isContentTypeHeaderOnFormState = verifyContentTypeHeader(
    formState.headers,
  );
  const data = getData(formState, !isContentTypeHeaderOnFormState);
  const headers = [...formState.headers];

  if (data && !verifyContentTypeHeader(headers)) {
    headers.push(data.contentHeader!);
  }

  console.log(headers, isContentTypeHeaderOnFormState);
  const headersString = getHeadersString(headers);

  if (headers) curlString = curlString.concat(headersString);
  if (data?.stringData) curlString = curlString.concat(data.stringData);

  const contentTypeHeader = !isContentTypeHeaderOnFormState
    ? data?.contentHeader
    : null;

  return { curlString, contentTypeHeader };
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
  createContentTypeHeader: boolean,
): { contentHeader: Header | null; stringData: string } | null {
  const { data } = formState;
  if (isEmpty(data)) return null;
  // Not empty
  let stringData = "";
  let contentHeader = null;
  try {
    const jsonStringData = JSON.stringify(JSON.parse(data as string));
    stringData = stringData.concat("$", `'${jsonStringData}'`);

    if (createContentTypeHeader) {
      contentHeader = { key: "Content-Type", value: "application/json" };
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    stringData = data as string;
    if (createContentTypeHeader) {
      contentHeader = { key: "Content-Type", value: "text/plain" };
    }
  }

  // Remove all whitespace and \r or \n characters
  let newStr = stringData.replace(/\\r|\\n/g, "").replace(/\s+/g, "");

  newStr = `${CONTINUE_ON_NEW_LINE}--data-raw ${newStr}`;

  return { contentHeader, stringData: newStr };
}

// checks if there is a content type header
export function verifyContentTypeHeader(headers: Header[]) {
  return headers.some(
    (h) => h.key.toLowerCase() === "Content-Type".toLowerCase(),
  );
}

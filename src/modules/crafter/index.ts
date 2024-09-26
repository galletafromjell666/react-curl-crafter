import { isEmpty } from "lodash";

interface Header {
  key: string;
  value: string;
}

interface JsonData {
  [key: string]: string;
}

interface FormState {
  url: string;
  method: "GET" | "DELETE" | "PUT" | "POST" | "PATCH";
  headers: Header[];
  data: JsonData | string;
}

const NEW_LINE = "\n";
const TAB = "\t";

export function craftCurl(formState: FormState) {
  let curlString = `curl '${formState.url}' \\${NEW_LINE}${TAB}-X '${formState.method}' \\${NEW_LINE}${TAB}`;
  // Add headers
  const headersString = getHeadersString(formState);
  curlString = curlString.concat(headersString);
  return curlString;
}

export function getHeadersString(formState: FormState): string {
  const { headers } = formState;
  if (isEmpty(headers)) return "";
  // not empty
  let headersString = "";
  headers.forEach((header) => {
    const headerString = `\\${NEW_LINE}${TAB}-H '${header.key}: ${header.value}'`;
    headersString = headersString.concat(headerString);
  });
  return headersString;
}

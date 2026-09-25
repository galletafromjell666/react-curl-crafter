import type { FormState, Header } from "../../types";

const NEW_LINE = "\n";
const TAB = "\t";
const CONTINUE_ON_NEW_LINE = ` \\${NEW_LINE}${TAB}`;
const CONTENT_TYPE_HEADER_KEY = "Content-Type";

export function craftCurl(formState: FormState): string {
  const hasContentTypeHeader = verifyContentTypeHeader(formState.headers);
  const data = getData(formState, !hasContentTypeHeader);

  const headers = data?.contentHeader
    ? [...formState.headers, data.contentHeader]
    : formState.headers;

  let curlString = `curl '${formState.url}'${CONTINUE_ON_NEW_LINE}-X '${formState.method}'`;
  curlString += getHeadersString(headers);
  if (data?.stringData) curlString += data.stringData;

  return curlString;
}

export function getHeadersString(headers: Header[]): string {
  let headersString = "";
  headers.forEach((header) => {
    headersString += `${CONTINUE_ON_NEW_LINE}-H '${header.key}: ${header.value}'`;
  });
  return headersString;
}

export function getData(
  formState: FormState,
  createContentTypeHeader: boolean,
): { contentHeader: Header | null; stringData: string } | null {
  const { data } = formState;
  if (!data) return null;

  let body: string;
  let contentHeader: Header | null = null;

  try {
    // Compact JSON is already a single line; only escape single quotes so the
    // shell-quoted argument survives intact.
    const json = JSON.stringify(JSON.parse(data)).replace(/'/g, "\\'");
    body = `$'${json}'`;
    if (createContentTypeHeader) {
      contentHeader = {
        key: CONTENT_TYPE_HEADER_KEY,
        value: "application/json",
      };
    }
  } catch {
    body = `'${data.replace(/'/g, "'\\''")}'`;
    if (createContentTypeHeader) {
      contentHeader = { key: CONTENT_TYPE_HEADER_KEY, value: "text/plain" };
    }
  }

  return {
    contentHeader,
    stringData: `${CONTINUE_ON_NEW_LINE}--data-raw ${body}`,
  };
}

// checks if there is a content type header
export function verifyContentTypeHeader(headers: Header[]): boolean {
  return headers.some(
    (h) => h.key.toLowerCase() === CONTENT_TYPE_HEADER_KEY.toLowerCase(),
  );
}

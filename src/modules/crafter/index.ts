import type { FormState, Header } from "../../types";

const CONTINUE_ON_NEW_LINE = " \\\n\t";
const CONTENT_TYPE_HEADER_KEY = "Content-Type";

// POSIX-safe single-quote wrapping: close, emit an escaped quote, reopen.
// Keeps an argument one shell token, whatever it contains.
const shQuote = (value: string) => `'${value.replace(/'/g, "'\\''")}'`;

function parseBody(data: string): { body: string; contentType: string } {
  try {
    // Compact JSON so the command stays on a single line.
    return {
      body: JSON.stringify(JSON.parse(data)),
      contentType: "application/json",
    };
  } catch {
    return { body: data, contentType: "text/plain" };
  }
}

export function craftCurl(formState: FormState): string {
  const parts = [
    `curl ${shQuote(formState.url)}`,
    `-X ${shQuote(formState.method)}`,
  ];

  for (const header of formState.headers) {
    parts.push(`-H ${shQuote(`${header.key}: ${header.value}`)}`);
  }

  if (formState.data) {
    const { body, contentType } = parseBody(formState.data);
    if (!verifyContentTypeHeader(formState.headers)) {
      parts.push(`-H ${shQuote(`${CONTENT_TYPE_HEADER_KEY}: ${contentType}`)}`);
    }
    parts.push(`--data-raw ${shQuote(body)}`);
  }

  return parts.join(CONTINUE_ON_NEW_LINE);
}

// checks if there is a content type header
export function verifyContentTypeHeader(headers: Header[]): boolean {
  return headers.some(
    (h) => h.key.toLowerCase() === CONTENT_TYPE_HEADER_KEY.toLowerCase(),
  );
}

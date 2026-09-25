import { test } from "node:test";
import assert from "node:assert/strict";
import { craftCurl } from "./index.ts";
import type { FormState } from "../../types.ts";

const form = (over: Partial<FormState>): FormState => ({
  method: "POST",
  url: "http://127.0.0.1:8080/test",
  headers: [],
  data: "",
  ...over,
});

test("crafts method, url and headers", () => {
  const curl = craftCurl(
    form({ headers: [{ key: "X-Auth-Token", value: "abc" }] }),
  );
  assert.ok(curl.startsWith("curl 'http://127.0.0.1:8080/test'"));
  assert.ok(curl.includes("-X 'POST'"));
  assert.ok(curl.includes("-H 'X-Auth-Token: abc'"));
});

test("adds a JSON content-type and keeps the payload intact", () => {
  const curl = craftCurl(form({ data: '{"name":"John Doe"}' }));
  assert.ok(curl.includes("-H 'Content-Type: application/json'"));
  assert.ok(curl.includes(`--data-raw '{"name":"John Doe"}'`));
});

test("adds a text/plain content-type for non-JSON data", () => {
  const curl = craftCurl(form({ data: "name=John Doe" }));
  assert.ok(curl.includes("-H 'Content-Type: text/plain'"));
  assert.ok(curl.includes("--data-raw 'name=John Doe'"));
});

test("escapes single quotes in the payload", () => {
  const curl = craftCurl(form({ data: "it's fine" }));
  assert.ok(curl.includes("--data-raw 'it'\\''s fine'"));
});

test("escapes single quotes in the url and header values", () => {
  const curl = craftCurl(
    form({
      url: "http://x/it's",
      headers: [{ key: "X-Name", value: "O'Brien" }],
    }),
  );
  assert.ok(curl.includes("'http://x/it'\\''s'"));
  assert.ok(curl.includes("-H 'X-Name: O'\\''Brien'"));
});

test("does not add a second content-type when one is provided", () => {
  const curl = craftCurl(
    form({
      headers: [{ key: "content-type", value: "application/xml" }],
      data: "<a/>",
    }),
  );
  assert.equal(curl.match(/Content-Type/gi)?.length, 1);
  assert.ok(curl.includes("-H 'content-type: application/xml'"));
});

test("omits data and content-type when there is no data", () => {
  const curl = craftCurl(form({}));
  assert.ok(!curl.includes("--data-raw"));
  assert.ok(!curl.includes("Content-Type"));
});

import { test } from "node:test";
import assert from "node:assert/strict";
import { craftCurl, getData } from "./index.ts";
import type { FormState } from "../../types.ts";

const form = (over: Partial<FormState>): FormState => ({
  method: "POST",
  url: "http://127.0.0.1:8080/test",
  headers: [],
  data: "",
  ...over,
});

test("getData does not strip spaces inside JSON string values", () => {
  const out = getData(form({ data: '{"name":"John Doe"}' }), true);
  assert.ok(out);
  assert.ok(out.stringData.includes(`--data-raw $'{"name":"John Doe"}'`));
  assert.equal(out.contentHeader?.value, "application/json");
});

test("getData keeps and shell-quotes non-JSON bodies", () => {
  const out = getData(form({ data: "name=John Doe" }), true);
  assert.ok(out);
  assert.ok(out.stringData.includes("--data-raw 'name=John Doe'"));
  assert.equal(out.contentHeader?.value, "text/plain");
});

test("getData escapes single quotes in non-JSON bodies", () => {
  const out = getData(form({ data: "it's fine" }), true);
  assert.ok(out);
  assert.ok(out.stringData.includes("--data-raw 'it'\\''s fine'"));
});

test("craftCurl emits method, headers, content-type and intact data", () => {
  const curl = craftCurl(
    form({
      headers: [{ key: "X-Auth-Token", value: "abc" }],
      data: '{"name":"John Doe"}',
    }),
  );
  assert.ok(curl.includes(`-X 'POST'`));
  assert.ok(curl.includes(`-H 'X-Auth-Token: abc'`));
  assert.ok(curl.includes("Content-Type: application/json"));
  assert.ok(curl.includes(`--data-raw $'{"name":"John Doe"}'`));
});

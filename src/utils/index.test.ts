import { test } from "node:test";
import assert from "node:assert/strict";
import { getFormattedData } from "./index.ts";

test("getFormattedData pretty-prints valid JSON without dropping content", () => {
  const { stringResult, isError } = getFormattedData('{"name":"John Doe"}');
  assert.equal(isError, false);
  assert.ok(stringResult.includes(`"John Doe"`));
  assert.ok(stringResult.includes("\n"));
});

test("getFormattedData reports invalid JSON and keeps the input unchanged", () => {
  const { stringResult, isError } = getFormattedData("{bad");
  assert.equal(isError, true);
  assert.equal(stringResult, "{bad");
});

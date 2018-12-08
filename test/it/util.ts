import { assert } from "chai";
import * as fs from "fs";

function assertContent(actualStr: string, expectedStr: string) {

  const actual: string[] = actualStr.split("\n");
  const expected: string[] = expectedStr.split("\n");

  for (let i = 0; i < expected.length; i++) {
    const expectedLine = expected[i].trim();
    const actualLine = actual[i].trim();
    assert.isTrue(actualLine.indexOf(expectedLine) !== -1,
      "Unexpected output on line '" + i + "'. Expected: '" +
      expectedLine + "' to be contained in '" + actualLine + "'");
  }
  assert.equal(actual.length, expected.length, "actual and expected differ in length");
}

export function assertOutput(actual: string, filePath: string) {

  let expected = "";
  try {
    expected = fs.readFileSync(filePath, "utf-8");
    assertContent(cleanup(actual, true), cleanup(expected, true));
  } catch (e) {
    console.log("\nerror while testing " + filePath.replace(__dirname, ""));
    console.log("\n" + e.toString());
    console.log("\n<<<<< expected\n" + cleanup(expected));
    console.log("\n>>>>> actual\n" + cleanup(actual) + "=====");
    throw e;
  }
}

const ELIMINATE_LINE = "__mts_eliminate_line__";

export function cleanup(str: string, eliminateAllEmptyLines = false): string {

  // clean up times
  let result = str.replace(/\s*[(][\d]+[^)]+[)]/g, "");
  // clean up paths
  result = result.replace(/\s*[(][/][^)]+[)]/g, "");
  // clean up call stacks
  result = result.replace(/^\s*at\s<.+>.*/mg, ELIMINATE_LINE);
  result = result.replace(/^\s*at\s.+[^:]+:[^:]+:[\d]+/mg, ELIMINATE_LINE);
  result = result.replace(/^\s*at\s.+[(][^:]+:[^:]+:[^)]+[)]/mg, ELIMINATE_LINE);
  result = result.replace(/^\s*at\s.+[\[]as\s+[^\]]+[\]].*/mg, ELIMINATE_LINE);
  // clean up calls
  result = result.replace(/>\s.+/g, ELIMINATE_LINE);
  // clean up extraneous other stuff
  result = result.replace(/^\s*[+] expected - actual/mg, ELIMINATE_LINE);
  result = result.replace(/^\s*[-](actual|to fail|false|true)$/mg, ELIMINATE_LINE);
  result = result.replace(/^\s*[+](expected|false|true)$/mg, ELIMINATE_LINE);
  // clean up stderr related stuff
  result = result.replace(/^([/][^/]+)+:\d+$/mg, ELIMINATE_LINE);
  result = result.replace(/^\s*throw new/mg, ELIMINATE_LINE);
  result = result.replace(/^\s*[\^]/mg, ELIMINATE_LINE);
  // cleanup npm bailing out something that we already know
  result = result.replace("npm ERR! Test failed.  See above for more details.", ELIMINATE_LINE);

  // there are spurious typescript remnants when running suite.inheritance.suite.ts
  // somehow nyc seems to inject these into the output, at least they only occur in that context
  // we might want to further investigate this in the future
  result = result.replace(/^import.*$/mg, ELIMINATE_LINE);
  // this is a new one: const globalTestFunctions: TestFunctions = {
  result = result.replace(/^const globalTestFunctions: TestFunctions = .*$/mg, ELIMINATE_LINE);

  // and some more win32 specialities
  result = result.replace(/^C:.*$/mg, ELIMINATE_LINE);

  return trimEmptyLines(result, eliminateAllEmptyLines);
}

function trimEmptyLines(str: string, eliminateAll = false): string {

  const collected: string[] = [];
  const lines = str.split("\n");
  let emptyLinesCount = 0;
  for (const line of lines) {
    if (line.trim() === "" || line.indexOf(ELIMINATE_LINE) !== -1) {
      emptyLinesCount++;
      continue;
    }
    if (emptyLinesCount && !eliminateAll) {
      collected.push("");
    }
    emptyLinesCount = 0;
    collected.push(line);
  }

  return collected.join("\n");
}

export function quotedString(str: string): string {

  return `"${str}"`;
}

export function win32fixes(str: string): string {

  return str.replace(/√/mg, "✓");
}

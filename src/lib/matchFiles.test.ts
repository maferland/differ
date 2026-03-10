import { describe, it, expect } from "vitest";
import { matchFiles, makePairId } from "./matchFiles";
import { ImageFile } from "./types";

function makeFile(name: string, side: "left" | "right" = "left"): ImageFile {
  const normalizedName = name
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[\s_-]+/g, "");
  return {
    name,
    normalizedName,
    path: `/${side}/${name}`,
    objectUrl: `asset:///${side}/${name}`,
  };
}

describe("makePairId", () => {
  it("joins names with double underscore", () => {
    expect(makePairId("a.png", "b.png")).toBe("a.png__b.png");
  });
});

describe("matchFiles", () => {
  it("matches files with exact same name", () => {
    const left = [makeFile("screenshot.png", "left")];
    const right = [makeFile("screenshot.png", "right")];
    const { pairs, unmatched } = matchFiles(left, right);

    expect(pairs).toHaveLength(1);
    expect(pairs[0].left.name).toBe("screenshot.png");
    expect(pairs[0].right.name).toBe("screenshot.png");
    expect(pairs[0].id).toBe("screenshot.png__screenshot.png");
    expect(unmatched).toHaveLength(0);
  });

  it("matches files with normalized names (case, separators)", () => {
    const left = [makeFile("My-Screenshot.png", "left")];
    const right = [makeFile("my_screenshot.png", "right")];
    const { pairs, unmatched } = matchFiles(left, right);

    expect(pairs).toHaveLength(1);
    expect(unmatched).toHaveLength(0);
  });

  it("reports unmatched files on both sides", () => {
    const left = [makeFile("only-left.png", "left")];
    const right = [makeFile("only-right.png", "right")];
    const { pairs, unmatched } = matchFiles(left, right);

    expect(pairs).toHaveLength(0);
    expect(unmatched).toHaveLength(2);
    expect(unmatched[0]).toEqual({ side: "left", file: left[0] });
    expect(unmatched[1]).toEqual({ side: "right", file: right[0] });
  });

  it("handles empty inputs", () => {
    expect(matchFiles([], []).pairs).toHaveLength(0);
    expect(matchFiles([], []).unmatched).toHaveLength(0);
    expect(matchFiles([makeFile("a.png")], []).unmatched).toHaveLength(1);
    expect(matchFiles([], [makeFile("b.png")]).unmatched).toHaveLength(1);
  });

  it("handles mixed matched and unmatched", () => {
    const left = [makeFile("a.png", "left"), makeFile("b.png", "left")];
    const right = [makeFile("a.png", "right"), makeFile("c.png", "right")];
    const { pairs, unmatched } = matchFiles(left, right);

    expect(pairs).toHaveLength(1);
    expect(pairs[0].left.name).toBe("a.png");
    expect(unmatched).toHaveLength(2);
    expect(unmatched.find((u) => u.file.name === "b.png")?.side).toBe("left");
    expect(unmatched.find((u) => u.file.name === "c.png")?.side).toBe("right");
  });
});

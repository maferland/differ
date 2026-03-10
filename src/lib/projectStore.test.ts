import { describe, it, expect, beforeEach } from "vitest";
import {
  saveProject,
  getProject,
  listProjects,
  deleteProject,
  saveSession,
  getSession,
  clearSession,
} from "./projectStore";

beforeEach(() => {
  localStorage.clear();
});

describe("project CRUD", () => {
  it("saves and retrieves a project", () => {
    saveProject("test", "/left", "/right");
    const project = getProject("test");

    expect(project).not.toBeNull();
    expect(project!.name).toBe("test");
    expect(project!.leftPath).toBe("/left");
    expect(project!.rightPath).toBe("/right");
  });

  it("lists projects sorted by creation date (newest first)", () => {
    saveProject("old", "/a", "/b");
    saveProject("new", "/c", "/d");
    const projects = listProjects();

    expect(projects).toHaveLength(2);
    expect(projects[0].name).toBe("new");
    expect(projects[1].name).toBe("old");
  });

  it("overwrites existing project with same name", () => {
    saveProject("test", "/old-left", "/old-right");
    saveProject("test", "/new-left", "/new-right");

    expect(listProjects()).toHaveLength(1);
    expect(getProject("test")!.leftPath).toBe("/new-left");
  });

  it("deletes a project", () => {
    saveProject("test", "/left", "/right");
    deleteProject("test");

    expect(getProject("test")).toBeNull();
    expect(listProjects()).toHaveLength(0);
  });

  it("returns null for non-existent project", () => {
    expect(getProject("nope")).toBeNull();
  });
});

describe("session", () => {
  it("saves and restores session", () => {
    const state = {
      projectName: "test",
      leftPath: "/left",
      rightPath: "/right",
      activePairIndex: 2,
      mode: "pixel-diff" as const,
    };
    saveSession(state);
    expect(getSession()).toEqual(state);
  });

  it("returns null when no session exists", () => {
    expect(getSession()).toBeNull();
  });

  it("clears session", () => {
    saveSession({
      projectName: "test",
      leftPath: "/left",
      rightPath: "/right",
      activePairIndex: null,
      mode: "side-by-side",
    });
    clearSession();
    expect(getSession()).toBeNull();
  });
});

describe("corrupted data resilience", () => {
  it("returns empty list when projects data is corrupted", () => {
    localStorage.setItem("image-diff:projects", "not-json");
    expect(listProjects()).toEqual([]);
  });

  it("returns null when session data is corrupted", () => {
    localStorage.setItem("image-diff:session", "{bad");
    expect(getSession()).toBeNull();
  });
});

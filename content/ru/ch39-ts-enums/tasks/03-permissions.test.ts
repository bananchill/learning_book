import { describe, it, expect } from "vitest";
import {
  Permission,
  hasPermission,
  addPermission,
  removePermission,
  listPermissions,
} from "./03-permissions";

describe("Permission enum", () => {
  it("должен содержать правильные значения битовых флагов", () => {
    expect(Permission.None).toBe(0);
    expect(Permission.Read).toBe(1);
    expect(Permission.Write).toBe(2);
    expect(Permission.Execute).toBe(4);
    expect(Permission.Delete).toBe(8);
    expect(Permission.ReadWrite).toBe(3);
    expect(Permission.Admin).toBe(15);
  });
});

describe("hasPermission", () => {
  it("должен вернуть true, если право присутствует", () => {
    const perms = Permission.Read | Permission.Write;
    expect(hasPermission(perms, Permission.Read)).toBe(true);
    expect(hasPermission(perms, Permission.Write)).toBe(true);
  });

  it("должен вернуть false, если право отсутствует", () => {
    const perms = Permission.Read;
    expect(hasPermission(perms, Permission.Write)).toBe(false);
    expect(hasPermission(perms, Permission.Execute)).toBe(false);
  });

  it("должен работать с комбинированными правами", () => {
    expect(hasPermission(Permission.Admin, Permission.Read)).toBe(true);
    expect(hasPermission(Permission.Admin, Permission.Delete)).toBe(true);
    expect(hasPermission(Permission.ReadWrite, Permission.Execute)).toBe(false);
  });

  it("должен вернуть true для None с None", () => {
    expect(hasPermission(Permission.None, Permission.None)).toBe(true);
  });
});

describe("addPermission", () => {
  it("должен добавить новое право", () => {
    const result = addPermission(Permission.Read, Permission.Write);
    expect(result).toBe(Permission.Read | Permission.Write);
  });

  it("не должен дублировать уже имеющееся право", () => {
    const result = addPermission(Permission.Read, Permission.Read);
    expect(result).toBe(Permission.Read);
  });
});

describe("removePermission", () => {
  it("должен убрать право", () => {
    const perms = Permission.Read | Permission.Write | Permission.Execute;
    const result = removePermission(perms, Permission.Write);
    expect(hasPermission(result, Permission.Read)).toBe(true);
    expect(hasPermission(result, Permission.Write)).toBe(false);
    expect(hasPermission(result, Permission.Execute)).toBe(true);
  });

  it("должен корректно работать при удалении отсутствующего права", () => {
    const result = removePermission(Permission.Read, Permission.Write);
    expect(result).toBe(Permission.Read);
  });
});

describe("listPermissions", () => {
  it("должен вернуть список базовых прав", () => {
    const perms = Permission.Read | Permission.Write | Permission.Execute;
    const list = listPermissions(perms);
    expect(list).toContain("Read");
    expect(list).toContain("Write");
    expect(list).toContain("Execute");
    expect(list).not.toContain("Delete");
    expect(list).toHaveLength(3);
  });

  it("должен вернуть пустой массив для None", () => {
    expect(listPermissions(Permission.None)).toEqual([]);
  });

  it("должен вернуть все 4 базовых права для Admin", () => {
    const list = listPermissions(Permission.Admin);
    expect(list).toEqual(["Read", "Write", "Execute", "Delete"]);
  });
});

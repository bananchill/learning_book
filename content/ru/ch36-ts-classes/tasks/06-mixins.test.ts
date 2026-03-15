import { describe, it, expect, vi } from "vitest";
import { UserModel } from "./06-mixins";

describe("UserModel (миксины)", () => {
  describe("Serializable", () => {
    it("должен сериализовать модель в JSON", () => {
      const user = new UserModel("u1", "Анна", "anna@example.com");
      const json = user.serialize();
      const parsed = JSON.parse(json);

      expect(parsed.id).toBe("u1");
      expect(parsed.name).toBe("Анна");
      expect(parsed.email).toBe("anna@example.com");
    });
  });

  describe("EventEmitter", () => {
    it("должен регистрировать и вызывать обработчики событий", () => {
      const user = new UserModel("u1", "Анна", "anna@example.com");
      const handler = vi.fn();

      user.on("change", handler);
      user.emit("change", "name", "Борис");

      expect(handler).toHaveBeenCalledWith("name", "Борис");
    });

    it("должен удалять обработчики через off()", () => {
      const user = new UserModel("u1", "Анна", "anna@example.com");
      const handler = vi.fn();

      user.on("change", handler);
      user.off("change", handler);
      user.emit("change");

      expect(handler).not.toHaveBeenCalled();
    });

    it("должен поддерживать несколько обработчиков одного события", () => {
      const user = new UserModel("u1", "Анна", "anna@example.com");
      const handler1 = vi.fn();
      const handler2 = vi.fn();

      user.on("save", handler1);
      user.on("save", handler2);
      user.emit("save");

      expect(handler1).toHaveBeenCalledOnce();
      expect(handler2).toHaveBeenCalledOnce();
    });

    it("не должен падать при emit без подписчиков", () => {
      const user = new UserModel("u1", "Анна", "anna@example.com");
      expect(() => user.emit("nonexistent")).not.toThrow();
    });
  });

  describe("Validatable", () => {
    it("должен проходить валидацию с корректными данными", () => {
      const user = new UserModel("u1", "Анна", "anna@example.com");
      expect(user.isValid()).toBe(true);
      expect(user.validationErrors).toHaveLength(0);
    });

    it("должен находить ошибки при пустом имени", () => {
      const user = new UserModel("u1", "", "anna@example.com");
      expect(user.isValid()).toBe(false);
      expect(user.validationErrors).toContain("Имя не может быть пустым");
    });

    it("должен находить ошибки при некорректном email", () => {
      const user = new UserModel("u1", "Анна", "invalid-email");
      expect(user.isValid()).toBe(false);
      expect(user.validationErrors).toContain("Некорректный email");
    });

    it("должен находить все ошибки при множественных нарушениях", () => {
      const user = new UserModel("u1", "", "bad");
      expect(user.isValid()).toBe(false);
      expect(user.validationErrors).toHaveLength(2);
    });

    it("должен очищать ошибки при повторной валидации", () => {
      const user = new UserModel("u1", "", "bad");
      user.isValid(); // 2 ошибки
      user.name = "Анна";
      user.email = "anna@example.com";
      expect(user.isValid()).toBe(true);
      expect(user.validationErrors).toHaveLength(0);
    });
  });

  describe("Entity (базовый класс)", () => {
    it("должен хранить id из базового класса", () => {
      const user = new UserModel("u42", "Тест", "test@test.com");
      expect(user.id).toBe("u42");
    });
  });
});

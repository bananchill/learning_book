import { describe, it, expect } from "vitest";
import { TrafficLight, getAction } from "./01-traffic-light";

describe("TrafficLight enum", () => {
  it("должен содержать строковые значения RED, YELLOW, GREEN", () => {
    expect(TrafficLight.Red).toBe("RED");
    expect(TrafficLight.Yellow).toBe("YELLOW");
    expect(TrafficLight.Green).toBe("GREEN");
  });
});

describe("getAction", () => {
  it('должен вернуть "Стоп" для красного', () => {
    expect(getAction(TrafficLight.Red)).toBe("Стоп");
  });

  it('должен вернуть "Внимание" для жёлтого', () => {
    expect(getAction(TrafficLight.Yellow)).toBe("Внимание");
  });

  it('должен вернуть "Можно ехать" для зелёного', () => {
    expect(getAction(TrafficLight.Green)).toBe("Можно ехать");
  });
});

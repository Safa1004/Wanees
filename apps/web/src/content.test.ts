import { it, expect } from "vitest";
import { steps, preferences, equipment, resources } from "./content";
it("supplies bilingual text for every complete X-ray step", () => {
  expect(steps).toHaveLength(6);
  for (const step of steps)
    for (const field of [step.title, step.body, step.question]) {
      expect(field[0].length).toBeGreaterThan(5);
      expect(field[1]).toMatch(/[\u0600-\u06ff]/);
    }
});
it("keeps all comfort choices in the validated three-choice domain", () => {
  expect(preferences).toHaveLength(6);
  preferences.forEach((p) => expect(p.choices).toHaveLength(3));
  expect(equipment.map((e) => e.id)).toEqual([
    "xray",
    "stethoscope",
    "thermometer",
  ]);
  expect(resources).toHaveLength(4);
});

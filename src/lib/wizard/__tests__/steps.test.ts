// @vitest-environment node
import { describe, it, expect } from 'vitest';
import {
  WIZARD_STEPS,
  TOTAL_STEPS,
  getStepById,
  getStepByIndex,
  getNextStep,
  getPreviousStep,
} from '../steps';
import { WIZARD_STEP_ID } from '@/types/wizard';

describe('WIZARD_STEPS', () => {
  it('has exactly 10 selection steps', () => {
    expect(WIZARD_STEPS).toHaveLength(10);
  });

  it('has the correct step IDs in order', () => {
    const ids = WIZARD_STEPS.map((s) => s.id);
    expect(ids).toEqual([
      WIZARD_STEP_ID.projectType,
      WIZARD_STEP_ID.architecture,
      WIZARD_STEP_ID.frontend,
      WIZARD_STEP_ID.styling,
      WIZARD_STEP_ID.backend,
      WIZARD_STEP_ID.database,
      WIZARD_STEP_ID.auth,
      WIZARD_STEP_ID.hosting,
      WIZARD_STEP_ID.cicd,
      WIZARD_STEP_ID.testing,
    ]);
  });

  it('every step has at least 2 options', () => {
    for (const step of WIZARD_STEPS) {
      expect(step.options.length).toBeGreaterThanOrEqual(2);
    }
  });

  it('every option has required fields', () => {
    for (const step of WIZARD_STEPS) {
      for (const option of step.options) {
        expect(option.value).toBeTruthy();
        expect(option.name).toBeTruthy();
        expect(option.description).toBeTruthy();
        expect(Array.isArray(option.pros)).toBe(true);
        expect(Array.isArray(option.cons)).toBe(true);
        expect(option.pros.length).toBeGreaterThanOrEqual(1);
        expect(option.cons.length).toBeGreaterThanOrEqual(1);
      }
    }
  });

  it('no duplicate option values within a step', () => {
    for (const step of WIZARD_STEPS) {
      const values = step.options.map((o) => o.value);
      const unique = new Set(values);
      expect(unique.size).toBe(values.length);
    }
  });

  it('no duplicate step IDs', () => {
    const ids = WIZARD_STEPS.map((s) => s.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it('each step has a non-empty title and description', () => {
    for (const step of WIZARD_STEPS) {
      expect(step.title.length).toBeGreaterThan(0);
      expect(step.description.length).toBeGreaterThan(0);
    }
  });
});

describe('TOTAL_STEPS', () => {
  it('equals WIZARD_STEPS.length', () => {
    expect(TOTAL_STEPS).toBe(WIZARD_STEPS.length);
  });
});

describe('getStepById', () => {
  it('returns the correct step for a valid ID', () => {
    const step = getStepById(WIZARD_STEP_ID.frontend);
    expect(step).toBeDefined();
    expect(step?.id).toBe(WIZARD_STEP_ID.frontend);
  });

  it('returns undefined for an unknown ID', () => {
    const step = getStepById('nonexistent' as never);
    expect(step).toBeUndefined();
  });

  it('returns steps for every defined step ID', () => {
    for (const id of Object.values(WIZARD_STEP_ID)) {
      expect(getStepById(id)).toBeDefined();
    }
  });
});

describe('getStepByIndex', () => {
  it('returns the step at index 0', () => {
    const step = getStepByIndex(0);
    expect(step?.id).toBe(WIZARD_STEP_ID.projectType);
  });

  it('returns the step at the last index', () => {
    const step = getStepByIndex(TOTAL_STEPS - 1);
    expect(step?.id).toBe(WIZARD_STEP_ID.testing);
  });

  it('returns undefined for a negative index', () => {
    expect(getStepByIndex(-1)).toBeUndefined();
  });

  it('returns undefined for an out-of-bounds index', () => {
    expect(getStepByIndex(TOTAL_STEPS)).toBeUndefined();
  });
});

describe('getNextStep', () => {
  it('returns the next step from the first step', () => {
    const next = getNextStep(WIZARD_STEP_ID.projectType);
    expect(next?.id).toBe(WIZARD_STEP_ID.architecture);
  });

  it('returns undefined from the last step', () => {
    const next = getNextStep(WIZARD_STEP_ID.testing);
    expect(next).toBeUndefined();
  });

  it('advances correctly through all steps', () => {
    let current = WIZARD_STEPS[0];
    let count = 1;
    while (true) {
      const next = getNextStep(current.id);
      if (!next) break;
      current = next;
      count++;
    }
    expect(count).toBe(TOTAL_STEPS);
  });
});

describe('getPreviousStep', () => {
  it('returns the previous step from the last step', () => {
    const prev = getPreviousStep(WIZARD_STEP_ID.testing);
    expect(prev?.id).toBe(WIZARD_STEP_ID.cicd);
  });

  it('returns undefined from the first step', () => {
    const prev = getPreviousStep(WIZARD_STEP_ID.projectType);
    expect(prev).toBeUndefined();
  });
});

import type { ProjectPlan } from './database';

export type ProjectPlanSummary = Pick<
  ProjectPlan,
  'id' | 'name' | 'description' | 'created_at' | 'updated_at'
>;

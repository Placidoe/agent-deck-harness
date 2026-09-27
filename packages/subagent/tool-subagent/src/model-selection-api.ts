/** Public reusable child-model selection contract for delegation tools. */

export {
  assertAllowedModelSelection,
  hasConfiguredLlmSelection,
  hasDelegationModelRequest,
  preflightChildLlmRoute,
  requestedAgentOptions,
} from './model-selection.ts'
export type {
  AllowedModelRoute,
  DelegationModelRequest,
  ModelSelectionPolicy,
} from './model-selection.ts'
export { registerListSubagentModels } from './list-models.ts'
export { captureSubagentModelSelectionPolicy } from './model-selection-session.ts'
export {
  subagentModelSelectionProjectionDefinition,
  subagentModelSelectionPolicy,
} from './model-selection-state.ts'

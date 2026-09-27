/** Shared per-Session capture of the host-owned child-model selection policy. */

import type { Context } from '@deepseek-ai/cordis'
import type { Session } from '@deepseek-ai/dsh-session'
import type { SubagentModelSelectionConfig } from './model-selection-settings.ts'
import type { ModelSelectionPolicy } from './model-selection.ts'
import {
  recordSubagentModelSelection,
  subagentModelSelectionPolicy,
} from './model-selection-state.ts'

/**
 * Capture the immutable child-model selection authority for one Session.
 * Existing policies win, child Sessions inherit a live parent's policy, and
 * only a genuinely fresh root samples the current host setting.
 * @param ctx - Host context that owns Session projections and the live registry.
 * @param target - Session receiving a model-selectable delegation definition.
 * @param settings - Host-owned preference sampled only for a fresh root Session.
 * @returns the exact-route authority, or undefined when selection is disabled.
 */
export function captureSubagentModelSelectionPolicy(
  ctx: Context,
  target: Session,
  settings: Pick<SubagentModelSelectionConfig, 'current'>,
): ModelSelectionPolicy | undefined {
  const freshSession = target.seq === 0
  let allowedModels = subagentModelSelectionPolicy(ctx.sessionProjections, target)
  if (allowedModels === undefined) {
    const parentId = target.header.origin === 'subagent'
      ? target.header.parentSession
      : undefined
    if (parentId !== undefined) {
      const sessions = ctx.get('sessions')
      if (sessions === undefined) {
        throw new Error('child model-selection inheritance requires the Session registry')
      }
      const parent = sessions.get(parentId)
      allowedModels = parent === undefined
        ? undefined
        : subagentModelSelectionPolicy(ctx.sessionProjections, parent)
    } else if (freshSession) {
      const current = settings.current()
      allowedModels = current.enabled ? current.allowedModels : undefined
    }
  }
  if (allowedModels !== undefined) {
    recordSubagentModelSelection(ctx.sessionProjections, target, allowedModels)
  }
  return allowedModels === undefined ? undefined : { routes: allowedModels }
}

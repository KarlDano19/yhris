export type SeparationPhase =
  | 'Initiation'
  | 'Rendering'
  | 'Clearance'
  | 'Final Pay'
  | 'Legal Docs'
  | 'Exit Interview'
  | 'Final Settlement';

export function getSeparationPhase(item: any): SeparationPhase {
  if (item.is_quit_claim_received || item.isQuitclaimReceived) return 'Final Settlement';
  if (item.is_last_pay_released || item.isLastPayReleased) return 'Legal Docs';
  if (item.is_documents_received || item.isDocumentsReceived) return 'Final Pay';
  if (item.is_letter_received || item.isLetterReceived) return 'Rendering';
  return 'Initiation';
}

export function getSeparationProgress(item: any): number {
  let completed = 0;
  if (item.is_letter_sent || item.isLetterSent) completed++;
  if (item.is_letter_received || item.isLetterReceived) completed++;
  if (item.is_documents_received || item.isDocumentsReceived) completed++;
  if (item.is_last_pay_released || item.isLastPayReleased) completed++;
  if (item.is_quit_claim_received || item.isQuitclaimReceived) completed++;
  return Math.round((completed / 5) * 100);
}

export function getPendingTasksCount(item: any): number {
  let pending = 0;
  if (!item.is_letter_sent && !item.isLetterSent) pending++;
  if (!item.is_letter_received && !item.isLetterReceived) pending++;
  if (!item.is_documents_received && !item.isDocumentsReceived) pending++;
  if (!item.is_last_pay_released && !item.isLastPayReleased) pending++;
  if (!item.is_quit_claim_received && !item.isQuitclaimReceived) pending++;
  return pending;
}

export const PHASE_COLORS: Record<SeparationPhase, string> = {
  Initiation: 'bg-gray-100 text-gray-700',
  Rendering: 'bg-blue-100 text-blue-700',
  Clearance: 'bg-orange-100 text-orange-700',
  'Final Pay': 'bg-purple-100 text-purple-700',
  'Legal Docs': 'bg-yellow-100 text-yellow-700',
  'Exit Interview': 'bg-teal-100 text-teal-700',
  'Final Settlement': 'bg-green-100 text-green-700',
};

export const PHASE_BAR_COLORS: Record<SeparationPhase, string> = {
  Initiation: 'bg-gray-400',
  Rendering: 'bg-blue-500',
  Clearance: 'bg-orange-500',
  'Final Pay': 'bg-purple-500',
  'Legal Docs': 'bg-yellow-500',
  'Exit Interview': 'bg-teal-500',
  'Final Settlement': 'bg-green-500',
};

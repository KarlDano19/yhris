'use client';

import ModalLayout from '@/components/ModalLayout';
import LoadingSpinner from '@/components/LoadingSpinner';

import useGetPolicySectionVersions from '../hooks/useGetPolicySectionVersions';

const CHANGE_SOURCE_LABELS: Record<string, string> = {
  ai_generated: 'AI Generated',
  ai_regenerated: 'AI Regenerated',
  manual_edit: 'Manual Edit',
  hris_synced: 'Synced from HRIS',
};

const stripHtml = (html: string) => html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

interface Props {
  isOpen: boolean;
  handleClose: () => void;
  sectionId: number | null;
  sectionTitle?: string;
}

const VersionHistoryModal = ({ isOpen, handleClose, sectionId, sectionTitle }: Props) => {
  const { data: versions, isLoading } = useGetPolicySectionVersions(isOpen ? sectionId : null);

  return (
    <ModalLayout isOpen={isOpen} handleClose={handleClose} title={`Version History${sectionTitle ? ` — ${sectionTitle}` : ''}`}>
      <div className='p-6 max-h-[60vh] overflow-y-auto'>
        {isLoading && (
          <div className='flex justify-center py-8'>
            <LoadingSpinner />
          </div>
        )}

        {!isLoading && (!versions || versions.length === 0) && (
          <p className='text-sm text-gray-500 text-center py-8'>No edit history yet for this section.</p>
        )}

        {!isLoading && versions && versions.length > 0 && (
          <ul className='flex flex-col gap-4'>
            {versions.map((version: any) => (
              <li key={version.id} className='border border-gray-200 rounded-md p-4'>
                <div className='flex items-center justify-between mb-2'>
                  <span className='text-xs font-semibold uppercase tracking-wide text-savoy-blue'>
                    {CHANGE_SOURCE_LABELS[version.change_source] ?? version.change_source}
                  </span>
                  <span className='text-xs text-gray-500'>{new Date(version.created_at).toLocaleString()}</span>
                </div>
                <p className='text-sm text-gray-700 line-clamp-3'>{stripHtml(version.body_snapshot)}</p>
                <p className='text-xs text-gray-400 mt-2'>{version.edited_by ? `Edited by ${version.edited_by}` : 'Edited by AI'}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </ModalLayout>
  );
};

export default VersionHistoryModal;

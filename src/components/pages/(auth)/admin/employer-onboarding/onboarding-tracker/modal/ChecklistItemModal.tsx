'use client';

import { useEffect, useRef } from 'react';

import { Dialog } from '@headlessui/react';
import { CheckCircleIcon, ForwardIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { ClockIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

import useUpdateChecklistItem from '../hooks/useUpdateChecklistItem';

// ---------------------------------------------------------------------------
// YouTube helpers
// ---------------------------------------------------------------------------

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /[?&]v=([^&#]+)/,
    /youtu\.be\/([^?#]+)/,
    /youtube\.com\/embed\/([^?#]+)/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

function loadYouTubeAPI(onReady: () => void) {
  if ((window as any).YT?.Player) {
    onReady();
    return;
  }
  if (!(window as any)._ytReadyCallbacks) {
    (window as any)._ytReadyCallbacks = [];
    const prev = (window as any).onYouTubeIframeAPIReady;
    (window as any).onYouTubeIframeAPIReady = () => {
      if (prev) prev();
      ((window as any)._ytReadyCallbacks as Array<() => void>).forEach((cb) => cb());
      (window as any)._ytReadyCallbacks = [];
    };
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(tag);
  }
  (window as any)._ytReadyCallbacks.push(onReady);
}

// ---------------------------------------------------------------------------

type ChecklistItemModalProps = {
  item: any;
  recordId: string;
  onClose: () => void;
  onUpdated: (updated: any) => void;
};

const ChecklistItemModal = ({ item, recordId, onClose, onUpdated }: ChecklistItemModalProps) => {
  const mutation = useUpdateChecklistItem(recordId);
  const playerRef = useRef<any>(null);
  const playerContainerId = `yt-player-${item.id}`;

  const ytId = item.tutorial_url ? extractYouTubeId(item.tutorial_url) : null;

  // ---------------------------------------------------------------------------
  // YouTube player setup
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!ytId) return;

    let destroyed = false;

    loadYouTubeAPI(() => {
      if (destroyed) return;
      playerRef.current = new (window as any).YT.Player(playerContainerId, {
        videoId: ytId,
        width: '100%',
        height: '100%',
        playerVars: { rel: 0, modestbranding: 1 },
        events: {
          onStateChange: (event: any) => {
            // YT.PlayerState.ENDED === 0
            if (event.data === 0 && !item.is_completed && !item.is_skipped) {
              handleMarkComplete();
            }
          },
        },
      });
    });

    return () => {
      destroyed = true;
      if (playerRef.current?.destroy) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ytId, playerContainerId]);

  // ---------------------------------------------------------------------------
  // Actions
  // ---------------------------------------------------------------------------

  function handleMarkComplete() {
    if (item.is_completed) return;
    mutation.mutate(
      { itemId: item.id, data: { is_completed: true, is_skipped: false } },
      {
        onSuccess: (res) => {
          toast.success('Item marked as complete.');
          onUpdated(res);
        },
        onError: () => {
          toast.error('Failed to update item.');
        },
      }
    );
  }

  function handleSkip() {
    if (item.is_skipped) return;
    mutation.mutate(
      { itemId: item.id, data: { is_skipped: true, is_completed: false } },
      {
        onSuccess: (res) => {
          toast.success('Item skipped.');
          onUpdated(res);
        },
        onError: () => {
          toast.error('Failed to update item.');
        },
      }
    );
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <Dialog open onClose={onClose} className="relative z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-start justify-between p-5 border-b border-gray-100">
            <div className="flex-1 pr-4">
              <div className="flex items-center gap-2 flex-wrap">
                <Dialog.Title className="text-base font-semibold text-gray-800">
                  {item.title}
                </Dialog.Title>
                {item.is_required && (
                  <span className="text-xs bg-red-50 text-red-600 px-1.5 py-0.5 rounded font-medium">
                    Required
                  </span>
                )}
                {item.is_completed && (
                  <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-medium flex items-center gap-1">
                    <CheckCircleIcon className="w-3 h-3" /> Completed
                  </span>
                )}
                {item.is_skipped && (
                  <span className="text-xs bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded font-medium flex items-center gap-1">
                    <ForwardIcon className="w-3 h-3" /> Skipped
                  </span>
                )}
              </div>
              {item.estimated_minutes > 0 && (
                <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                  <ClockIcon className="w-3.5 h-3.5" />
                  <span>{item.estimated_minutes} min estimated</span>
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 p-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <XMarkIcon className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Body */}
          <div className="p-5 space-y-4">
            {/* Description */}
            {item.description && (
              <p className="text-sm text-gray-600">{item.description}</p>
            )}

            {/* Video */}
            {item.tutorial_url && (
              <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                {ytId ? (
                  <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
                    <div
                      id={playerContainerId}
                      className="absolute inset-0 w-full h-full"
                    />
                  </div>
                ) : (
                  <iframe
                    src={item.tutorial_url}
                    className="w-full"
                    style={{ height: '280px' }}
                    allow="autoplay; fullscreen"
                    title={item.title}
                  />
                )}
              </div>
            )}
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-gray-100">
            <button
              type="button"
              onClick={handleSkip}
              disabled={item.is_skipped || item.is_completed || mutation.isLoading}
              className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {mutation.isLoading ? 'Saving…' : 'Skip'}
            </button>
            <button
              type="button"
              onClick={handleMarkComplete}
              disabled={item.is_completed || mutation.isLoading}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
            >
              <CheckCircleIcon className="w-4 h-4" />
              {item.is_completed ? 'Completed' : mutation.isLoading ? 'Saving…' : 'Mark as Complete'}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ChecklistItemModal;

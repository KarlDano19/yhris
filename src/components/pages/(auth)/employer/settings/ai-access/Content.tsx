'use client';

import { useState } from 'react';

import toast from 'react-hot-toast';
import { Tooltip } from 'react-tooltip';

import CustomToast from '@/components/CustomToast';
import DeleteModal from '@/components/DeleteModal';
import LoadingSpinner from '@/components/LoadingSpinner';
import ModalLayout from '@/components/ModalLayout';

import useGetMcpTokens from './hooks/useGetMcpTokens';
import { useCreateMcpToken } from './hooks/useCreateMcpToken';
import { useRevokeMcpToken } from './hooks/useRevokeMcpToken';

import { T_McpToken } from '@/types/mcpToken';

import { KeyIcon, ClipboardIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';

const MCP_SERVER_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/mcp/hris`;

const EXPIRY_OPTIONS = [
  { label: 'No expiry', value: '' },
  { label: '30 days', value: '30' },
  { label: '90 days', value: '90' },
  { label: '1 year', value: '365' },
];

const formatDate = (value: string | null) => (value ? new Date(value).toLocaleString() : '—');

const AiAccessContent = () => {
  const { data, isLoading } = useGetMcpTokens();
  const createMutation = useCreateMcpToken();
  const revokeMutation = useRevokeMcpToken();

  const [isGenerateOpen, setIsGenerateOpen] = useState(false);
  const [label, setLabel] = useState('');
  const [expiresIn, setExpiresIn] = useState('');

  const [newToken, setNewToken] = useState('');
  const [isTokenOpen, setIsTokenOpen] = useState(false);

  const [revokeModal, setRevokeModal] = useState<{ open: boolean; token?: T_McpToken } | null>({
    open: false,
  });

  const tokens: T_McpToken[] = data?.records ?? [];

  const copyToClipboard = async (text: string, message = 'Copied to clipboard.') => {
    try {
      await navigator.clipboard.writeText(text);
      toast.custom(() => <CustomToast message={message} type='success' />, { duration: 2500 });
    } catch {
      toast.custom(() => <CustomToast message='Could not copy. Copy it manually.' type='error' />, {
        duration: 4000,
      });
    }
  };

  const handleGenerate = async () => {
    try {
      const res = await createMutation.mutateAsync({
        label: label.trim() || 'Personal token',
        expires_in_days: expiresIn ? Number(expiresIn) : null,
      });
      setIsGenerateOpen(false);
      setLabel('');
      setExpiresIn('');
      setNewToken(res.token);
      setIsTokenOpen(true);
    } catch (error: any) {
      toast.custom(() => <CustomToast message={error.message || 'Failed to create token.'} type='error' />, {
        duration: 5000,
      });
    }
  };

  const handleRevoke = async () => {
    const target = revokeModal?.token;
    if (!target) return;
    try {
      await revokeMutation.mutateAsync(target.id);
      toast.custom(() => <CustomToast message='Token revoked.' type='success' />, { duration: 3000 });
      setRevokeModal({ open: false });
    } catch (error: any) {
      toast.custom(() => <CustomToast message={error.message || 'Failed to revoke token.'} type='error' />, {
        duration: 5000,
      });
    }
  };

  return (
    <div className='mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3'>
        <div>
          <h1 className='text-xl font-semibold text-gray-900 flex items-center gap-2'>
            <KeyIcon className='h-6 w-6 text-yellow-500' />
            AI Access Tokens
          </h1>
          <p className='text-sm text-gray-500 mt-1'>
            Personal tokens let AI assistants (e.g. ChatGPT, Codex) connect to your HRIS through MCP.
            A token acts as you — it only sees what your HRIS role allows.
          </p>
        </div>
        <button
          onClick={() => setIsGenerateOpen(true)}
          className='inline-flex items-center gap-2 rounded-lg bg-yellow-500 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-600'
        >
          <PlusIcon className='h-4 w-4' />
          Generate token
        </button>
      </div>

      {/* Server URL helper */}
      <div className='mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4'>
        <p className='text-xs font-medium text-gray-500 uppercase tracking-wide'>MCP Server URL</p>
        <div className='mt-1 flex items-center gap-2'>
          <code className='text-sm text-gray-800 break-all'>{MCP_SERVER_URL}</code>
          <button
            onClick={() => copyToClipboard(MCP_SERVER_URL, 'Server URL copied.')}
            className='shrink-0 rounded p-1 text-gray-400 hover:text-gray-700'
            data-tooltip-id='ai-access-tip'
            data-tooltip-content='Copy server URL'
          >
            <ClipboardIcon className='h-4 w-4' />
          </button>
        </div>
        <p className='text-xs text-gray-500 mt-2'>
          In your AI client, add a custom MCP server with this URL and paste your token as the Bearer token.
        </p>
      </div>

      {/* Token list */}
      <div className='mt-6 rounded-lg border border-gray-200 overflow-hidden'>
        {isLoading ? (
          <div className='flex justify-center py-12'>
            <LoadingSpinner size='lg' />
          </div>
        ) : tokens.length === 0 ? (
          <div className='py-12 text-center text-sm text-gray-500'>
            No tokens yet. Generate one to connect an AI assistant.
          </div>
        ) : (
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                {['Label', 'Token', 'Last used', 'Expires', 'Status', ''].map((head) => (
                  <th
                    key={head}
                    className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide'
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200 bg-white'>
              {tokens.map((tk) => (
                <tr key={tk.id} className={tk.is_active ? '' : 'opacity-50'}>
                  <td className='px-4 py-3 text-sm text-gray-900'>{tk.label}</td>
                  <td className='px-4 py-3 text-sm text-gray-500'>
                    <code>{tk.token_prefix}…</code>
                  </td>
                  <td className='px-4 py-3 text-sm text-gray-500'>{formatDate(tk.last_used_at)}</td>
                  <td className='px-4 py-3 text-sm text-gray-500'>
                    {tk.expires_at ? formatDate(tk.expires_at) : 'Never'}
                  </td>
                  <td className='px-4 py-3 text-sm'>
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        tk.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {tk.is_active ? 'Active' : 'Revoked'}
                    </span>
                  </td>
                  <td className='px-4 py-3 text-right'>
                    {tk.is_active && (
                      <button
                        onClick={() => setRevokeModal({ open: true, token: tk })}
                        className='rounded p-1 text-gray-400 hover:text-red-600'
                        data-tooltip-id='ai-access-tip'
                        data-tooltip-content='Revoke token'
                      >
                        <TrashIcon className='h-4 w-4' />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Generate modal — styled to match Add User Account (savoy-blue header/actions,
          ring inputs, two-column grid, hr divider, reversed footer). */}
      <ModalLayout isOpen={isGenerateOpen} handleClose={() => setIsGenerateOpen(false)} title='Generate AI access token'>
        <div className='md:mx-6 my-4'>
          <div className='px-4 pt-4 pb-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5'>
              <div className='grid-item'>
                <label htmlFor='token-label' className='block text-sm font-medium leading-6 text-gray-900'>
                  Label
                </label>
                <div className='mt-2'>
                  <input
                    id='token-label'
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    type='text'
                    placeholder='e.g. ChatGPT on my laptop'
                    className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
                  />
                </div>
              </div>
              <div className='grid-item'>
                <label htmlFor='token-expiry' className='block text-sm font-medium leading-6 text-gray-900'>
                  Expires
                </label>
                <div className='mt-2'>
                  <select
                    id='token-expiry'
                    value={expiresIn}
                    onChange={(e) => setExpiresIn(e.target.value)}
                    className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6'
                  >
                    {EXPIRY_OPTIONS.map((opt) => (
                      <option key={opt.label} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
          <hr />
          <div className='mt-5 sm:mt-4 sm:flex sm:flex-row-reverse px-4'>
            <button
              type='button'
              onClick={handleGenerate}
              disabled={createMutation.isLoading}
              className='inline-flex w-full items-center justify-center gap-2 rounded-md bg-savoy-blue px-3 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 disabled:opacity-60 sm:ml-3 sm:w-auto'
            >
              {createMutation.isLoading && <LoadingSpinner size='xs' color='white' />}
              Generate
            </button>
            <button
              type='button'
              onClick={() => setIsGenerateOpen(false)}
              className='mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-savoy-blue shadow-sm ring-1 ring-inset ring-savoy-blue hover:bg-gray-50 sm:mt-0 sm:w-auto'
            >
              Close
            </button>
          </div>
        </div>
      </ModalLayout>

      {/* Token-shown-once modal */}
      <ModalLayout
        isOpen={isTokenOpen}
        handleClose={() => {
          setIsTokenOpen(false);
          setNewToken('');
        }}
        title='Copy your token now'
      >
        <div className='md:mx-6 my-4'>
          <div className='px-4 pt-4 pb-6 space-y-4'>
            <div className='rounded-md border border-yellow-300 bg-yellow-50 p-3 text-sm text-yellow-800'>
              This token is shown <b>once</b>. Copy it now — you won’t be able to see it again.
            </div>
            <div className='flex items-center gap-2 rounded-md bg-gray-50 p-3 shadow-sm ring-1 ring-inset ring-gray-300'>
              <code className='flex-1 text-sm text-gray-800 break-all'>{newToken}</code>
              <button
                type='button'
                onClick={() => copyToClipboard(newToken, 'Token copied.')}
                className='shrink-0 inline-flex items-center gap-1 rounded-md bg-savoy-blue px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:opacity-90'
              >
                <ClipboardIcon className='h-4 w-4' />
                Copy
              </button>
            </div>
            <div className='text-xs text-gray-500'>
              Paste this as the <b>Bearer token</b> in your AI client’s MCP connector, with the server URL above.
            </div>
          </div>
          <hr />
          <div className='mt-5 sm:mt-4 sm:flex sm:flex-row-reverse px-4'>
            <button
              type='button'
              onClick={() => {
                setIsTokenOpen(false);
                setNewToken('');
              }}
              className='inline-flex w-full justify-center rounded-md bg-savoy-blue px-3 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 sm:ml-3 sm:w-auto'
            >
              Done
            </button>
          </div>
        </div>
      </ModalLayout>

      {/* Revoke confirmation */}
      <DeleteModal
        isOpen={revokeModal ?? { open: false }}
        setIsOpen={setRevokeModal}
        onConfirm={handleRevoke}
        isLoading={revokeMutation.isLoading}
        customText='this token'
      />

      <Tooltip id='ai-access-tip' />
    </div>
  );
};

export default AiAccessContent;

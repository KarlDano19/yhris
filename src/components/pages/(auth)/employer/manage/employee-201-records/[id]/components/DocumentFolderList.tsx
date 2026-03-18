'use client';

import React from 'react';
import { FolderIcon, FolderOpenIcon, PlusIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import { T_EmployeeDocumentFolder } from '@/types/employee-201-records/document-repository';

interface DocumentFolderListProps {
  folders: T_EmployeeDocumentFolder[];
  selectedFolderId: number | null | undefined;
  onFolderSelect: (folderId: number | null) => void;
  onCreateFolder: () => void;
  onRenameFolder?: (folder: T_EmployeeDocumentFolder) => void;
  onDeleteFolder?: (folderId: number) => void;
  isLoading?: boolean;
}

export default function DocumentFolderList({
  folders,
  selectedFolderId,
  onFolderSelect,
  onCreateFolder,
  onRenameFolder,
  onDeleteFolder,
  isLoading = false,
}: DocumentFolderListProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        <div className="h-10 w-full rounded-md bg-gray-200 animate-pulse" />
        <div className="h-10 w-full rounded-md bg-gray-200 animate-pulse" />
        <div className="h-10 w-full rounded-md bg-gray-200 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-700">Folders</h3>
        <button
          onClick={onCreateFolder}
          className="p-1.5 rounded-md hover:bg-gray-100 text-blue-600 transition-colors"
          title="Create new folder"
        >
          <PlusIcon className="h-4 w-4" />
        </button>
      </div>

      {/* All Files (Root) */}
      <button
        onClick={() => onFolderSelect(undefined)}
        className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${
          selectedFolderId === undefined
            ? 'bg-blue-50 text-blue-700 font-medium'
            : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        <div className="flex items-center gap-2">
          <FolderIcon className="h-4 w-4" />
          <span>All Files</span>
        </div>
      </button>

      {/* Root Level Files */}
      <button
        onClick={() => onFolderSelect(null)}
        className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${
          selectedFolderId === null
            ? 'bg-blue-50 text-blue-700 font-medium'
            : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        <div className="flex items-center gap-2">
          <FolderIcon className="h-4 w-4" />
          <span>Root</span>
        </div>
      </button>

      <div className="border-t pt-2" />

      {/* Folder List */}
      {folders.length === 0 ? (
        <div className="text-center py-8 text-sm text-gray-500">
          <FolderOpenIcon className="h-12 w-12 mx-auto mb-2 text-gray-300" />
          <p>No folders yet</p>
          <p className="text-xs mt-1">Click + to create one</p>
        </div>
      ) : (
        <div className="space-y-1">
          {folders.map((folder) => (
            <div
              key={folder.id}
              className={`group flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${
                selectedFolderId === folder.id
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <button
                onClick={() => onFolderSelect(folder.id)}
                className="flex-1 flex items-center gap-2 text-left"
              >
                {selectedFolderId === folder.id ? (
                  <FolderOpenIcon className="h-4 w-4 flex-shrink-0" />
                ) : (
                  <FolderIcon className="h-4 w-4 flex-shrink-0" />
                )}
                <span className="truncate">{folder.name}</span>
                <span className="ml-auto text-xs text-gray-500">({folder.document_count})</span>
              </button>

              {/* Actions (visible on hover) */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {onRenameFolder && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRenameFolder(folder);
                    }}
                    className="p-1 rounded hover:bg-blue-100 text-blue-600"
                    title="Rename folder"
                  >
                    <PencilIcon className="h-3.5 w-3.5" />
                  </button>
                )}
                {onDeleteFolder && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteFolder(folder.id);
                    }}
                    className="p-1 rounded hover:bg-red-100 text-red-600"
                    title="Delete folder"
                  >
                    <TrashIcon className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

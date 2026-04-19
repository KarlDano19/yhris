import { useEffect, useState } from 'react';

import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

import Modal from '../../components/Modal';

import CustomToast from '@/components/CustomToast';
import EyePassword from '@/svg/EyePassword';
import DeleteIcon from '@/svg/DeleteIcon';
import ViewDocumentModal from './ViewDocumentModal';

import { T_Portfolio } from '@/types/personal-mode';

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: T_Portfolio) => void;
  initialData?: T_Portfolio | null;
  onAddToLocal: (data: T_Portfolio) => void;
  onUpdateLocal: (data: T_Portfolio) => void;
}

const AddProjectModal = ({
  isOpen,
  onClose,
  onSave,
  initialData = null,
  onAddToLocal,
  onUpdateLocal,
}: AddProjectModalProps) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [viewingDocument, setViewingDocument] = useState<{ name: string; url: string } | null>(null);

  const { register, handleSubmit, reset } = useForm<T_Portfolio>({
    defaultValues: {
      name: '',
      description: '',
      link: '',
      image: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset({
          name: initialData.name || '',
          description: initialData.description || '',
          link: initialData.link || '',
          image: initialData.image || '',
        });
        setImageFile(initialData.imageFile || null);
        setExistingImageUrl(initialData.imageUrl || initialData.image || null);
      } else {
        reset({
          name: '',
          description: '',
          link: '',
          image: '',
        });
        setImageFile(null);
        setExistingImageUrl(null);
      }
    }
  }, [initialData, isOpen, reset]);

  const onSubmit = (data: T_Portfolio) => {
    // Update local state in parent modal (no API call)
    const dataToSave: T_Portfolio = {
      ...data,
      imageFile: imageFile,
      imageUrl: imageFile ? undefined : existingImageUrl, // Keep existing URL if no new file
    };

    if (initialData && initialData.id) {
      // Update existing
      onUpdateLocal(dataToSave);
    } else {
      // Add new - generate ID
      const newId = Date.now(); // Temporary ID
      onAddToLocal({ ...dataToSave, id: newId });
    }
    
    onClose();
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFile = e?.dataTransfer?.files?.[0];
    
    if (droppedFile) {
      processFile(droppedFile);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
    // Clear the file input
    e.target.value = '';
  };

  const processFile = (file: File) => {
    // Validate file size (10MB limit)
    const maxFileSize = 10 * 1024 * 1024; // 10 MB
    if (file.size > maxFileSize) {
      toast.custom(() => <CustomToast message={`${file.name} exceeds 10MB limit.`} type='error' />, { duration: 2000 });
      return;
    }

    // Validate file type (images only)
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.custom(() => <CustomToast message={`${file.name}: Invalid file type. Only image files are allowed.`} type='error' />, { duration: 2000 });
      return;
    }

    setImageFile(file);
    // Clear existing image URL when new file is uploaded
    setExistingImageUrl(null);
  };

  const handleRemoveFile = () => {
    setImageFile(null);
    // Reset the file input
    const fileInput = document.getElementById('project-image-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleRemoveExistingImage = () => {
    setExistingImageUrl(null);
  };

  const footerContent = (
    <div className="flex items-center justify-end gap-3">
      <button
        type="button"
        onClick={onClose}
        className="px-6 py-2.5 border-2 border-savoy-blue text-savoy-blue rounded-lg font-medium hover:bg-savoy-blue/5 transition-colors"
      >
        Cancel
      </button>
      <button
        type="submit"
        form="project-form"
        className="px-6 py-2.5 bg-savoy-blue text-white rounded-lg font-medium hover:bg-savoy-blue/90 transition-colors"
      >
        Save
      </button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Project' : 'Add Project'}
      size="2xl"
      footerContent={footerContent}
    >
      <form id="project-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-5">
          {/* Project Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('name', { required: true })}
              placeholder="e.g., E-commerce App Redesign"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-savoy-blue focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              {...register('description')}
              placeholder="Describe the project..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-savoy-blue focus:border-transparent outline-none transition-all resize-none"
            />
          </div>

          {/* Project Link */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Link
            </label>
            <input
              type="url"
              {...register('link')}
              placeholder="https://..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-savoy-blue focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Project Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Image
            </label>
            <div>
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className="block w-full rounded-md border-0 py-8 px-3 text-[#ACB9CB] shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6 text-center"
              >
                <label
                  className={`${
                    !imageFile && !existingImageUrl
                      ? 'file-preview cursor-pointer hover:bg-blue hover:text-blue-600 text-base leading-normal'
                      : 'hidden'
                  }`}
                >
                  Drop image to upload or click to select
                  <input
                    {...register('imageFile')}
                    name="imageFile"
                    id="project-image-upload"
                    type="file"
                    className="sr-only"
                    onChange={handleImageUpload}
                    accept="image/*"
                  />
                </label>
                
                {/* Show existing image when editing */}
                {existingImageUrl && !imageFile && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-600 mb-2">Existing Project Image:</p>
                    <div className="flex items-center justify-between py-2 px-3 mb-2 bg-gray-50 rounded">
                      <div className="flex items-center gap-3 flex-1">
                        <img
                          src={existingImageUrl}
                          alt="Project preview"
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="text-sm text-slate-800 font-light">
                            {existingImageUrl.split('/').pop()}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 items-center">
                        <button
                          type="button"
                          className="cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            setViewingDocument({ name: 'Project Image', url: existingImageUrl });
                          }}
                        >
                          <EyePassword visible />
                        </button>
                        <button
                          type="button"
                          className="cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveExistingImage();
                          }}
                        >
                          <DeleteIcon />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Show new file when selected */}
                {imageFile && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-600 mb-2">New Image to Upload:</p>
                    <div className="flex items-center justify-between py-2 px-3 mb-2 bg-blue-50 rounded">
                      <div className="flex items-center gap-3 flex-1">
                        <img
                          src={URL.createObjectURL(imageFile)}
                          alt="Project preview"
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="text-sm text-slate-800 font-light">{imageFile.name}</p>
                          <p className="text-xs text-gray-500">{(imageFile.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <div className="flex gap-2 items-center">
                        <button
                          type="button"
                          className="cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            setViewingDocument({ name: imageFile.name, url: URL.createObjectURL(imageFile) });
                          }}
                        >
                          <EyePassword visible />
                        </button>
                        <button
                          type="button"
                          className="cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveFile();
                          }}
                        >
                          <DeleteIcon />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <p className="text-xs pl-2 mt-1 text-gray-500">Maximum file size: 10 MB per file</p>
            </div>
          </div>
        </div>
      </form>

      {viewingDocument && (
        <ViewDocumentModal
          isOpen={!!viewingDocument}
          onClose={() => setViewingDocument(null)}
          documentName={viewingDocument.name}
          fileUrl={viewingDocument.url}
        />
      )}
    </Modal>
  );
};

export default AddProjectModal;


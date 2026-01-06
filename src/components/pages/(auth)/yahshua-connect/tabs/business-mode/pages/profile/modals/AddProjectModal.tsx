

import { useState, useEffect } from 'react';
import Modal from '../../../../../components/Modal';

interface Portfolio {
  id?: number;
  name: string;
  description: string;
  link: string;
  image?: string;
}

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Portfolio) => void;
  initialData?: Portfolio | null;
}

const AddProjectModal = ({
  isOpen,
  onClose,
  onSave,
  initialData = null,
}: AddProjectModalProps) => {
  const [formData, setFormData] = useState<Portfolio>({
    name: '',
    description: '',
    link: '',
    image: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: '',
        description: '',
        link: '',
        image: '',
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleChange = (field: keyof Portfolio, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Handle image upload logic here
      console.log('Image uploaded:', file);
      // You could also create a preview URL here
      // const imageUrl = URL.createObjectURL(file);
      // handleChange('image', imageUrl);
    }
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
      <form id="project-form" onSubmit={handleSubmit}>
        <div className="space-y-5">
          {/* Project Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="e.g., E-commerce App Redesign"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-savoy-blue focus:border-transparent outline-none transition-all"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
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
              value={formData.link}
              onChange={(e) => handleChange('link', e.target.value)}
              placeholder="https://..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-savoy-blue focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Project Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Images
            </label>
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-savoy-blue hover:bg-savoy-blue/5 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <div className="w-12 h-12 mb-3 text-gray-400 flex items-center justify-center">
                  <svg
                    className="w-full h-full"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload images</span>
                </p>
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
              />
            </label>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default AddProjectModal;


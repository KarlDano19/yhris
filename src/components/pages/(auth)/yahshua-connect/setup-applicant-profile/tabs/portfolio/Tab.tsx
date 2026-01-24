import { useFieldArray } from 'react-hook-form';
import { toast } from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';

import { PlusIcon } from '@heroicons/react/24/solid';

function PortfolioTab({
  control,
  watch,
  setValue,
  setCurrentTab,
  handleSubmit,
  isLoading,
  submitToSave,
}: {
  control: any;
  watch: any;
  setValue: any;
  setCurrentTab: any;
  handleSubmit: any;
  isLoading: boolean;
  submitToSave: any;
}) {
  const { fields, append, remove } = useFieldArray({
    control: control,
    name: 'portfolio',
  });

  const onSubmit = handleSubmit((data: any) => {
    submitToSave(data);
  });

  const handleAddProject = () => {
    append({
      name: '',
      description: '',
      link: '',
      imageFile: null,
    });
  };

  const handleRemoveProject = (index: number) => {
    remove(index);
  };

  const handleImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const maxFileSize = 10 * 1024 * 1024; // 10 MB
      if (file.size > maxFileSize) {
        toast.custom(() => <CustomToast message={`${file.name} exceeds 10MB limit.`} type='error' />, { duration: 2000 });
        return;
      }

      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast.custom(() => <CustomToast message={`${file.name}: Invalid file type. Only image files are allowed.`} type='error' />, { duration: 2000 });
        return;
      }

      setValue(`portfolio.${index}.imageFile`, file);
      setValue(`portfolio.${index}.imageUrl`, URL.createObjectURL(file));
    }
    e.target.value = '';
  };

  const renderPortfolioInputs = () => {
    return fields.map((field, index) => {
      const imageFile = watch(`portfolio.${index}.imageFile`);
      const imageUrl = watch(`portfolio.${index}.imageUrl`);

      return (
        <div
          key={field.id}
          className='relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 lg:gap-x-5 gap-y-4 mt-7 pt-6'
        >
          <div className='grid grid-cols-1 md:grid-cols-2 md:col-span-2 lg:col-span-4 gap-x-5 gap-y-4'>
            <div className='grid-item'>
              <label htmlFor='project-title' className='text-sm font-medium leading-6 text-gray-900'>
                Project Title
              </label>
              <div className='mt-2'>
                <input
                  type='text'
                  id='project-title'
                  onChange={(e) => setValue(`portfolio.${index}.name`, e.target.value)}
                  value={watch(`portfolio.${index}.name`) || ''}
                  className='rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6'
                  placeholder='e.g., E-commerce App Redesign'
                />
              </div>
            </div>
            <div className='grid-item'>
              <label htmlFor='project-link' className='text-sm font-medium leading-6 text-gray-900'>
                Project Link
              </label>
              <div className='mt-2'>
                <input
                  type='url'
                  id='project-link'
                  onChange={(e) => setValue(`portfolio.${index}.link`, e.target.value)}
                  value={watch(`portfolio.${index}.link`) || ''}
                  className='rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6'
                  placeholder='https://...'
                />
              </div>
            </div>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 col-span-2 gap-x-5 gap-y-4 mb-4 lg:mb-0'>
            {/* Empty spacer to maintain grid structure like experience tab */}
          </div>
          <div className='grid-item col-span-6'>
            <label htmlFor='description' className='text-sm font-medium leading-6 text-gray-900'>
              Description
            </label>
            <div className='mt-2'>
              <textarea
                id='description'
                onChange={(e) => setValue(`portfolio.${index}.description`, e.target.value)}
                value={watch(`portfolio.${index}.description`) || ''}
                rows={4}
                className='block w-full rounded-md border-0 p-[13.5px] text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6 resize-none'
                placeholder='Describe the project...'
              />
            </div>
          </div>
          <div className='grid-item col-span-6'>
            <label className='block text-sm font-medium leading-6 text-gray-900 mb-2'>
              Project Image
            </label>

            {!imageFile && !imageUrl ? (
              <label className='block w-full rounded-lg border-2 border-dashed border-gray-300 py-8 px-4 text-center cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors'>
                <span className='text-gray-600'>Drop image to upload or click to select</span>
                <input
                  type='file'
                  className='hidden'
                  onChange={(e) => handleImageUpload(index, e)}
                  accept='image/*'
                />
                <p className='text-xs text-gray-500 mt-2'>Maximum file size: 10 MB</p>
              </label>
            ) : (
              <div className='border border-gray-300 rounded-lg p-3 bg-white'>
                <img
                  src={imageUrl || (imageFile ? URL.createObjectURL(imageFile) : '')}
                  alt='Project preview'
                  className='w-full h-48 object-cover rounded mb-2'
                />
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-gray-600'>
                    {imageFile?.name || 'Uploaded image'}
                  </span>
                  <button
                    type='button'
                    onClick={() => {
                      setValue(`portfolio.${index}.imageFile`, null);
                      setValue(`portfolio.${index}.imageUrl`, null);
                    }}
                    className='text-sm text-red-600 hover:underline'
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>
          <button
            type='button'
            className='lg:mt-5 w-full md:w-1/2 rounded-md border border-red-600 flex justify-center items-center lg:px-[110px] px-10 py-2.5 text-sm font-semibold text-red-600 shadow-sm mb-4'
            onClick={() => handleRemoveProject(index)}
          >
            REMOVE
          </button>
        </div>
      );
    });
  };

  const handleBack = () => {
    setCurrentTab(4);
  };

  return (
    <form onSubmit={onSubmit}>
      <h5 className='text-xl font-semibold'>Portfolio</h5>
      <div>{renderPortfolioInputs()}</div>
      <button
        type='button'
        className='lg:mt-5 w-full md:w-auto rounded-md flex justify-center items-center bg-[#65C979] px-8 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#90d69e]'
        onClick={handleAddProject}
      >
        <PlusIcon className='h-5 w-5 mr-3' />
        ADD PROJECT
      </button>
      <div className='md:flex justify-between mt-10 md:mt-16 lg:mt-28 md:mb-5'>
        <button
          type='button'
          className='rounded-md w-full md:w-auto bg-white px-14 py-2.5 text-sm font-semibold text-savoy-blue border border-savoy-blue shadow-sm hover:bg-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
          onClick={handleBack}
          disabled={isLoading}
        >
          BACK
        </button>
        <button
          type='submit'
          className='w-auto rounded-md bg-savoy-blue px-14 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50'
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : 'SUBMIT'}
        </button>
      </div>
    </form>
  );
}

export default PortfolioTab;

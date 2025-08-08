import React, { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useRef } from 'react';
import { XCircleIcon } from '@heroicons/react/24/solid';
import CustomScreeningForm from './CustomScreeningForm';
import EditIcon from '@/svg/EditIcon';
import DeleteIcon from '@/svg/DeleteIcon';

interface CustomQuestionsModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onSave: (questions: any[]) => void;
  existingQuestions?: any[];
}

const CustomQuestionsModal: React.FC<CustomQuestionsModalProps> = ({
  isOpen,
  setIsOpen,
  onSave,
  existingQuestions = [],
}) => {
  const [customQuestions, setCustomQuestions] = useState<any[]>(existingQuestions);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<number | null>(null);
  const cancelButtonRef = useRef(null);

  // Update local state when existing questions change
  useEffect(() => {
    setCustomQuestions(existingQuestions);
  }, [existingQuestions]);

  const handleRemove = (id: number) => {
    const updatedQuestions = customQuestions.filter((q) => q.id !== id);
    setCustomQuestions(updatedQuestions);
  };

  const handleToggleMustHave = (id: number) => {
    const updatedQuestions = customQuestions.map((q) => 
      q.id === id ? { ...q, mustHave: !q.mustHave } : q
    );
    setCustomQuestions(updatedQuestions);
  };

  const handleEdit = (id: number) => {
    setEditingQuestion(id);
    setShowAddForm(true);
  };

  const handleSaveQuestion = (questionData: any) => {
    if (editingQuestion !== null) {
      // Update existing question
      const updatedQuestions = customQuestions.map(q => 
        q.id === editingQuestion ? { ...questionData, editable: false } : q
      );
      setCustomQuestions(updatedQuestions);
      setEditingQuestion(null);
    } else {
      // Add new question
      const newId = Math.max(...customQuestions.map(q => q.id), 0) + 1;
      
      // Generate unique preset ID
      const existingNumbers = customQuestions
        .map(q => {
          const match = q.presetId?.match(/custom-question-(\d+)/);
          return match ? parseInt(match[1]) : 0;
        })
        .filter(num => num > 0);
      const nextNumber = Math.max(...existingNumbers, 0) + 1;
      
      const newQuestion = { 
        ...questionData, 
        id: newId,
        editable: false, 
        recommended: false,
        presetId: `custom-question-${nextNumber}`
      };
      const updatedQuestions = [...customQuestions, newQuestion];
      setCustomQuestions(updatedQuestions);
    }
    setShowAddForm(false);
  };

  const handleSave = () => {
    onSave(customQuestions);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setCustomQuestions(existingQuestions);
    setShowAddForm(false);
    setEditingQuestion(null);
    setIsOpen(false);
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" initialFocus={cancelButtonRef} onClose={setIsOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all w-full max-w-4xl">
                <div className="flex bg-savoy-blue p-4 items-center">
                  <h3 className="flex-1 text-white font-semibold text-lg">
                    Add Custom Screening Questions
                  </h3>
                  <XCircleIcon 
                    className="w-8 h-8 text-white cursor-pointer" 
                    onClick={handleCancel}
                  />
                </div>

                <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
                  {/* Current Custom Questions Section */}
                  <div className="mb-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Custom Questions</h4>
                    
                    {customQuestions.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <p>No custom questions added yet.</p>
                        <p className="text-sm">Add your first custom question below.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {customQuestions.map((question) => (
                          <div key={question.id} className="bg-gray-50 p-4 rounded-lg border">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex-1">
                                <h5 className="font-medium text-gray-900">{question.question}</h5>
                                <p className="text-sm text-gray-600">
                                  Response Type: {question.responseType} | 
                                  {question.responseType === 'Text' ? (
                                    'No ideal answer required'
                                  ) : question.responseType === 'Multiple Choice' && Array.isArray(question.idealAnswer) ? (
                                    question.idealAnswer.length > 0 ? (
                                      `Ideal answers: ${question.idealAnswer.join(', ')}`
                                    ) : (
                                      'No ideal answers selected'
                                    )
                                  ) : (
                                    `Ideal answer: ${question.idealAnswer}`
                                  )} | 
                                  Must Have: {question.mustHave ? 'Yes' : 'No'} | 
                                  Show to Candidates: {question.showToCandidates ? 'Yes' : 'No'}
                                </p>
                              </div>
                              <div className="flex space-x-2 ml-4">
                                <button
                                  type="button"
                                  onClick={() => handleEdit(question.id)}
                                  className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                                  title="Edit question"
                                >
                                  <EditIcon />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRemove(question.id)}
                                  className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                                  title="Remove question"
                                >
                                  <DeleteIcon />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Add Custom Question Form */}
                  {showAddForm && (
                    <div className="mb-6">
                      <h4 className="text-lg font-medium text-gray-900 mb-4">
                        {editingQuestion !== null ? 'Edit Custom Question' : 'Add New Custom Question'}
                      </h4>
                      <CustomScreeningForm
                        onCancel={() => {
                          setShowAddForm(false);
                          setEditingQuestion(null);
                        }}
                        onSave={handleSaveQuestion}
                        editMode={editingQuestion !== null}
                        initialData={
                          editingQuestion !== null
                            ? customQuestions.find((q) => q.id === editingQuestion)
                            : undefined
                        }
                      />
                    </div>
                  )}

                  {/* Add Custom Question Button */}
                  {!showAddForm && (
                    <div className="mb-6">
                      <button
                        type="button"
                        onClick={() => setShowAddForm(true)}
                        className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-savoy-blue hover:text-savoy-blue transition-colors"
                      >
                        <div className="flex items-center justify-center">
                          <span className="text-xl mr-2">+</span>
                          <span>Add Custom Question</span>
                        </div>
                      </button>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    className="px-4 py-2 text-sm font-medium text-white bg-savoy-blue rounded-md hover:opacity-90"
                  >
                    Save Questions
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default CustomQuestionsModal; 
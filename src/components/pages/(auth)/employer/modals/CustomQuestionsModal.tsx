import React, { useState, useEffect, Fragment, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';

import CustomScreeningForm from './CustomScreeningForm';

import { XCircleIcon } from '@heroicons/react/24/solid';
import EditIcon from '@/svg/EditIcon';
import DeleteIcon from '@/svg/DeleteIcon';
import WarningRed from '@/svg/WarningRed';

interface CustomQuestionsModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onSave: (questions: any[]) => void;
  existingQuestions: any[];
}

const CustomQuestionsModal: React.FC<CustomQuestionsModalProps> = ({
  isOpen,
  setIsOpen,
  onSave,
  existingQuestions,
}) => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<any>(null);
  const [deleteModal, setDeleteModal] = useState<{
    id: number;
    open: boolean;
    question?: string;
  } | null>(null);

  // Ref for the add form section
  const addFormRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (existingQuestions) {
      setQuestions(existingQuestions);
    }
  }, [existingQuestions]);

  const handleAddQuestion = (questionData: any) => {
    const newQuestion = {
      ...questionData,
      id: Date.now(), // Simple ID generation
    };

    if (editingQuestion !== null) {
      // Update existing question
      const updatedQuestions = [...questions];
      updatedQuestions[editingQuestion] = newQuestion;
      setQuestions(updatedQuestions);
      setEditingQuestion(null);
    } else {
      // Add new question
      setQuestions([...questions, newQuestion]);
    }
    setShowAddForm(false);
  };

  const handleEditQuestion = (index: number) => {
    setEditingQuestion(index);
    setShowAddForm(true);
    // Scroll to form after state update
    setTimeout(() => {
      addFormRef.current?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }, 100);
  };

  const handleDeleteQuestion = (index: number) => {
    const question = questions[index];
    setDeleteModal({
      id: index,
      open: true,
      question: question.question,
    });
  };

  const handleConfirmDelete = (index: number) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
    setDeleteModal(null);
  };

  const handleSave = () => {
    onSave(questions);
    setIsOpen(false);
  };

  const handleAddNewQuestion = () => {
    setEditingQuestion(null);
    setShowAddForm(true);
    // Scroll to form after state update
    setTimeout(() => {
      addFormRef.current?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }, 100);
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => setIsOpen(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="bg-[#2563eb] px-6 py-4 flex justify-between items-center">
                  <h3 className="text-lg font-medium text-white">
                    Add Custom Screening Questions
                  </h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:text-gray-200 transition-colors"
                  >
                    <XCircleIcon className="h-6 w-6" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Existing Questions List - Scrollable */}
                  <div className="mb-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">
                      Existing Questions ({questions.length})
                    </h4>
                    <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg p-4 space-y-3">
                      {questions.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">
                          No custom questions added yet.
                        </p>
                      ) : (
                        questions.map((question, index) => (
                          <div
                            key={index}
                            className="bg-gray-50 p-3 rounded-lg border border-gray-200"
                          >
                            <div className="flex justify-between items-center">
                              <div className="flex-1">
                                <p className="font-medium text-gray-900 mb-2">
                                  {question.question}
                                </p>
                                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                  <span>
                                    <span className="font-medium">Response Type:</span> {question.responseType || 'Text'}
                                  </span>
                                  <span>
                                    <span className="font-medium">Ideal answer:</span> {Array.isArray(question.idealAnswer) 
                                      ? question.idealAnswer.join(', ') 
                                      : question.idealAnswer}
                                  </span>
                                  <span>
                                    <span className="font-medium">Must Have:</span> {question.mustHave ? 'Yes' : 'No'}
                                  </span>
                                  <span>
                                    <span className="font-medium">Show to Candidates:</span> {question.showToCandidates ? 'Yes' : 'No'}
                                  </span>
                                </div>
                              </div>
                              <div className="flex space-x-2 ml-4">
                                <button
                                  onClick={() => handleEditQuestion(index)}
                                  className="text-gray-600 hover:text-blue-600 transition-colors"
                                >
                                  <EditIcon/>
                                </button>
                                <button
                                  onClick={() => handleDeleteQuestion(index)}
                                  className="text-gray-600 hover:text-red-600 transition-colors"
                                >
                                  <DeleteIcon/>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Add Custom Question Button - Fixed outside scrollable */}
                  <div className="mb-6">
                    <button
                      onClick={handleAddNewQuestion}
                      className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors"
                    >
                      <span className="text-blue-600 font-medium">+ Add Custom Question</span>
                    </button>
                  </div>

                  {/* Add Custom Question Form - Only show when clicked */}
                  {showAddForm && (
                    <div ref={addFormRef} className="border-2 border-dashed border-blue-300 rounded-lg p-6 bg-blue-50">
                      <CustomScreeningForm
                        onSave={handleAddQuestion}
                        onCancel={() => {
                          setShowAddForm(false);
                          setEditingQuestion(null);
                        }}
                        editMode={editingQuestion !== null}
                        initialData={editingQuestion !== null ? questions[editingQuestion] : undefined}
                      />
                    </div>
                  )}

                  {/* Simple Delete Confirmation Overlay - INSIDE the Dialog.Panel */}
                  {deleteModal?.open && (
                    <div className="absolute inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-[60]">
                      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 transform transition-all duration-200 ease-out">
                        <div className="flex items-center mb-4">
                          <WarningRed />
                          <h3 className="text-lg font-medium text-gray-900">
                            Delete Question
                          </h3>
                        </div>
                        <p className="text-gray-600 mb-6">
                          Are you sure you want to delete this question? This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-3">
                          <button
                            onClick={() => setDeleteModal(null)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => {
                              if (deleteModal) {
                                handleConfirmDelete(deleteModal.id);
                              }
                            }}
                            className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Save Questions
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default CustomQuestionsModal;
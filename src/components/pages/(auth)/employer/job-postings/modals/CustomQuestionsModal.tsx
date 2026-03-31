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
              <Dialog.Panel className="w-full max-w-xs sm:max-w-2xl lg:max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="bg-[#2563eb] px-4 sm:px-6 py-4 flex justify-between items-center">
                  <h3 className="text-base sm:text-lg font-medium text-white">
                    Add Custom Screening Questions
                  </h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:text-gray-200 transition-colors"
                  >
                    <XCircleIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6">
                  {/* Existing Questions List - Scrollable */}
                  <div className="mb-6">
                    <h4 className="text-base sm:text-lg font-medium text-gray-900 mb-4">
                      Existing Questions ({questions.length})
                    </h4>
                    <div className="max-h-80 sm:max-h-96 overflow-y-auto border border-gray-200 rounded-lg p-3 sm:p-4 space-y-3">
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
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                              <div className="flex-1">
                                <p className="font-medium text-gray-900 mb-2 break-words">
                                  {question.question}
                                </p>
                                <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 text-sm text-gray-600">
                                  <span>
                                    <span className="font-medium">Response Type:</span> {question.responseType || 'Text'}
                                  </span>
                                  <span>
                                    <span className="font-medium">Ideal answer:</span> 
                                    {Array.isArray(question.idealAnswer) ? (
                                      <span className="ml-1">
                                        {question.idealAnswer.map((answer: string, idx: number) => (
                                          <span key={idx} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded font-medium ml-1">
                                            {answer}
                                          </span>
                                        ))}
                                      </span>
                                    ) : (
                                      <span className={`ml-1 font-medium ${question.idealAnswer === 'Yes' ? 'text-green-600' : 'text-red-600'}`}>
                                        {question.idealAnswer}
                                      </span>
                                    )}
                                  </span>
                                  <span>
                                    <span className="font-medium">Must Have:</span> 
                                    <span className={`ml-1 font-medium ${question.mustHave ? 'text-green-600' : 'text-red-600'}`}>
                                      {question.mustHave ? 'Yes' : 'No'}
                                    </span>
                                  </span>
                                  <span>
                                    <span className="font-medium">Show to Candidates:</span> 
                                    <span className={`ml-1 font-medium ${question.showToCandidates ? 'text-green-600' : 'text-red-600'}`}>
                                      {question.showToCandidates ? 'Yes' : 'No'}
                                    </span>
                                  </span>
                                </div>
                              </div>
                              <div className="flex space-x-2 sm:ml-4">
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
                      className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors"
                    >
                      <span className="text-blue-600 font-medium">+ Add Custom Question</span>
                    </button>
                  </div>

                  {/* Add Custom Question Form - Only show when clicked */}
                  {showAddForm && (
                    <div ref={addFormRef} className="border-2 border-dashed border-blue-300 rounded-lg p-4 sm:p-6 bg-blue-50">
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
                    <div className="absolute inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-[60] p-4">
                      <div className="relative transform overflow-hidden rounded-lg bg-white pb-4 text-left shadow-xl transition-all w-full max-w-sm sm:w-[500px]">
                        <div className="flex justify-center py-6 sm:py-8 px-2">
                          <WarningRed />
                        </div>
                        <div className="text-lg sm:text-xl px-4 sm:px-20 text-center">
                          <p className="text-lg sm:text-xl text-gray-600 font-bold">
                            Are you sure you want to <span className="text-red-500">delete</span> this question?
                          </p>
                          {deleteModal.question && (
                            <p className="text-sm text-gray-500 mt-2 italic break-words">
                              "{deleteModal.question}"
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col sm:flex-row justify-center w-full px-4 space-y-3 sm:space-y-0 sm:space-x-8 pt-6 sm:pt-10 pb-7">
                          <span className="flex w-full rounded-md shadow-sm sm:w-auto">
                            <button
                              type="button"
                              className="inline-flex justify-center drop-shadow-xl w-full rounded-md border border-blue-600 px-8 sm:px-20 py-2 bg-white text-base leading-6 font-bold text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue transition ease-in-out duration-150 sm:text-sm sm:leading-5"
                              onClick={() => setDeleteModal(null)}
                            >
                              No
                            </button>
                          </span>
                          <span className="flex w-full rounded-md shadow-sm sm:w-auto">
                            <button
                              type="button"
                              className="inline-flex justify-center drop-shadow-xl w-full rounded-md border border-transparent px-8 sm:px-20 py-2 bg-blue-600 text-base leading-6 font-bold text-white shadow-sm hover:bg-gray-500 focus:outline-none focus:shadow-outline-green transition ease-in-out duration-150 sm:text-sm sm:leading-5"
                              onClick={() => {
                                if (deleteModal) {
                                  handleConfirmDelete(deleteModal.id);
                                }
                              }}
                            >
                              Yes
                            </button>
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-4 sm:px-6 py-4 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
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
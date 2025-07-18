import { useEffect, Dispatch, useState } from 'react';
import ToggleSection from '../ToggleSection';
import ScreeningQuestion from '../ScreeningQuestion';
import CustomScreeningForm from '../CustomScreeningForm';
import PresetQuestionOptions, { PRESET_QUESTIONS } from '../PresetQuestionOptions';
import EditIcon from '@/svg/EditIcon';

// Extend Window interface to include our custom properties
declare global {
  interface Window {
    screeningQuestions: any[];
    autoRejectEnabled: boolean;
  }
}

export default function CreateJobPageJobSettings({
  setPageNumber,
  onSubmit,
  screeningQuestions: initialScreeningQuestions,
  autoRejectEnabled: initialAutoRejectEnabled,
}: {
  setPageNumber: Dispatch<number>;
  onSubmit: () => void;
  screeningQuestions?: any[];
  autoRejectEnabled?: boolean;
}) {
  // Only use default questions if no screeningQuestions are provided
  const [screeningQuestions, setScreeningQuestions] = useState<any[]>(() => {
    if (initialScreeningQuestions && initialScreeningQuestions.length > 0) {
      return initialScreeningQuestions;
    }
    // Default questions
    return [
      {
        id: 1,
        question: "Do you have a valid driver's license?",
        idealAnswer: 'Yes',
        responseType: 'Yes / No',
        mustHave: true,
        recommended: true,
        editable: false,
        degree: undefined,
        presetId: 'drivers-license',
      },
      {
        id: 2,
        question: "Have you completed the following level of education: Bachelor's Degree?",
        idealAnswer: 'Yes',
        responseType: 'Yes / No',
        mustHave: true,
        recommended: true,
        editable: false,
        degree: "Bachelor's Degree",
        presetId: 'education',
      },
    ];
  });
  
  // Sync the prop to state in CreateJobPageJobSettings
  useEffect(() => {
    if (initialScreeningQuestions && initialScreeningQuestions.length > 0) {
      setScreeningQuestions(initialScreeningQuestions);
    }
  }, [initialScreeningQuestions]);

  const [isScreeningOpen, setIsScreeningOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showPresetOptions, setShowPresetOptions] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<number | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  
  // Rejection settings state
  const [isRejectionSettingsOpen, setIsRejectionSettingsOpen] = useState(false);
  // Initialize auto-reject settings from window if available
  const [autoRejectEnabled, setAutoRejectEnabled] = useState<boolean>(
    initialAutoRejectEnabled !== undefined
      ? initialAutoRejectEnabled
      : (window.autoRejectEnabled !== undefined ? window.autoRejectEnabled : true)
  );

  // Selected preset options - initialize from existing questions
  const [selectedPresets, setSelectedPresets] = useState(() => {
    if (window.screeningQuestions && window.screeningQuestions.length > 0) {
      return window.screeningQuestions
        .filter(q => q.presetId)
        .map(q => q.presetId);
    }
    return ['drivers-license', 'education'];
  });

  // Handlers for question actions
  const handleRemove = (id: number) => {
    const question = screeningQuestions.find(q => q.id === id);
    setScreeningQuestions((prev) => prev.filter((q) => q.id !== id));
    
    // If it's a preset question, remove it from selected presets
    if (question?.presetId) {
      setSelectedPresets(prev => prev.filter(p => p !== question.presetId));
    }
  };

  const handleToggleMustHave = (id: number) => {
    setScreeningQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, mustHave: !q.mustHave } : q))
    );
  };

  const handleEdit = (id: number) => {
    setEditingQuestion(id);
    setShowAddForm(true);
    setShowPresetOptions(false);
  };

  const handleSaveQuestion = (questionData: any) => {
    if (editingQuestion !== null) {
      // Update existing question
      setScreeningQuestions(prev => 
        prev.map(q => q.id === editingQuestion ? { ...questionData, editable: false } : q)
      );
      setEditingQuestion(null);
    } else {
      // Add new question
      // Generate a consistent integer ID instead of timestamp
      const newId = Math.max(...screeningQuestions.map(q => q.id), 0) + 1;
      const newQuestion = { 
        ...questionData, 
        id: newId,
        editable: false, 
        recommended: false,
        presetId: 'custom-question'
      };
      setScreeningQuestions(prev => [...prev, newQuestion]);
      
      // Add to selected presets if not already there
      if (!selectedPresets.includes('custom-question')) {
        setSelectedPresets(prev => [...prev, 'custom-question']);
      }
    }
    setShowAddForm(false);
  };

  const handleSelectPreset = (presetId: string) => {
    if (presetId === 'custom-question') {
      setShowAddForm(true);
      return;
    }
    
    if (selectedPresets.includes(presetId)) {
      // Remove the preset
      setSelectedPresets(prev => prev.filter(id => id !== presetId));
      setScreeningQuestions(prev => prev.filter(q => q.presetId !== presetId));
    } else {
      // Add the preset
      setSelectedPresets(prev => [...prev, presetId]);
      
      // Add the preset question
      const preset = PRESET_QUESTIONS[presetId as keyof typeof PRESET_QUESTIONS];
      if (preset) {
        // Generate a consistent integer ID instead of timestamp
        const newId = Math.max(...screeningQuestions.map(q => q.id), 0) + 1;
        setScreeningQuestions(prev => [
          ...prev, 
          {
            id: newId,
            question: preset.question,
            idealAnswer: preset.idealAnswer,
            responseType: preset.responseType,
            mustHave: false,
            recommended: true,
            editable: false,
            degree: undefined,
            presetId: presetId
          }
        ]);
      }
    }
  };

  // Toggle screening questions section
  const toggleScreeningSection = () => {
    setIsScreeningOpen(!isScreeningOpen);
    if (!isScreeningOpen) {
      setShowPresetOptions(true);
    }
  };
  
  // Toggle rejection settings section
  const toggleRejectionSettings = () => {
    setIsRejectionSettingsOpen(!isRejectionSettingsOpen);
  };
  
  // Toggle auto-reject functionality
  const toggleAutoReject = () => {
    setAutoRejectEnabled(!autoRejectEnabled);
  };

  // Handle submission with validation
  const handleSubmit = () => {
    if (screeningQuestions.length < 3) {
      setValidationError("At least 3 screening questions are required");
      setIsScreeningOpen(true);
      return;
    }
    setValidationError(null);
    
    // Add screening questions and auto-reject settings to global form state
    window.screeningQuestions = screeningQuestions;
    window.autoRejectEnabled = autoRejectEnabled;
    
    onSubmit();
  };

  // Determine if edit icon should be shown for screening questions
  const showEditIcon = screeningQuestions.length > 0;

  return (
    <>
      <div className="px-4 pb-6">
        <div className="sm:col-span-4 mt-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">Job settings</h2>
          <p className="text-sm text-gray-400 mb-6">
            Your settings control how you screen and collect applicants.
          </p>

          {/* Screening Questions Section */}
          <div className="flex items-start justify-between border-b border-gray-200 py-4">
            <div className="flex-grow">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-gray-900">Screening questions</div>
                <button 
                  type="button" 
                  className="ml-4 p-1 rounded hover:bg-gray-100"
                  onClick={toggleScreeningSection}
                >
                  {/* Edit Icon */}
                  <span className="sr-only">Edit</span>
                  <EditIcon />
                </button>
              </div>

              {/* Show Questions in Collapsed View */}
              {!isScreeningOpen && screeningQuestions.length > 0 && (
                <div className="ml-5 text-sm text-gray-900">
                  <ol className="list-decimal">
                    {screeningQuestions.map((question, index) => (
                      <li key={question.id} className={index > 0 ? 'mt-2' : ''}>
                        {question.question}
                        <div className="text-xs text-gray-500">
                          Ideal answer: {question.idealAnswer}
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
              
              {/* No questions message when collapsed */}
              {!isScreeningOpen && screeningQuestions.length === 0 && (
                <div className="text-sm text-gray-500">
                  No screening questions added. Click edit to add questions.
                </div>
              )}
            </div>
          </div>

          {/* Expanded Screening Questions Section */}
          {isScreeningOpen && (
            <div className="py-4 border-b border-gray-200">
              {/* Validation error message */}
              {validationError && (
                <div className="mb-4 p-2 bg-red-50 text-red-700 rounded border border-red-300 text-sm">
                  {validationError}
                </div>
              )}

              {/* List of current questions */}
              {screeningQuestions.map((q) => (
                <ScreeningQuestion
                  key={q.id}
                  question={q.question}
                  idealAnswer={q.idealAnswer}
                  degree={q.degree}
                  mustHave={q.mustHave}
                  recommended={q.recommended}
                  onRemove={() => handleRemove(q.id)}
                  onToggleMustHave={() => handleToggleMustHave(q.id)}
                  editable={true}
                  onEdit={() => handleEdit(q.id)}
                />
              ))}

              {/* Add custom or preset question options */}
              {screeningQuestions.length === 0 ? (
                <div className="text-center my-6 text-gray-500">
                  No screening questions yet. Add some questions below.
                </div>
              ) : null}
              
              {/* Custom question form */}
              {showAddForm && !editingQuestion && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Write a custom question</h3>
                  <CustomScreeningForm
                    onCancel={() => {
                      setShowAddForm(false);
                      setEditingQuestion(null);
                    }}
                    onSave={handleSaveQuestion}
                    editMode={false}
                  />
                </div>
              )}

              {/* Editing existing question */}
              {showAddForm && editingQuestion !== null && (
                <CustomScreeningForm
                  onCancel={() => {
                    setShowAddForm(false);
                    setEditingQuestion(null);
                  }}
                  onSave={handleSaveQuestion}
                  editMode={true}
                  initialData={
                    screeningQuestions.find((q) => q.id === editingQuestion)
                  }
                />
              )}

              {/* Preset question options section */}
              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <button
                    className="text-savoy-blue text-sm font-medium hover:underline flex items-center"
                    onClick={() => setShowPresetOptions(!showPresetOptions)}
                    type="button"
                  >
                    {showPresetOptions ? (
                      <>
                        <span className="mr-1">▼</span> Hide screening questions
                      </>
                    ) : (
                      <>
                        <span className="mr-1">▶</span> Add screening questions
                      </>
                    )}
                  </button>
                </div>

                {/* Preset question options */}
                {showPresetOptions && (
                  <PresetQuestionOptions
                    onSelectOption={handleSelectPreset}
                    selectedOptions={selectedPresets}
                  />
                )}
              </div>
            </div>
          )}

          {/* Rejection Settings */}
          <div className="flex items-start justify-between border-b border-gray-200 py-4">
            <div>
              <div className="text-sm font-medium text-gray-900 mb-1">Rejection settings</div>
              <div className="text-sm text-gray-900">{autoRejectEnabled ? 'Enabled' : 'Disabled'}</div>
              <div className="text-xs text-gray-500 max-w-md">
                Filter out and send rejections to applicants who don&apos;t provide ideal answers to must-have screening questions.
              </div>
            </div>
            <button 
              type="button" 
              className="ml-4 p-1 rounded hover:bg-gray-100"
              onClick={toggleRejectionSettings}
            >
              <span className="sr-only">Edit</span>
              <EditIcon />
            </button>
          </div>

          {/* Expanded Rejection Settings */}
          {isRejectionSettingsOpen && (
            <div className="py-4 border-b border-gray-200">
              <div className="bg-white p-4 rounded-md border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm font-medium text-gray-900">Automatic rejection</div>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input 
                      type="checkbox" 
                      name="toggle" 
                      id="autoReject" 
                      checked={autoRejectEnabled}
                      onChange={toggleAutoReject}
                      className="checked:bg-savoy-blue outline-none focus:outline-none right-4 checked:right-0 duration-200 ease-in absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                    />
                    <label 
                      htmlFor="autoReject" 
                      className={`block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer ${autoRejectEnabled ? 'bg-savoy-blue/40' : ''}`}
                    ></label>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  {autoRejectEnabled 
                    ? "Applicants who don't provide ideal answers to must-have screening questions will be automatically rejected."
                    : "Applicants who don't provide ideal answers to must-have screening questions will still be considered."}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      <hr />
      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse justify-between px-4">
        <button
          id="pageJobSettingsNextBtn"
          type="button"
          className="inline-flex w-full justify-center rounded-md bg-savoy-blue px-3 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 sm:ml-3 sm:w-auto"
          onClick={handleSubmit}
        >
          Next
        </button>
        <button
          id="pageJobSettingsBackBtn"
          type="button"
          className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-savoy-blue shadow-sm ring-1 ring-inset ring-savoy-blue hover:bg-gray-50 sm:mt-0 sm:w-auto"
          onClick={() => setPageNumber(4)}
        >
          Back
        </button>
      </div>
    </>
  );
}

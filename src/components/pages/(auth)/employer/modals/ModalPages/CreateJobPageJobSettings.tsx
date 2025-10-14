import { useEffect, Dispatch, useState } from 'react';
import ToggleSection from '../ToggleSection';
import ScreeningQuestion from '../ScreeningQuestion';
import CustomScreeningForm from '../CustomScreeningForm';
import CustomQuestionsModal from '../CustomQuestionsModal';
import PresetQuestionOptions, { PRESET_QUESTIONS } from '../PresetQuestionOptions';
import EditIcon from '@/svg/EditIcon';
import MinusIconWithBorder from '@/svg/MinusIconWithBorder';
// Extend Window interface to include our custom properties
declare global {
  interface Window {
    screeningQuestions: any[];
    autoRejectEnabled: boolean;
    rejectionFeedback?: string;
  }
}

export default function CreateJobPageJobSettings({
  setPageNumber,
  onSubmit,
  screeningQuestions: initialScreeningQuestions,
  setScreeningQuestions,
  autoRejectEnabled,
  setAutoRejectEnabled,
  initialRejectionFeedback,
}: {
  setPageNumber: Dispatch<number>;
  onSubmit: () => void;
  screeningQuestions?: any[];
  setScreeningQuestions?: (questions: any[]) => void;
  autoRejectEnabled?: boolean;
  setAutoRejectEnabled?: (enabled: boolean) => void;
  initialRejectionFeedback?: string;
}) {
  // Only use default questions if no screeningQuestions are provided
  const [screeningQuestions, setLocalScreeningQuestions] = useState<any[]>(() => {
    // Only use initialScreeningQuestions if they exist AND are not empty
    if (initialScreeningQuestions && initialScreeningQuestions.length > 0) {
      return initialScreeningQuestions;
    }
    // Always use default questions for new job creation
    return [
    {
      id: 1,
      question: "Do you have a valid driver's license?",
      idealAnswer: 'Yes',
      responseType: 'Yes / No',
      mustHave: true,
      showToCandidates: true,
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
      showToCandidates: true,
      recommended: true,
      editable: false,
      degree: "Bachelor's Degree",
      presetId: 'education',
    },
    ];
  });
  
  // Sync the prop to state in CreateJobPageJobSettings
  useEffect(() => {
    // Only sync if initialScreeningQuestions exist AND are not empty
    if (initialScreeningQuestions && initialScreeningQuestions.length > 0) {
      setLocalScreeningQuestions(initialScreeningQuestions);
      // Update custom questions state
      const customQuestions = initialScreeningQuestions.filter(q => q.presetId && q.presetId.startsWith('custom-question'));
      setCustomQuestions(customQuestions);
      
      // Update next custom question number
      const customQuestionNumbers = customQuestions.map(q => {
        const match = q.presetId.match(/custom-question-(\d+)/);
        return match ? parseInt(match[1]) : 0;
      });
      setNextCustomQuestionNumber(Math.max(...customQuestionNumbers, 0) + 1);
    }
    // If initialScreeningQuestions is empty/undefined, don't sync - keep defaults
  }, [initialScreeningQuestions]);

  // Deduplicate questions when initializing
  useEffect(() => {
    if (initialScreeningQuestions && initialScreeningQuestions.length > 0) {
      // Check for duplicate questions
      const questionMap = new Map();
      const uniqueQuestions = [];
      
      for (const question of initialScreeningQuestions) {
        const lowerQuestion = question.question.toLowerCase();
        
        // Check if we have a similar question
        let key = '';
        if (lowerQuestion.includes("driver's license")) {
          key = 'drivers-license';
        } else if (lowerQuestion.includes("background check")) {
          key = 'background-check';
        } else if (lowerQuestion.includes("drug test")) {
          key = 'drug-test';
        } else if (lowerQuestion.includes("education") || lowerQuestion.includes("degree")) {
          key = 'education';
        } else {
          key = question.id;
        }
        
        // If we haven't seen this question type before, add it
        if (!questionMap.has(key)) {
          questionMap.set(key, true);
          uniqueQuestions.push({
            ...question,
            presetId: key === question.id ? question.presetId : key
          });
        }
      }
      
      // Only update if we found duplicates
      if (uniqueQuestions.length < initialScreeningQuestions.length) {
        setLocalScreeningQuestions(uniqueQuestions);
        
        // Update parent component state if available
        if (setScreeningQuestions) {
          setScreeningQuestions(uniqueQuestions);
        }
      }
    }
  }, [initialScreeningQuestions, setScreeningQuestions]);
  
  const [isScreeningOpen, setIsScreeningOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showPresetOptions, setShowPresetOptions] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<number | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  
  // Custom questions modal state
  const [isCustomQuestionsModalOpen, setIsCustomQuestionsModalOpen] = useState(false);
  const [customQuestions, setCustomQuestions] = useState<any[]>(() => {
    if (initialScreeningQuestions && initialScreeningQuestions.length > 0) {
      return initialScreeningQuestions.filter(q => q.presetId && q.presetId.startsWith('custom-question'));
    }
    return [];
  });
  const [nextCustomQuestionNumber, setNextCustomQuestionNumber] = useState(() => {
    if (initialScreeningQuestions && initialScreeningQuestions.length > 0) {
      const customQuestionNumbers = initialScreeningQuestions
        .filter(q => q.presetId && q.presetId.startsWith('custom-question'))
        .map(q => {
          const match = q.presetId.match(/custom-question-(\d+)/);
          return match ? parseInt(match[1]) : 0;
        });
      return Math.max(...customQuestionNumbers, 0) + 1;
    }
    return 1;
  });
  
  // Rejection settings state
  const [isRejectionSettingsOpen, setIsRejectionSettingsOpen] = useState(false);
  // Personalized feedback for rejections
  const [rejectionFeedback, setRejectionFeedback] = useState<string>(() => {
    // Initialize from prop if available (for editing existing job postings)
    return initialRejectionFeedback || window.rejectionFeedback || '';
  });

  // Selected preset options - initialize from existing questions
  const [selectedPresets, setSelectedPresets] = useState(() => {
    const presets = new Set<string>();
    
    if (initialScreeningQuestions && initialScreeningQuestions.length > 0) {
      // First add any explicit presetIds
      initialScreeningQuestions
        .filter(q => q.presetId && !q.presetId.startsWith('custom-question'))
        .forEach(q => presets.add(q.presetId));
      
      // Then check for matches by question content
      initialScreeningQuestions.forEach(q => {
        // Check for driver's license question
        if (q.question.toLowerCase().includes("driver's license")) {
          presets.add('drivers-license');
        }
        // Check for background check question
        if (q.question.toLowerCase().includes("background check")) {
          presets.add('background-check');
        }
        // Check for education question
        if (q.question.toLowerCase().includes("education") || 
            q.question.toLowerCase().includes("degree")) {
          presets.add('education');
        }
        // Check for drug test question
        if (q.question.toLowerCase().includes("drug test")) {
          presets.add('drug-test');
        }
      });
      
      // Add custom-question if any custom questions exist
      const hasCustomQuestions = initialScreeningQuestions.some(q => 
        q.presetId && q.presetId.startsWith('custom-question')
      );
      if (hasCustomQuestions) {
        presets.add('custom-question');
      }
      
      return Array.from(presets);
    }
    
    return ['drivers-license', 'education'];
  });
  
  // Update selected presets when questions change
  useEffect(() => {
    const presets = new Set<string>();
    
    if (initialScreeningQuestions && initialScreeningQuestions.length > 0) {
      // First add any explicit presetIds
      initialScreeningQuestions
        .filter(q => q.presetId && !q.presetId.startsWith('custom-question'))
        .forEach(q => presets.add(q.presetId));
      
      // Then check for matches by question content
      initialScreeningQuestions.forEach(q => {
        // Check for driver's license question
        if (q.question.toLowerCase().includes("driver's license")) {
          presets.add('drivers-license');
        }
        // Check for background check question
        if (q.question.toLowerCase().includes("background check")) {
          presets.add('background-check');
        }
        // Check for education question
        if (q.question.toLowerCase().includes("education") || 
            q.question.toLowerCase().includes("degree")) {
          presets.add('education');
        }
        // Check for drug test question
        if (q.question.toLowerCase().includes("drug test")) {
          presets.add('drug-test');
        }
      });
      
      // Add custom-question if any custom questions exist
      const hasCustomQuestions = initialScreeningQuestions.some(q => 
        q.presetId && q.presetId.startsWith('custom-question')
      );
      if (hasCustomQuestions) {
        presets.add('custom-question');
      }
      
      setSelectedPresets(Array.from(presets));
    }
  }, [initialScreeningQuestions]);

  // Update rejection feedback when prop changes (for editing existing job postings)
  useEffect(() => {
    if (initialRejectionFeedback && initialRejectionFeedback !== rejectionFeedback) {
      setRejectionFeedback(initialRejectionFeedback);
    }
  }, [initialRejectionFeedback]);

  // Handlers for question actions
  const handleRemove = (id: number) => {
    const question = screeningQuestions.find(q => q.id === id);
    const updatedQuestions = screeningQuestions.filter((q) => q.id !== id);
    setLocalScreeningQuestions(updatedQuestions);
    
    // Update parent component state if available
    if (setScreeningQuestions) {
      setScreeningQuestions(updatedQuestions);
    }
    
    // If it's a custom question, update custom questions state
    if (question?.presetId && question.presetId.startsWith('custom-question')) {
      setCustomQuestions(prev => prev.filter(q => q.id !== id));
    }
    
    // If it's a preset question, remove it from selected presets
    if (question?.presetId && !question.presetId.startsWith('custom-question')) {
      setSelectedPresets(prev => prev.filter(p => p !== question.presetId));
    }
  };

  const handleToggleMustHave = (id: number) => {
    const question = screeningQuestions.find(q => q.id === id);
    const updatedQuestions = screeningQuestions.map((q) => 
      q.id === id ? { ...q, mustHave: !q.mustHave } : q
    );
    setLocalScreeningQuestions(updatedQuestions);
    
    // Update parent component state if available
    if (setScreeningQuestions) {
      setScreeningQuestions(updatedQuestions);
    }
    
    // If it's a custom question, update custom questions state
    if (question?.presetId && question.presetId.startsWith('custom-question')) {
      setCustomQuestions(prev => 
        prev.map(q => q.id === id ? { ...q, mustHave: !q.mustHave } : q)
      );
    }
  };

  const handleToggleShowToCandidates = (id: number) => {
    const question = screeningQuestions.find(q => q.id === id);
    const updatedQuestions = screeningQuestions.map((q) => 
      q.id === id ? { ...q, showToCandidates: !q.showToCandidates } : q
    );
    setLocalScreeningQuestions(updatedQuestions);
    
    // Update parent component state if available
    if (setScreeningQuestions) {
      setScreeningQuestions(updatedQuestions);
    }
    
    // If it's a custom question, update custom questions state
    if (question?.presetId && question.presetId.startsWith('custom-question')) {
      setCustomQuestions(prev => 
        prev.map(q => q.id === id ? { ...q, showToCandidates: !q.showToCandidates } : q)
      );
    }
  };

  const handleEdit = (id: number) => {
    setEditingQuestion(id);
    setShowAddForm(true);
    setShowPresetOptions(false);
  };

  const handleSaveQuestion = (questionData: any) => {
    if (editingQuestion !== null) {
      // Update existing question
      const updatedQuestions = screeningQuestions.map(q => q.id === editingQuestion ? { ...questionData, editable: false } : q);
      setLocalScreeningQuestions(updatedQuestions);
      setEditingQuestion(null);
      
      // Update parent component state if available
      if (setScreeningQuestions) {
        setScreeningQuestions(updatedQuestions);
      }
    } else {
      // Add new question
      // Generate a consistent integer ID instead of timestamp
      const newId = Math.max(...screeningQuestions.map(q => q.id), 0) + 1;
      const newQuestion = { 
        ...questionData, 
        id: newId,
        editable: false, 
        recommended: false,
        presetId: `custom-question-${nextCustomQuestionNumber}`
      };
      const updatedQuestions = [...screeningQuestions, newQuestion];
      setLocalScreeningQuestions(updatedQuestions);
      
      // Update next custom question number
      setNextCustomQuestionNumber(prev => prev + 1);
      
      // Update parent component state if available
      if (setScreeningQuestions) {
        setScreeningQuestions(updatedQuestions);
      }
      
      // Add to selected presets if not already there
      if (!selectedPresets.includes('custom-question')) {
        setSelectedPresets(prev => [...prev, 'custom-question']);
      }
    }
    setShowAddForm(false);
  };

  const handleSaveCustomQuestions = (questions: any[]) => {
    // Generate unique preset IDs for new custom questions
    const updatedQuestions = questions.map((question, index) => {
      if (!question.presetId || !question.presetId.startsWith('custom-question')) {
        // Generate new preset ID for questions that don't have one
        const newPresetId = `custom-question-${nextCustomQuestionNumber + index}`;
        return { ...question, presetId: newPresetId };
      }
      return question;
    });
    
    // Update custom questions state
    setCustomQuestions(updatedQuestions);
    
    // Update next custom question number
    const maxNumber = Math.max(
      ...updatedQuestions.map(q => {
        const match = q.presetId.match(/custom-question-(\d+)/);
        return match ? parseInt(match[1]) : 0;
      }),
      nextCustomQuestionNumber - 1
    );
    setNextCustomQuestionNumber(maxNumber + 1);
    
    // Filter out existing custom questions from screening questions
    const nonCustomQuestions = screeningQuestions.filter(q => !q.presetId || !q.presetId.startsWith('custom-question'));
    
    // Add new custom questions to the main screening questions
    const updatedScreeningQuestions = [...nonCustomQuestions, ...updatedQuestions];
    setLocalScreeningQuestions(updatedScreeningQuestions);
    
    // Update parent component state if available
    if (setScreeningQuestions) {
      setScreeningQuestions(updatedScreeningQuestions);
    }
    
    // Add to selected presets if not already there
    if (!selectedPresets.includes('custom-question')) {
      setSelectedPresets(prev => [...prev, 'custom-question']);
    }
  };

  const handleSelectPreset = (presetId: string) => {
    if (presetId === 'custom-question') {
      setIsCustomQuestionsModalOpen(true);
      return;
    }
    
    if (selectedPresets.includes(presetId)) {
      // Remove the preset
      setSelectedPresets(prev => prev.filter(id => id !== presetId));
      
      // Remove questions with this presetId or matching content
      let filteredQuestions = [...screeningQuestions];
      
      if (presetId === 'drivers-license') {
        filteredQuestions = filteredQuestions.filter(q => 
          !q.question.toLowerCase().includes("driver's license") && q.presetId !== presetId
        );
      } else if (presetId === 'background-check') {
        filteredQuestions = filteredQuestions.filter(q => 
          !q.question.toLowerCase().includes("background check") && q.presetId !== presetId
        );
      } else if (presetId === 'drug-test') {
        filteredQuestions = filteredQuestions.filter(q => 
          !q.question.toLowerCase().includes("drug test") && q.presetId !== presetId
        );
      } else if (presetId === 'education') {
        filteredQuestions = filteredQuestions.filter(q => 
          !(q.question.toLowerCase().includes("education") || 
            q.question.toLowerCase().includes("degree")) && q.presetId !== presetId
        );
      } else {
        // Default case - just filter by presetId
        filteredQuestions = filteredQuestions.filter(q => q.presetId !== presetId);
      }
      
      setLocalScreeningQuestions(filteredQuestions);
      
      // Update parent component state if available
      if (setScreeningQuestions) {
        setScreeningQuestions(filteredQuestions);
      }
    } else {
      // Add the preset
      setSelectedPresets(prev => [...prev, presetId]);
      
      // Check if we already have a similar question to avoid duplicates
      const preset = PRESET_QUESTIONS[presetId as keyof typeof PRESET_QUESTIONS];
      if (preset) {
        // Check for existing similar questions
        let hasDuplicate = false;
        
        if (presetId === 'drivers-license') {
          hasDuplicate = screeningQuestions.some(q => 
            q.question.toLowerCase().includes("driver's license")
          );
        } else if (presetId === 'background-check') {
          hasDuplicate = screeningQuestions.some(q => 
            q.question.toLowerCase().includes("background check")
          );
        } else if (presetId === 'drug-test') {
          hasDuplicate = screeningQuestions.some(q => 
            q.question.toLowerCase().includes("drug test")
          );
        } else if (presetId === 'education') {
          hasDuplicate = screeningQuestions.some(q => 
            q.question.toLowerCase().includes("education") || 
            q.question.toLowerCase().includes("degree")
          );
        }
        
        // Only add if not a duplicate
        if (!hasDuplicate) {
          // Generate a consistent integer ID instead of timestamp
          const newId = Math.max(...screeningQuestions.map(q => q.id || 0), 0) + 1;
          const newQuestion = {
            id: newId,
            question: preset.question,
            idealAnswer: preset.idealAnswer,
            responseType: preset.responseType,
            mustHave: false,
            showToCandidates: true,
            recommended: true,
            editable: false,
            degree: undefined,
            presetId: presetId
          };
          
          const updatedQuestions = [...screeningQuestions, newQuestion];
          setLocalScreeningQuestions(updatedQuestions);
          
          // Update parent component state if available
          if (setScreeningQuestions) {
            setScreeningQuestions(updatedQuestions);
          }
        } else {
          // Just update the existing question's presetId
          const updatedQuestions = screeningQuestions.map(q => {
            if (presetId === 'drivers-license' && q.question.toLowerCase().includes("driver's license")) {
              return { ...q, presetId };
            } else if (presetId === 'background-check' && q.question.toLowerCase().includes("background check")) {
              return { ...q, presetId };
            } else if (presetId === 'drug-test' && q.question.toLowerCase().includes("drug test")) {
              return { ...q, presetId };
            } else if (presetId === 'education' && 
                      (q.question.toLowerCase().includes("education") || 
                       q.question.toLowerCase().includes("degree"))) {
              return { ...q, presetId };
            }
            return q;
          });
          
          setLocalScreeningQuestions(updatedQuestions);
          
          // Update parent component state if available
          if (setScreeningQuestions) {
            setScreeningQuestions(updatedQuestions);
          }
        }
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
  
  // Handle submission with validation (NO MAXIMUM LIMIT)
  const handleSubmit = () => {
    if (screeningQuestions.length < 3) {
      setValidationError("At least 3 screening questions are required");
      setIsScreeningOpen(true);
      return;
    }
    
    // NO MAXIMUM LIMIT - Users can add unlimited questions!
    setValidationError(null);
    
    // Update parent component state if available
    if (setScreeningQuestions) {
      setScreeningQuestions(screeningQuestions);
    }
    
    // For backward compatibility, also update window globals
    window.screeningQuestions = screeningQuestions;
    window.autoRejectEnabled = true; // Always enabled
    window.rejectionFeedback = rejectionFeedback;
    
    onSubmit();
  };

  // Determine if edit icon should be shown for screening questions
  const showEditIcon = screeningQuestions.length > 0;

  return (
    <>
      <div className="px-2 sm:px-4 pb-6">
        <div className="sm:col-span-4 mt-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">Job settings</h2>
          <p className="text-sm text-gray-400 mb-6">
            Your settings control how you screen and collect applicants.
          </p>

          {/* Screening Questions Section */}
          <div className="border-b border-gray-200 py-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-base sm:text-medium font-semibold text-gray-900">
                Screening questions
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({screeningQuestions.length} configured)
                </span>
              </div>
              <button 
                type="button" 
                className="p-1 rounded hover:bg-gray-100 flex-shrink-0"
                onClick={toggleScreeningSection}
              >
                {/* Edit Icon / Back Icon */}
                <span className="sr-only">{isScreeningOpen ? 'Back' : 'Edit'}</span>
                {isScreeningOpen ? <MinusIconWithBorder /> : <EditIcon />}
              </button>
            </div>

            {/* Show Questions in Collapsed View - SCROLLABLE */}
            {!isScreeningOpen && screeningQuestions.length > 0 && (
              <div className="mt-2 sm:ml-5 text-sm text-gray-900">
                <div className="max-h-60 sm:max-h-80 overflow-y-auto border border-gray-200 rounded-md p-3 bg-gray-50">
                  <ol className="list-decimal space-y-3 pl-4 sm:pl-6">
                    {screeningQuestions.map((question, index) => (
                      <li key={question.id} className="text-sm leading-relaxed">
                        <div className="font-medium text-gray-900 mb-1 break-words">{question.question}</div>
                        <div className="text-sm text-gray-500 ml-0">
                          {question.responseType === 'Text' ? (
                            <span className="text-gray-500">No ideal answer required</span>
                          ) : question.responseType === 'Multiple Choice' && Array.isArray(question.idealAnswer) ? (
                            question.idealAnswer.length > 0 ? (
                              <span>
                                Ideal answers: <span className="font-semibold text-green-600 text-sm sm:text-base">{question.idealAnswer.join(', ')}</span>
                              </span>
                            ) : (
                              <span className="text-gray-500">No ideal answers selected</span>
                            )
                          ) : (
                            <span>
                              Ideal answer: <span className={`font-semibold text-sm sm:text-base ${question.idealAnswer === 'Yes' ? 'text-green-600' : 'text-red-600'}`}>
                                {question.idealAnswer}
                              </span>
                            </span>
                          )}
                          {question.showToCandidates !== undefined && (
                            <span className="block sm:inline sm:ml-2 mt-1 sm:mt-0">
                              Show to candidates: <span className={`font-semibold text-sm sm:text-base ${question.showToCandidates ? 'text-green-600' : 'text-red-600'}`}>
                                {question.showToCandidates ? 'Yes' : 'No'}
                              </span>
                            </span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            )}
            
            {/* No questions message when collapsed */}
            {!isScreeningOpen && screeningQuestions.length === 0 && (
              <div className="text-sm text-gray-500 mt-2">
                No screening questions added. Click edit to add questions.
              </div>
            )}
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

              {/* Question Count Indicator */}
              <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="text-sm text-gray-600">
                  {screeningQuestions.length} screening questions configured
                </div>
                <div className="text-xs text-gray-500">
                  Minimum 3 questions required
                </div>
              </div>

              {/* Scrollable List of Current Questions */}
              <div className="max-h-80 sm:max-h-96 overflow-y-auto border border-gray-200 rounded-md p-3 sm:p-4 bg-gray-50 mb-4">
                {screeningQuestions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No screening questions yet.</p>
                    <p className="text-sm">Add some questions below.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {screeningQuestions.map((q) => (
                      <ScreeningQuestion
                        key={q.id}
                        question={q.question}
                        idealAnswer={q.idealAnswer}
                        degree={q.degree}
                        mustHave={q.mustHave}
                        showToCandidates={q.showToCandidates}
                        recommended={q.recommended}
                        onRemove={() => handleRemove(q.id)}
                        onToggleMustHave={() => handleToggleMustHave(q.id)}
                        onToggleShowToCandidates={() => handleToggleShowToCandidates(q.id)}
                        editable={true}
                        onEdit={() => handleEdit(q.id)}
                        responseType={q.responseType}
                        options={q.options}
                      />
                    ))}
                  </div>
                )}
              </div>

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
          <div className="border-b border-gray-200 py-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-base sm:text-medium font-semibold text-gray-900">
                Rejection settings
              </div>
              <button 
                type="button" 
                className="p-1 rounded hover:bg-gray-100 flex-shrink-0"
                onClick={toggleRejectionSettings}
              >
                <span className="sr-only">{isRejectionSettingsOpen ? 'Back' : 'Edit'}</span>
                {isRejectionSettingsOpen ? <MinusIconWithBorder /> : <EditIcon />}
              </button>
            </div>
            <div className="text-xs text-gray-500 max-w-md">
              Applicants who don't provide ideal answers to must-have screening questions will be automatically rejected.
            </div>
          </div>

          {/* Expanded Rejection Settings */}
          {isRejectionSettingsOpen && (
            <div className="py-4 border-b border-gray-200">
              <div className="bg-white p-3 sm:p-4 rounded-md border border-gray-200">
                {/* Personalized Feedback Section */}
                <div className="mt-1">
                  <label htmlFor="rejectionFeedback" className="block mb-2 text-sm font-medium text-gray-900">
                    Personalized Rejection Feedback (Optional)
                  </label>
                  <textarea
                    id="rejectionFeedback"
                    value={rejectionFeedback}
                    onChange={(e) => setRejectionFeedback(e.target.value)}
                    rows={4}
                    placeholder="Provide default feedback for rejected candidates (optional)"
                    className="w-full p-2 border border-gray-300 rounded-md text-sm resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    This feedback will be included in rejection emails sent to applicants who don't meet the screening criteria.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <hr />
      <div className="mt-5 sm:mt-4 flex flex-col sm:flex-row-reverse sm:justify-between gap-3 px-2 sm:px-4">
        <button
          id="pageJobSettingsNextBtn"
          type="button"
          className="inline-flex w-full justify-center rounded-md bg-savoy-blue px-3 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 sm:w-auto"
          onClick={handleSubmit}
        >
          Next
        </button>
        <button
          id="pageJobSettingsBackBtn"
          type="button"
          className="inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-savoy-blue shadow-sm ring-1 ring-inset ring-savoy-blue hover:bg-gray-50 sm:w-auto"
          onClick={() => setPageNumber(4)}
        >
          Back
        </button>
      </div>
      
      {/* Custom Questions Modal */}
      <CustomQuestionsModal
        isOpen={isCustomQuestionsModalOpen}
        setIsOpen={setIsCustomQuestionsModalOpen}
        onSave={handleSaveCustomQuestions}
        existingQuestions={customQuestions}
      />
    </>
  );
}

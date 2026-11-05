import { TourStep } from '@/components/tour/types';

// The Custom Templates tour. Started by the "Take a tour" button, so it saves nothing: no segmentKey is passed.
// Steps with an actionEvent make the tab do the click for the user (open the sample, go back, open the fill-in
// form); the tab answers with a tour-action-complete event (completeTrigger) once the new screen is showing.
export const TOUR_OPEN_SAMPLE = 'ct-tour-open-sample';
export const TOUR_CLOSE_EDITOR = 'ct-tour-close-editor';
export const TOUR_OPEN_FILL = 'ct-tour-open-fill';
export const TOUR_EDITOR_OPEN = 'ct-editor-open';
export const TOUR_LIST_OPEN = 'ct-list-open';
export const TOUR_FILL_OPEN = 'ct-fill-open';

const STARTS_STEP: TourStep = {
  id: 'ct-tour-starts',
  targetId: 'ct-tour-starts',
  title: 'Three ways to start',
  description:
    '<strong>Create from file</strong> lets the AI read a document your company already uses. <strong>Blank template</strong> starts from an empty page. <strong>Start from standard document</strong> opens a ready-made one you can change.',
};

// Only when the company still has its sample template
const WITH_SAMPLE_STEPS: TourStep[] = [
  {
    id: 'ct-tour-sample-row',
    targetId: 'ct-tour-sample-row',
    title: 'Your sample template',
    description: 'Every company starts with this example. Let us open it to see how a template works.',
    actionEvent: TOUR_OPEN_SAMPLE,
    completeTrigger: TOUR_EDITOR_OPEN,
    actionLabel: 'Open the sample',
  },
  {
    id: 'ct-tour-fields',
    targetId: 'ct-tour-fields',
    title: 'The fields',
    description:
      'Fields that say <strong>Filled automatically</strong> come from your records. The others are blanks that are typed in when the document is printed.',
  },
  {
    id: 'ct-tour-page',
    targetId: 'ct-tour-page',
    title: 'The page',
    description:
      'Edit the text right here. A code in double braces, like <strong>{{purpose}}</strong>, is a field. You can also use <strong>Insert field at cursor</strong>.',
  },
  {
    id: 'ct-tour-add-blank',
    targetId: 'ct-tour-add-blank',
    title: 'Add a blank',
    description:
      'Type a name and click <strong>Add</strong>. The field and its code are made for you. Tick <strong>Required</strong> on a field to make sure it is filled in.',
  },
  {
    id: 'ct-tour-save',
    targetId: 'ct-tour-save',
    title: 'Save your changes',
    description: '<strong>Save template</strong> keeps what you changed. We will leave the sample as it is and go back to the list.',
    actionEvent: TOUR_CLOSE_EDITOR,
    completeTrigger: TOUR_LIST_OPEN,
    actionLabel: 'Back to the list',
  },
  {
    id: 'ct-tour-sample-fill',
    targetId: 'ct-tour-sample-fill',
    title: 'Use the template',
    description: 'The print icon opens a template to fill in and print.',
    actionEvent: TOUR_OPEN_FILL,
    completeTrigger: TOUR_FILL_OPEN,
    actionLabel: 'Open it',
  },
  {
    id: 'ct-tour-fill-employee',
    targetId: 'ct-tour-fill-employee',
    title: 'Pick an employee',
    description:
      'Company details are already filled in. Pick an employee and their details fill in too. Anything you type replaces the record value.',
  },
  {
    id: 'ct-tour-fill-preview',
    targetId: 'ct-tour-fill-preview',
    title: 'The preview',
    description: 'The preview follows what you fill in. <strong>Generate PDF</strong> prints it.',
  },
];

export const buildCustomTemplatesTour = (hasSample: boolean): TourStep[] =>
  hasSample ? [STARTS_STEP, ...WITH_SAMPLE_STEPS] : [STARTS_STEP];

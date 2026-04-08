'use client';
import React from 'react';

function ScreeningQuestionGuidelines() {
  return (
    <div className='mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 my-14'>
      <h2 className='text-center text-2xl font-bold text-gray-900 pt-8'>Custom Question Guidelines for Applicant Screening</h2>
      <h2 className='text-lg text-gray-700'></h2>
      <h2 className='text-lg font-bold text-gray-900 pt-8'>Purpose of Custom Questions</h2>
      <ul className='list-disc list-inside text-gray-800'>
        <li>Screen candidates for role-specific qualifications</li>
        <li>Understand candidate preferences and availability</li>
        <li>Ensure alignment with company values and expectations</li>
      </ul>

      <h3 className='text-lg font-bold text-gray-900 pt-8'>DOs: What to Include</h3>
      <p className='text-justify text-gray-800'>When creating a question, make sure it is:</p>
      <ul className='list-disc list-inside text-gray-800'>
        <li>Job-Relevant</li>
        <li>Clear and Concise</li>
        <li>Answerable</li>
        <li>Aligned with Employment Policy</li>
      </ul>
      <div className='pl-4'>
        <p className='text-gray-800 font-semibold mt-2'>Examples:</p>
        <ul className='list-disc list-inside text-gray-800'>
          <li>“Do you have experience operating [specific equipment]?”</li>
          <li>“Are you willing to work on weekends or holidays when needed?”</li>
          <li>Acceptable: “Are you comfortable with fieldwork?”</li>
          <li>Not acceptable: “Are you comfortable with fieldwork, extended hours, and possibly relocating?”</li>
        </ul>
      </div>
      <div className='pl-4'>
        <p className='text-gray-800 font-semibold mt-2'>Answer Formats:</p>
        <ul className='list-disc list-inside text-gray-800'>
          <li>Multiple choice (Yes/No, Dropdowns, Ranges)</li>
          <li>Short or long text input (for deeper insights)</li>
        </ul>
      </div>

      <h3 className='text-lg font-bold text-gray-900 pt-8'>DON’Ts: What to Avoid</h3>
      <ul className='list-disc list-inside text-gray-800'>
        <li>Discriminatory or Personal in Nature
          <ul className='list-disc list-inside ml-6'>
            <li>Do not ask about age, gender, religion, marital status, sexual orientation, disability, or political views.</li>
          </ul>
        </li>
        <li>Invasive or Sensitive
          <ul className='list-disc list-inside ml-6'>
            <li>“Do you plan to have children?”</li>
            <li>“What is your religion?”</li>
            <li>“Have you ever been sick recently?”</li>
          </ul>
        </li>
        <li>Redundant
          <ul className='list-disc list-inside ml-6'>
            <li>Do not ask for information already collected elsewhere in the application form.</li>
          </ul>
        </li>
        <li>Vague or Hypothetical Without Purpose
          <ul className='list-disc list-inside ml-6'>
            <li>Avoid ungrounded questions. Instead of asking: “What would you do if the company had no policies?”</li>
            <li>Ask more practical, scenario-specific or behavior-based questions.</li>
          </ul>
        </li>
      </ul>

      <h3 className='text-lg font-bold text-gray-900 pt-8'>Sample Custom Questions (Recommended Formats)</h3>
      <div className='pl-4'>
        <ul className='list-disc list-inside text-gray-800'>
          <li><span className='font-semibold'>Schedule Fit:</span> Are you available to start immediately?</li>
          <li><span className='font-semibold'>Technical Skills:</span> How many years of experience do you have with [Tool/Software]?</li>
          <li><span className='font-semibold'>Job Preferences:</span> Are you looking for part-time, full-time, or project-based work?</li>
          <li><span className='font-semibold'>Language Proficiency:</span> Are you fluent in English, Filipino, or another local dialect?</li>
        </ul>
      </div>

      <h3 className='text-lg font-bold text-gray-900 pt-8'>Reminders</h3>
      <ul className='list-disc list-inside text-gray-800'>
        <li>All custom questions must be professional, purposeful, and inclusive.</li>
        <li>YAHSHUA HRIS reserves the right to review and flag inappropriate or non-compliant questions.</li>
        <li>All questions must comply with labor and data privacy laws.</li>
      </ul>
    </div>
  );
}

export default ScreeningQuestionGuidelines;
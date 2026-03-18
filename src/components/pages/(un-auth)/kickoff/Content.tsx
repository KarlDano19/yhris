'use client';

import { useState } from 'react';

import { T_KickoffAcknowledgementResponse } from '@/types/kickoff';
import { CheckCircleIcon, ClockIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

import AcknowledgementForm from './AcknowledgementForm';
import useGetKickoffPortal from './hooks/useGetKickoffPortal';

interface ContentProps {
  token: string;
}

export default function Content({ token }: ContentProps) {
  const [submissionResult, setSubmissionResult] = useState<T_KickoffAcknowledgementResponse | null>(null);

  const { data, isLoading, isError } = useGetKickoffPortal(token);

  const youtubeVideoId = 'rHVN2IrpoC0';
  const canvaEmbedUrl = 'https://www.canva.com/design/DAHC9n5k93s/6b0gbns2cTzuBzXMv_eoHw/view?embed';

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#2c3f58] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Loading your kick-off portal...</p>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full text-center">
          <ExclamationCircleIcon className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-800 mb-2">Invalid Link</h1>
          <p className="text-gray-500 text-sm">
            This kick-off link is invalid. Please contact your YAHSHUA HRIS representative for a new link.
          </p>
        </div>
      </div>
    );
  }

  if (data.expired) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full text-center">
          <ClockIcon className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-800 mb-2">Link Expired</h1>
          <p className="text-gray-500 text-sm mb-4">
            This kick-off link has expired. Please contact your YAHSHUA HRIS representative to
            request a new invitation link.
          </p>
          <a
            href="https://showcase.yahshuapayroll.com/help-center"
            className="inline-block px-5 py-2 bg-[#2c3f58] text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity"
          >
            Contact Support
          </a>
        </div>
      </div>
    );
  }

  if (data.already_completed || submissionResult) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full text-center">
          <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-800 mb-2">Acknowledgement Submitted</h1>
          <p className="text-gray-500 text-sm mb-2">
            Thank you, <span className="font-semibold text-gray-700">{data.company_name}</span>!
            Your kick-off acknowledgement has been received.
          </p>
          <p className="text-gray-500 text-sm">
            Our team has been notified and will reach out shortly to proceed with your account setup.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 print:bg-white">
      {/* Header */}
      <div className="bg-[#2c3f58] py-5 px-6 print:hidden">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <div>
            <p className="text-white font-bold text-lg tracking-wide">YAHSHUA HRIS</p>
            <p className="text-blue-200 text-xs">Client Kick-Off Portal</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10 space-y-10 print:py-0 print:space-y-0">
        {/* Welcome */}
        <div className="print:hidden">
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome, <span className="text-[#2c3f58]">{data.company_name}</span>!
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Please complete the following steps before signing the acknowledgement form below.
          </p>
        </div>

        {/* Section 1 — Kick-off Video */}
        <section className="print:hidden">
          <h2 className="text-base font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#2c3f58] text-white text-xs font-bold">1</span>
            Watch the Kick-off Video
          </h2>
          <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-black">
            {youtubeVideoId ? (
              <iframe
                src={`https://www.youtube.com/embed/${youtubeVideoId}`}
                title="YAHSHUA HRIS Kick-off Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full aspect-video"
              />
            ) : (
              <div className="w-full aspect-video flex items-center justify-center bg-gray-100">
                <p className="text-gray-400 text-sm">Video not configured.</p>
              </div>
            )}
          </div>
        </section>

        {/* Section 2 — Canva Presentation */}
        <section className="print:hidden">
          <h2 className="text-base font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#2c3f58] text-white text-xs font-bold">2</span>
            Review the Project Presentation
          </h2>
          <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-gray-100">
            {canvaEmbedUrl ? (
              <iframe
                src={canvaEmbedUrl}
                title="YAHSHUA HRIS Project Presentation"
                allow="fullscreen"
                allowFullScreen
                className="w-full aspect-video"
              />
            ) : (
              <div className="w-full aspect-video flex items-center justify-center">
                <p className="text-gray-400 text-sm">Presentation not configured.</p>
              </div>
            )}
          </div>
        </section>

        {/* Section 3 — Acknowledgement Form */}
        <section>
          <h2 className="text-base font-semibold text-gray-700 mb-3 flex items-center gap-2 print:hidden">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#2c3f58] text-white text-xs font-bold">3</span>
            Sign the Acknowledgement Form
          </h2>
          <AcknowledgementForm
            token={token}
            portalData={data}
            onSuccess={(res) => setSubmissionResult(res)}
          />
        </section>
      </div>
    </div>
  );
}

'use client';

import YahshuaSISHeader from '../../YahshuaSISHeader';
import FloatingMenuBar from '../../components/FloatingMenuBar';

const Content = () => {
  return (
    <>
      <YahshuaSISHeader />
      <FloatingMenuBar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-indigo-dye mb-4">Jobs</h1>
          <p className="text-gray-600">Coming soon...</p>
        </div>
      </div>
    </>
  );
};

export default Content;

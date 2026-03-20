'use client';

import { useState } from 'react';

import Board from './modal/BoardModal';
import EmployerDetail from './modal/EmployerDetailModal';

const Content = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (selectedId) {
    return <EmployerDetail recordId={selectedId} onBack={() => setSelectedId(null)} />;
  }

  return <Board onSelect={(id) => setSelectedId(id)} />;
};

export default Content;

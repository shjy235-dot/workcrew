import React, { useEffect, useState } from 'react';
import { useProjectStore } from './store/projectStore';
import TopBar from './components/TopBar';
import Dashboard from './components/Dashboard';
import DayNavigation from './components/DayNavigation';
import DayModule from './components/DayModule';
import WorkerAuthModal from './components/WorkerAuthModal';

function App() {
  const { data, mode, workerName, initDB } = useProjectStore();
  const [activeDayId, setActiveDayId] = useState('');

  useEffect(() => {
    initDB();
  }, [initDB]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('data')) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    if (data.days.length > 0 && !activeDayId) {
      setActiveDayId(data.days[0].id);
    }
  }, [data.days, activeDayId]);

  return (
    <div className="min-h-screen blueprint-grid flex justify-center">
      <div className="w-full max-w-md bg-white shadow-2xl min-h-screen relative overflow-x-hidden flex flex-col border-x border-[#E5E7EB]">
        {mode === 'worker' && !workerName && <WorkerAuthModal />}
        <TopBar />
        <main className="flex-1 overflow-y-auto hide-scrollbar relative">
          <Dashboard />
          <DayNavigation activeDayId={activeDayId} setActiveDayId={setActiveDayId} />
          <DayModule activeDayId={activeDayId} />
        </main>
      </div>
    </div>
  );
}

export default App;

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { Toast } from './components/Toast';
import { TodayView } from './views/TodayView';
import { ListsView } from './views/ListsView';
import { InsightsView } from './views/InsightsView';
import { TaskDetailsModal } from './components/TaskDetailsModal';
import { AddTaskModal } from './components/AddTaskModal';
import { CreateSpaceModal } from './components/CreateSpaceModal';
import { BreathingModal } from './components/BreathingModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { ProfileModal } from './components/ProfileModal';

const AppContent: React.FC = () => {
  const { currentView } = useApp();

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col antialiased selection:bg-secondary-container selection:text-on-secondary-container font-sans">
      <Header />

      <main className="flex-1 flex flex-col relative w-full pt-16 pb-28 bg-surface overflow-x-hidden">
        {currentView === 'today' && <TodayView />}
        {currentView === 'lists' && <ListsView />}
        {currentView === 'insights' && <InsightsView />}
      </main>

      <BottomNav />

      {/* Overlays & Modals */}
      <TaskDetailsModal />
      <AddTaskModal />
      <CreateSpaceModal />
      <BreathingModal />
      <NotificationDrawer />
      <ProfileModal />
      <Toast />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;

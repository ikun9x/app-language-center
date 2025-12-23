
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppState, GuestMessage } from './types';
import { INITIAL_CONFIG, INITIAL_COURSES, INITIAL_TEACHERS, INITIAL_ACHIEVEMENTS, INITIAL_CATEGORIES, AppContext } from './constants';

// --- Components ---
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    config: INITIAL_CONFIG,
    courses: INITIAL_COURSES,
    teachers: INITIAL_TEACHERS,
    achievements: INITIAL_ACHIEVEMENTS,
    messages: [],
    isAuthenticated: false,
    categories: INITIAL_CATEGORIES
  });
  const [loading, setLoading] = useState(true);

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/data');
        const data = await res.json();

        if (data) {
          const today = new Date().toISOString().split('T')[0];
          // State Migration & Safety Fallbacks
          if (!data.categories) data.categories = INITIAL_CATEGORIES;
          if (!data.teachers) data.teachers = INITIAL_TEACHERS;
          if (!data.courses) data.courses = INITIAL_COURSES;
          if (!data.config) data.config = INITIAL_CONFIG;
          if (!data.achievements) data.achievements = INITIAL_ACHIEVEMENTS;
          if (!data.messages) data.messages = [];

          // Check session validity (retain in localStorage for session only)
          const adminCred = localStorage.getItem('bm_admin_cred');
          const isAuth = !!adminCred;

          setState({ ...data, isAuthenticated: isAuth });
        }
      } catch (err) {
        console.error("Failed to fetch data from server, using initial state:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Save data on state change
  useEffect(() => {
    if (loading) return;

    const saveData = async () => {
      try {
        await fetch('/api/data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(state)
        });
      } catch (err) {
        console.error("Failed to save data to server:", err);
      }
    };
    saveData();
  }, [state, loading]);

  const updateState = (newState: Partial<AppState>) => {
    setState(prev => ({ ...prev, ...newState }));
  };

  const addMessage = (msg: Omit<GuestMessage, 'id' | 'timestamp' | 'replied'>) => {
    const newMessage: GuestMessage = {
      ...msg,
      id: Date.now().toString(),
      timestamp: new Date().toLocaleString(),
      replied: false
    };
    setState(prev => ({
      ...prev,
      messages: [newMessage, ...prev.messages]
    }));
  };

  if (loading) return <div className="min-h-screen bg-slate-900 flex items-center justify-center"><div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <AppContext.Provider value={{ state, updateState, addMessage }}>
      <HashRouter>
        <div className="min-h-screen flex flex-col">
          <Routes>
            <Route path="/" element={<><Navbar /><HomePage /><Footer /></>} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/admin/*"
              element={state.isAuthenticated ? <AdminDashboard /> : <Navigate to="/login" />}
            />
          </Routes>
        </div>
      </HashRouter>
    </AppContext.Provider>
  );
};

export default App;

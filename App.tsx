
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
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    config: INITIAL_CONFIG,
    courses: INITIAL_COURSES,
    teachers: INITIAL_TEACHERS,
    achievements: INITIAL_ACHIEVEMENTS,
    messages: [],
    isAuthenticated: false,
    categories: INITIAL_CATEGORIES,
    publicDocuments: INITIAL_DOCUMENTS
  });
  const [loading, setLoading] = useState(true);

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/data');
        if (!res.ok) throw new Error('Server not reachable');
        const data = await res.json();

        if (data) {
          // State Migration & Safety Fallbacks
          if (!data.categories) data.categories = INITIAL_CATEGORIES;
          if (!data.teachers) data.teachers = INITIAL_TEACHERS;
          if (!data.courses) data.courses = INITIAL_COURSES;
          if (!data.config) data.config = INITIAL_CONFIG;
          if (!data.achievements) data.achievements = INITIAL_ACHIEVEMENTS;
          if (!data.messages) data.messages = [];
          if (!data.publicDocuments) data.publicDocuments = INITIAL_DOCUMENTS; // Add publicDocuments fallback

          const adminCred = localStorage.getItem('bm_admin_cred');
          setState({ ...data, isAuthenticated: !!adminCred });
          localStorage.setItem('bm_center_data', JSON.stringify(data));
          return;
        }
      } catch (err) {
        console.warn("API unavailable, falling back to localStorage:", err);
        const savedData = localStorage.getItem('bm_center_data');
        if (savedData) {
          const parsed = JSON.parse(savedData);
          const adminCred = localStorage.getItem('bm_admin_cred');

          // Migration: Merge missing config properties from defaults (e.g. googleMapsEmbed)
          if (parsed.config) {
            parsed.config = { ...INITIAL_CONFIG, ...parsed.config };
          } else {
            parsed.config = INITIAL_CONFIG;
          }
          // Migration: Ensure publicDocuments exists
          if (!parsed.publicDocuments) {
            parsed.publicDocuments = INITIAL_DOCUMENTS;
          }

          setState({ ...parsed, isAuthenticated: !!adminCred });
        } else {
          // No saved data at all, use seeded defaults
          const adminCred = localStorage.getItem('bm_admin_cred');
          setState({
            categories: INITIAL_CATEGORIES,
            teachers: INITIAL_TEACHERS,
            courses: INITIAL_COURSES,
            config: INITIAL_CONFIG,
            achievements: INITIAL_ACHIEVEMENTS,
            messages: [],
            isAuthenticated: !!adminCred
          });
        }
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
      // Always save to localStorage first as fallback
      localStorage.setItem('bm_center_data', JSON.stringify({
        config: state.config,
        courses: state.courses,
        teachers: state.teachers,
        achievements: state.achievements,
        messages: state.messages,
        categories: state.categories
      }));

      try {
        await fetch('/api/data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(state)
        });
      } catch (err) {
        // Silently fail API save as we already saved to localStorage
        console.debug("Backend save failed, using local storage only.");
      }
    };
    saveData();
  }, [state, loading]);

  // Update Favicon and Title
  useEffect(() => {
    if (state.config.brandNamePrincipal) {
      document.title = `${state.config.brandNamePrincipal} - ${state.config.brandNameSub || 'Language Center'}`;
    }

    if (state.config.brandLogoImage) {
      let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = state.config.brandLogoImage;
    }
  }, [state.config.brandLogoImage, state.config.brandNamePrincipal, state.config.brandNameSub]);

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
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored" />
    </AppContext.Provider>
  );
};

export default App;

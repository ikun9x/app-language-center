
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../constants';
import { getAssetPath } from '../utils';
import { Menu, X, LogIn, FileText, Sparkles } from 'lucide-react';

const Navbar: React.FC = () => {
  const { state } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Trang Chủ', id: 'hero' },
    { name: 'Khóa Học', id: 'courses' },
    { name: 'Giảng Viên', id: 'teachers' },
    { name: 'Tin Tức', id: 'news' },
    {
      name: 'Công khai',
      id: 'documents',
      isPrimary: true,
      icon: <FileText size={16} className="text-blue-600" />
    },
    { name: 'Về Chúng Tôi', id: 'about' },
    { name: 'Liên Hệ', id: 'contact' },
  ];

  const scrollTo = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    if (id === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsOpen(false);
  };

  return (
    <nav className="fixed w-full z-50 px-6 py-4 transition-all duration-300">
      <div className="max-w-7xl mx-auto glass rounded-2xl shadow-lg px-8 py-3 flex justify-between items-center transition-all hover:shadow-xl border border-white/20">
        <Link to="/" className="flex items-center space-x-3 group">
          <div className={state.config.brandLogoImage ? "" : "bg-gradient-to-br from-blue-600 to-indigo-600 p-2.5 rounded-xl text-white font-black text-xl shadow-lg shadow-blue-500/30 transition-transform group-hover:scale-110 group-hover:rotate-6"}>
            {state.config.brandLogoImage ? (
              <img src={getAssetPath(state.config.brandLogoImage)} className="w-14 h-14 object-contain" alt="Logo" />
            ) : (
              state.config.brandShortName
            )}
          </div>
          <div className="flex flex-col">
            <h1 className="text-slate-900 font-extrabold text-lg leading-none tracking-tight">{state.config.brandNamePrincipal}</h1>
            <p className="text-[10px] text-blue-600 font-bold tracking-[0.2em] uppercase mt-1">{state.config.brandNameSub}</p>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map(link => (
            <button
              key={link.name}
              onClick={(e) => scrollTo(e, link.id)}
              className={`
                relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300
                ${link.isPrimary
                  ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100 hover:bg-blue-600 hover:text-white hover:scale-105 active:scale-95'
                  : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                }
              `}
            >
              {link.icon}
              {link.name}
              {link.isPrimary && (
                <Sparkles size={12} className="absolute -top-1 -right-1 text-orange-400 animate-pulse" />
              )}
            </button>
          ))}
          <div className="h-6 w-px bg-slate-200 mx-2"></div>
          <Link to="/login" className="flex items-center space-x-2 text-slate-500 hover:text-blue-600 transition-colors group px-2 py-2 rounded-xl hover:bg-slate-50">
            <LogIn size={18} className="group-hover:rotate-12 transition-transform" />
            <span className="text-sm font-bold">Admin</span>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-slate-600" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-t p-6 space-y-2 shadow-xl animate-in slide-in-from-top duration-300">
          {navLinks.map(link => (
            <button
              key={link.name}
              className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl font-bold transition-all
                ${link.isPrimary
                  ? 'bg-blue-50 text-blue-700 border border-blue-100'
                  : 'text-slate-600 hover:bg-slate-50'
                }
              `}
              onClick={(e) => scrollTo(e, link.id)}
            >
              {link.icon}
              {link.name}
            </button>
          ))}
          <div className="pt-4 mt-2 border-t">
            <Link to="/login" className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-50">
              <LogIn size={18} />
              <span>Admin Login</span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

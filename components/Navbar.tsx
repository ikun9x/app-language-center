
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../constants';
import { getAssetPath } from '../utils';
import { Menu, X, LogIn } from 'lucide-react';

const Navbar: React.FC = () => {
  const { state } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Trang Chủ', id: 'hero' },
    { name: 'Khóa Học', id: 'courses' },
    { name: 'Giảng Viên', id: 'teachers' },
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
    <nav className="fixed w-full z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto glass rounded-2xl shadow-lg px-8 py-4 flex justify-between items-center transition-all hover:shadow-xl">
        <Link to="/" className="flex items-center space-x-3 group">
          <div className={state.config.brandLogoImage ? "" : "bg-gradient-to-br from-orange-400 to-rose-500 p-2.5 rounded-xl text-white font-black text-xl shadow-lg shadow-orange-500/30 transition-transform group-hover:scale-110 group-hover:rotate-6"}>
            {state.config.brandLogoImage ? (
              <img src={getAssetPath(state.config.brandLogoImage)} className="w-16 h-16 object-contain" alt="Logo" />
            ) : (
              state.config.brandShortName
            )}
          </div>
          <div className="flex flex-col">
            <h1 className="text-slate-900 font-extrabold text-lg leading-none tracking-tight">{state.config.brandNamePrincipal}</h1>
            <p className="text-[10px] text-blue-600 font-bold tracking-[0.2em] uppercase">{state.config.brandNameSub}</p>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map(link => (
            <button key={link.name} onClick={(e) => scrollTo(e, link.id)} className="text-slate-600 hover:text-blue-600 font-semibold text-sm transition-all hover:-translate-y-0.5">
              {link.name}
            </button>
          ))}
          <div className="h-6 w-px bg-slate-200"></div>
          <Link to="/login" className="flex items-center space-x-2 text-slate-500 hover:text-blue-600 transition-colors group">
            <LogIn size={18} className="group-hover:rotate-12 transition-transform" />
            <span className="text-sm font-semibold">Admin</span>
          </Link>
          <a href={`tel:${state.config.phone}`} className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transition transform hover:-translate-y-1 active:scale-95">
            {state.config.phone}
          </a>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-slate-600" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-t p-6 space-y-4 shadow-xl">
          {navLinks.map(link => (
            <button key={link.name} className="block w-full text-left text-slate-600 font-medium" onClick={(e) => scrollTo(e, link.id)}>
              {link.name}
            </button>
          ))}
          <div className="pt-4 border-t flex flex-col space-y-4">
            <Link to="/login" className="text-slate-500">Admin Login</Link>
            <a href={`tel:${state.config.phone}`} className="w-full text-center bg-blue-600 text-white py-3 rounded-lg font-bold">
              Gọi ngay: {state.config.phone}
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

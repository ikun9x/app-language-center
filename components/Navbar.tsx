
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../constants';
import { Menu, X, LogIn } from 'lucide-react';

const Navbar: React.FC = () => {
  const { state } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Trang Chủ', href: '#' },
    { name: 'Khóa Học', href: '#courses' },
    { name: 'Giảng Viên', href: '#teachers' },
    { name: 'Về Chúng Tôi', href: '#about' },
    { name: 'Liên Hệ', href: '#contact' },
  ];

  return (
    <nav className="fixed w-full z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto glass rounded-2xl shadow-lg px-8 py-4 flex justify-between items-center transition-all hover:shadow-xl">
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="bg-gradient-to-br from-orange-400 to-rose-500 p-2.5 rounded-xl text-white font-black text-xl shadow-lg shadow-orange-500/30 transition-transform group-hover:scale-110 group-hover:rotate-6">BM</div>
          <div className="flex flex-col">
            <h1 className="text-slate-900 font-extrabold text-lg leading-none tracking-tight">BÌNH MINH</h1>
            <p className="text-[10px] text-blue-600 font-bold tracking-[0.2em] uppercase">Language Center</p>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map(link => (
            <a key={link.name} href={link.href} className="text-slate-600 hover:text-blue-600 font-semibold text-sm transition-all hover:-translate-y-0.5">
              {link.name}
            </a>
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
            <a key={link.name} href={link.href} className="block text-slate-600 font-medium" onClick={() => setIsOpen(false)}>
              {link.name}
            </a>
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

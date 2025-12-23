
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../constants';
import { Lock, User, ArrowLeft } from 'lucide-react';

import { toast } from 'react-toastify';

const LoginPage: React.FC = () => {
  const { state, updateState } = useApp();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (state.isAuthenticated) {
      navigate('/admin');
    }
  }, [state.isAuthenticated, navigate]);

  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [remember, setRemember] = useState(false);

  React.useEffect(() => {
    const saved = localStorage.getItem('bm_admin_cred');
    if (saved) {
      const { user: u, pass: p } = JSON.parse(saved);
      setUser(u);
      setPass(p);
      setRemember(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (user === 'admin' && pass === '12345678') {
      if (remember) {
        localStorage.setItem('bm_admin_cred', JSON.stringify({ user, pass }));
      } else {
        localStorage.removeItem('bm_admin_cred');
      }

      const today = new Date().toISOString().split('T')[0];
      updateState({
        isAuthenticated: true,
        lastLoginDay: today
      });
      toast.success('Đăng nhập thành công!');
      navigate('/admin');
    } else {
      toast.error('Tài khoản hoặc mật khẩu không chính xác');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-blue-600"></div>
        <button onClick={() => navigate('/')} className="mb-8 flex items-center gap-2 text-slate-400 hover:text-blue-600 transition">
          <ArrowLeft size={18} /> <span>Quay lại trang chủ</span>
        </button>
        <div className="text-center mb-10">
          <div className={state.config.brandLogoImage ? "mx-auto mb-4" : "w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white font-bold text-3xl shadow-xl shadow-blue-100"}>
            {state.config.brandLogoImage ? (
              <img src={state.config.brandLogoImage} className="w-24 h-24 object-contain mx-auto" alt="Logo" />
            ) : (
              state.config.brandShortName
            )}
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900">{state.config.brandNamePrincipal} Login</h2>
          <p className="text-slate-500 mt-2">Truy cập hệ thống quản trị nội dung</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Username</label>
            <div className="relative">
              <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-0 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="admin"
                value={user}
                onChange={e => setUser(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-0 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="••••••••"
                value={pass}
                onChange={e => setPass(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="remember"
              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              checked={remember}
              onChange={e => setRemember(e.target.checked)}
            />
            <label htmlFor="remember" className="text-sm text-slate-600 cursor-pointer">Lưu mật khẩu và tên đăng nhập</label>
          </div>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-100 transition transform active:scale-95">
            Đăng nhập hệ thống
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

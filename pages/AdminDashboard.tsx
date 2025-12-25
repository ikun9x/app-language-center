
import React, { useState } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp, API_BASE_URL, INITIAL_CONFIG } from '../constants';
import { getAssetPath } from '../utils';
import { toast } from 'react-toastify';
import {
  LayoutDashboard,
  Settings,
  BookOpen,
  Users as UsersIcon,
  MessageSquare,
  LogOut,
  Save,
  Search,
  PlusCircle,
  ShieldAlert,
  Edit3,
  Globe,
  Home,
  Trash2,
  X,
  Clock,
  Upload,
  Image as ImageIcon,
  Link as LinkIcon,
  Mail,
  Phone,
  Send,
  FileText,
  ExternalLink,
  HardDrive,
  Trophy,
  Menu,
  Star,
  Lock,
  Shield,
  X
} from 'lucide-react';
const isLocalDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

const deletePhysicalFile = async (url?: string) => {
  if (!url) return;
  // Handle both local development uploads and Cloudinary production uploads
  const isLocal = url.includes('localhost:5001/uploads') || url.includes('localhost:5001/pdfs');
  const isCloud = url.includes('cloudinary.com');

  if (!isLocal && !isCloud) return;

  try {
    const token = localStorage.getItem('bm_admin_token') || sessionStorage.getItem('bm_admin_token');
    await fetch(`${API_BASE_URL}/api/delete-file`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ url }),
    });
  } catch (err) {
    console.error('Failed to delete physical file:', err);
  }
};

const SidebarLink: React.FC<{ to: string, icon: React.ReactNode, label: string, active: boolean, onClick?: () => void }> = ({ to, icon, label, active, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition font-medium ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-500 hover:bg-blue-50 hover:text-blue-600'}`}
  >
    {icon} <span>{label}</span>
  </Link>
);

const AdminDashboard: React.FC = () => {
  const { state, updateState } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('bm_admin_token');
    sessionStorage.removeItem('bm_admin_token');
    localStorage.removeItem('bm_admin_user');
    updateState({ isAuthenticated: false });
    navigate('/');
  };

  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      {/* Mobile Header */}
      <header className="lg:hidden bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center space-x-3">
          <div className={state.config.brandLogoImage ? "" : "bg-blue-600 p-1.5 rounded-lg font-bold text-white text-sm"}>
            {state.config.brandLogoImage ? (
              <img src={getAssetPath(state.config.brandLogoImage)} className="w-10 h-10 object-contain" alt="Logo" />
            ) : (
              state.config.brandShortName
            )}
          </div>
          <span className="font-extrabold text-base text-slate-900 tracking-tight">{state.config.brandNamePrincipal}</span>
        </div>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 bg-slate-100 rounded-xl text-slate-600 hover:bg-blue-600 hover:text-white transition-colors"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={closeSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`
        w-72 bg-white border-r border-slate-200 p-6 flex flex-col fixed h-full z-50 transition-transform duration-300 lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="hidden lg:flex items-center space-x-3 mb-10 px-2 text-wrap">
          <div className={state.config.brandLogoImage ? "" : "bg-blue-600 p-2 rounded-lg font-bold text-white text-xs"}>
            {state.config.brandLogoImage ? (
              <img src={getAssetPath(state.config.brandLogoImage)} className="w-10 h-10 object-contain" alt="Logo" />
            ) : (
              state.config.brandShortName
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg text-slate-900 tracking-tight leading-none mb-1">{state.config.brandNamePrincipal}</span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Admin Panel</span>
          </div>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto pr-2">
          <SidebarLink to="/admin" icon={<LayoutDashboard size={20} />} label="Tổng quan" active={location.pathname === '/admin'} onClick={closeSidebar} />
          <SidebarLink to="/admin/content" icon={<Edit3 size={20} />} label="Quản trị giao diện" active={location.pathname === '/admin/content'} onClick={closeSidebar} />
          <SidebarLink to="/admin/courses" icon={<BookOpen size={20} />} label="Khóa học" active={location.pathname === '/admin/courses'} onClick={closeSidebar} />
          <SidebarLink to="/admin/teachers" icon={<UsersIcon size={20} />} label="Giảng viên" active={location.pathname === '/admin/teachers'} onClick={closeSidebar} />
          <SidebarLink to="/admin/achievements" icon={<Trophy size={20} />} label="Thành tích" active={location.pathname === '/admin/achievements'} onClick={closeSidebar} />
          <SidebarLink to="/admin/testimonials" icon={<MessageSquare size={20} />} label="Đánh giá khách hàng" active={location.pathname === '/admin/testimonials'} onClick={closeSidebar} />
          <SidebarLink to="/admin/documents" icon={<FileText size={20} />} label="Văn bản công khai" active={location.pathname === '/admin/documents'} onClick={closeSidebar} />
          <SidebarLink to="/admin/system" icon={<HardDrive size={20} />} label="Tối ưu hệ thống" active={location.pathname === '/admin/system'} onClick={closeSidebar} />
          <SidebarLink to="/admin/leads" icon={<MessageSquare size={20} />} label="Yêu cầu tư vấn" active={location.pathname === '/admin/leads'} onClick={closeSidebar} />
          <SidebarLink to="/admin/blog" icon={<FileText size={20} />} label="Tin tức & Thư viện" active={location.pathname === '/admin/blog'} onClick={closeSidebar} />
          <SidebarLink to="/admin/seo" icon={<Search size={20} />} label="Quản trị SEO" active={location.pathname === '/admin/seo'} onClick={closeSidebar} />
          <SidebarLink to="/admin/compliance" icon={<ShieldAlert size={20} />} label="Bảo mật & Pháp lý" active={location.pathname === '/admin/compliance'} onClick={closeSidebar} />
        </nav>

        <div className="pt-4 mt-4 border-t border-slate-100 flex flex-col gap-2">
          <SidebarLink to="/" icon={<Home size={20} />} label="Trang chủ" active={false} />
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition font-bold"
          >
            <LogOut size={20} /> <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-72 p-6 md:p-10 min-w-0">
        <Routes>
          <Route index element={<Overview state={state} />} />
          <Route path="content" element={<ContentManager />} />
          <Route path="courses" element={<CoursesManager />} />
          <Route path="leads" element={<LeadsManager />} />
          <Route path="seo" element={<SeoManager />} />
          <Route path="teachers" element={<TeachersManager />} />
          <Route path="achievements" element={<AchievementsManager />} />
          <Route path="testimonials" element={<TestimonialsManager />} />
          <Route path="documents" element={<DocumentsManager />} />
          <Route path="system" element={<SystemOptimizer />} />
          <Route path="compliance" element={<ComplianceManager />} />
          <Route path="blog" element={<BlogPostsManager />} />
        </Routes>
      </main>
    </div>
  );
};

// --- Sub-pages ---

const Overview: React.FC<{ state: any }> = ({ state }) => (
  <div className="space-y-8">
    <div className="flex justify-between items-end">
      <div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Tổng quan hệ thống</h2>
        <p className="text-slate-500 font-medium tracking-tight">Chào mừng trở lại, Admin. Đây là tình hình hoạt động của trung tâm.</p>
      </div>
      <div className="hidden md:block">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
      </div>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard label="Khóa học đang mở" value={state.courses.length} color="blue" icon={<BookOpen size={24} />} trend="+2 tháng này" />
      <StatCard label="Đội ngũ giảng viên" value={state.teachers.length} color="indigo" icon={<UsersIcon size={24} />} trend="Ổn định" />
      <StatCard label="Yêu cầu tư vấn mới" value={state.messages.length} color="orange" icon={<MessageSquare size={24} />} trend="Cần xử lý" />
      <StatCard label="Lượt truy cập" value="1,280" color="emerald" icon={<Globe size={24} />} trend="+15% tuần qua" />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Recent Activity */}
      <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="font-black text-xl text-slate-900">Yêu cầu tư vấn gần đây</h3>
          <Link to="/admin/leads" className="text-blue-600 text-sm font-bold hover:underline">Xem tất cả</Link>
        </div>
        <div className="space-y-4">
          {state.messages.length > 0 ? (
            state.messages.slice(0, 5).map((m: any) => (
              <div key={m.id} className="group flex items-center gap-4 p-4 bg-slate-50 hover:bg-blue-50 rounded-2xl transition-all border border-transparent hover:border-blue-100">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm transition-transform group-hover:scale-110">
                  <MessageSquare size={20} />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-800">{m.name}</p>
                  <p className="text-xs text-slate-500 font-medium">{m.phone} • {m.timestamp}</p>
                </div>
                <div className="hidden sm:block">
                  <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">Mới</span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-slate-400 font-medium">Chưa có yêu cầu mới nào.</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions / System Status */}
      <div className="space-y-8">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <h3 className="font-black text-xl">Lối tắt quản trị</h3>
            <div className="grid grid-cols-1 gap-3">
              <Link to="/admin/content" className="flex items-center gap-3 p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-all font-bold text-sm">
                <Edit3 size={18} /> Chỉnh sửa giao diện
              </Link>
              <Link to="/admin/blog" className="flex items-center gap-3 p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-all font-bold text-sm">
                <PlusCircle size={18} /> Đăng bài viết mới
              </Link>
              <Link to="/admin/system" className="flex items-center gap-3 p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-all font-bold text-sm">
                <Settings size={18} /> Cài đặt hệ thống
              </Link>
            </div>
          </div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl"></div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-6">
          <h3 className="font-black text-xl text-slate-900">Trạng thái hệ thống</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-500">Dung lượng ổ đĩa</span>
              <span className="text-sm font-black text-emerald-500">Ổn định</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 w-[15%]"></div>
            </div>
            <div className="flex items-center justify-between pt-2">
              <span className="text-sm font-bold text-slate-500">Bảo mật SSL</span>
              <span className="text-sm font-black text-emerald-500">Bật</span>
            </div>
            <div className="flex items-center justify-between pt-2">
              <span className="text-sm font-bold text-slate-500">Tốc độ tải trang</span>
              <span className="text-sm font-black text-blue-600">Tuyệt vời</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const StatCard: React.FC<{ label: string, value: any, color: string, icon: React.ReactNode, trend?: string }> = ({ label, value, color, icon, trend }) => {
  const colorMap: any = {
    blue: "text-blue-600 bg-blue-50 border-blue-100",
    indigo: "text-indigo-600 bg-indigo-50 border-indigo-100",
    orange: "text-orange-600 bg-orange-50 border-orange-100",
    emerald: "text-emerald-600 bg-emerald-50 border-emerald-100"
  };

  return (
    <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
      <div className="flex justify-between items-start mb-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${colorMap[color] || 'text-slate-600 bg-slate-50'}`}>
          {icon}
        </div>
        {trend && (
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none bg-slate-50 px-2 py-1 rounded-md">{trend}</span>
        )}
      </div>
      <div>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">{label}</p>
        <p className="text-4xl font-black text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">{value}</p>
      </div>
    </div>
  );
};

const ContentManager: React.FC = () => {
  const { state, updateState } = useApp();
  const [localConfig, setLocalConfig] = useState(state.config);

  const save = () => {
    updateState({ config: localConfig });
    toast.success("Cập nhật giao diện thành công!");
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Delete old local file if exists
      if (localConfig.brandLogoImage) {
        await deletePhysicalFile(localConfig.brandLogoImage);
      }

      const token = localStorage.getItem('bm_admin_token') || sessionStorage.getItem('bm_admin_token');
      const res = await fetch(`${API_BASE_URL}/api/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setLocalConfig({ ...localConfig, brandLogoImage: data.url });
      }
    } catch (err) {
      console.error(err);
      toast.error("Tải logo thất bại!");
    }
  };

  const handleDeleteLogo = async () => {
    if (!localConfig.brandLogoImage) return;
    if (!confirm("Bạn có chắc chắn muốn xoá logo này khỏi máy chủ?")) return;

    try {
      const token = localStorage.getItem('bm_admin_token') || sessionStorage.getItem('bm_admin_token');
      const res = await fetch(`${API_BASE_URL}/api/delete-file`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ url: localConfig.brandLogoImage }),
      });
      const data = await res.json();
      if (data.success) {
        setLocalConfig({ ...localConfig, brandLogoImage: '' });
        updateState({ config: { ...state.config, brandLogoImage: '' } });
        toast.success("Đã xoá logo vật lý!");
      } else {
        toast.error("Xoá logo thất bại: " + data.error);
      }
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi xoá logo!");
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">Cập nhật giao diện</h2>
        <button onClick={save} className="w-full md:w-auto bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-200">
          <Save size={18} /> Lưu thay đổi
        </button>
      </div>

      {/* Dynamic Statistics Card */}
      <div className="bg-blue-600 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-xl text-white">
        <div className="flex items-center gap-4 mb-6 md:mb-8">
          <div className="p-3 bg-white/20 rounded-2xl hidden sm:block">
            <Trophy size={24} />
          </div>
          <div>
            <h3 className="text-xl md:text-2xl font-black tracking-tight">Chỉ số thống kê</h3>
            <p className="text-blue-100 text-xs md:text-sm font-medium">Cập nhật các con số ấn tượng trên trang chủ</p>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-blue-200 uppercase tracking-widest">Năm kinh nghiệm</label>
            <input
              className="w-full p-4 bg-white/10 hover:bg-white/20 focus:bg-white border-2 border-transparent focus:border-blue-300 rounded-2xl outline-none transition font-black text-xl text-white focus:text-blue-900"
              value={localConfig.statsYears || ''}
              onChange={e => setLocalConfig({ ...localConfig, statsYears: e.target.value })}
              placeholder="VD: 10+"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-blue-200 uppercase tracking-widest">Giảng viên giỏi</label>
            <input
              className="w-full p-4 bg-white/10 hover:bg-white/20 focus:bg-white border-2 border-transparent focus:border-blue-300 rounded-2xl outline-none transition font-black text-xl text-white focus:text-blue-900"
              value={localConfig.statsTeachers || ''}
              onChange={e => setLocalConfig({ ...localConfig, statsTeachers: e.target.value })}
              placeholder="VD: 50+"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-blue-200 uppercase tracking-widest">Khóa học</label>
            <input
              className="w-full p-4 bg-white/10 hover:bg-white/20 focus:bg-white border-2 border-transparent focus:border-blue-300 rounded-2xl outline-none transition font-black text-xl text-white focus:text-blue-900"
              value={localConfig.statsCourses || ''}
              onChange={e => setLocalConfig({ ...localConfig, statsCourses: e.target.value })}
              placeholder="VD: 20+"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-blue-200 uppercase tracking-widest">Hài lòng (%)</label>
            <input
              className="w-full p-4 bg-white/10 hover:bg-white/20 focus:bg-white border-2 border-transparent focus:border-blue-300 rounded-2xl outline-none transition font-black text-xl text-white focus:text-blue-900"
              value={localConfig.statsSatisfaction || ''}
              onChange={e => setLocalConfig({ ...localConfig, statsSatisfaction: e.target.value })}
              placeholder="VD: 98%"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm space-y-6">
          <h3 className="font-bold text-lg border-b pb-4">Branding & Identity</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2">Tên chính (BÌNH MINH)</label>
                <input className="w-full p-4 bg-slate-50 rounded-xl outline-none" value={localConfig.brandNamePrincipal} onChange={e => setLocalConfig({ ...localConfig, brandNamePrincipal: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2">Tên phụ (Language Center)</label>
                <input className="w-full p-4 bg-slate-50 rounded-xl outline-none" value={localConfig.brandNameSub} onChange={e => setLocalConfig({ ...localConfig, brandNameSub: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2">Tên viết tắt /Logo Text (BM)</label>
              <input className="w-full p-4 bg-slate-50 rounded-xl outline-none" value={localConfig.brandShortName} onChange={e => setLocalConfig({ ...localConfig, brandShortName: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2">Logo Image</label>
              <div className="flex gap-4 items-center">
                <div className="relative group text-center">
                  <div className={localConfig.brandLogoImage ? "w-24 h-24 flex items-center justify-center overflow-hidden" : "w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center overflow-hidden border"}>
                    {localConfig.brandLogoImage ? <img src={getAssetPath(localConfig.brandLogoImage)} className="w-full h-full object-contain" /> : <span className="text-slate-400 font-bold">{localConfig.brandShortName}</span>}
                  </div>
                  {localConfig.brandLogoImage && (
                    <button onClick={handleDeleteLogo} className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <input className="w-full p-3 bg-slate-50 rounded-xl outline-none text-sm" value={localConfig.brandLogoImage || ''} onChange={e => setLocalConfig({ ...localConfig, brandLogoImage: e.target.value })} placeholder="Dán URL logo hoặc tải lên..." />
                  <label className="flex items-center gap-2 cursor-pointer bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-100 transition-colors w-fit">
                    <Upload size={14} /> Tải logo lên
                    <input type="file" className="hidden" accept="image/*" onChange={handleUpload} />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm space-y-6">
          <h3 className="font-bold text-lg border-b pb-4">Hero & Media</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2">Video Banner (URL)</label>
              <input className="w-full p-4 bg-slate-50 rounded-xl outline-none" value={localConfig.heroVideoUrl} onChange={e => setLocalConfig({ ...localConfig, heroVideoUrl: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2">Tiêu đề chính</label>
              <input className="w-full p-4 bg-slate-50 rounded-xl outline-none" value={localConfig.heroTitle} onChange={e => setLocalConfig({ ...localConfig, heroTitle: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2">Tiêu đề phụ</label>
              <textarea className="w-full p-4 bg-slate-50 rounded-xl outline-none" rows={3} value={localConfig.heroSubtitle} onChange={e => setLocalConfig({ ...localConfig, heroSubtitle: e.target.value })} />
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm space-y-6 lg:col-span-2">
          <h3 className="font-bold text-lg border-b pb-4">Về chúng tôi & Tầm nhìn</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2">Tiêu đề chính (Sứ mệnh chắp cánh ước mơ)</label>
              <input className="w-full p-4 bg-slate-50 rounded-xl outline-none" value={localConfig.aboutTitle || ''} onChange={e => setLocalConfig({ ...localConfig, aboutTitle: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2">Đoạn giới thiệu tổng quan</label>
              <textarea className="w-full p-4 bg-slate-50 rounded-xl outline-none" rows={3} value={localConfig.aboutText} onChange={e => setLocalConfig({ ...localConfig, aboutText: e.target.value })} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2">Tầm nhìn</label>
                <textarea className="w-full p-4 bg-slate-50 rounded-xl outline-none" rows={3} value={localConfig.vision} onChange={e => setLocalConfig({ ...localConfig, vision: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2">Sứ mệnh</label>
                <textarea className="w-full p-4 bg-slate-50 rounded-xl outline-none" rows={3} value={localConfig.mission} onChange={e => setLocalConfig({ ...localConfig, mission: e.target.value })} />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm space-y-6">
          <h3 className="font-bold text-lg border-b pb-4">Thông tin liên hệ</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2">Địa chỉ</label>
              <input className="w-full p-4 bg-slate-50 rounded-xl outline-none" value={localConfig.address} onChange={e => setLocalConfig({ ...localConfig, address: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2">SĐT Hotline</label>
                <input className="w-full p-4 bg-slate-50 rounded-xl outline-none" value={localConfig.phone} onChange={e => setLocalConfig({ ...localConfig, phone: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2">SĐT Zalo</label>
                <input className="w-full p-4 bg-slate-50 rounded-xl outline-none" value={localConfig.zalo} onChange={e => setLocalConfig({ ...localConfig, zalo: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2">Email</label>
              <input className="w-full p-4 bg-slate-50 rounded-xl outline-none" value={localConfig.email} onChange={e => setLocalConfig({ ...localConfig, email: e.target.value })} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2">Facebook URL</label>
                <input className="w-full p-4 bg-slate-50 rounded-xl outline-none text-xs" value={localConfig.facebook || ''} onChange={e => setLocalConfig({ ...localConfig, facebook: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2">YouTube URL</label>
                <input className="w-full p-4 bg-slate-50 rounded-xl outline-none text-xs" value={localConfig.youtube || ''} onChange={e => setLocalConfig({ ...localConfig, youtube: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2">Messenger Link</label>
                <input className="w-full p-4 bg-slate-50 rounded-xl outline-none text-xs" value={localConfig.messenger || ''} onChange={e => setLocalConfig({ ...localConfig, messenger: e.target.value })} placeholder="https://m.me/username" />
              </div>
            </div>
            <div className="border-t pt-4">
              <label className="block text-xs font-bold text-blue-600 mb-2 flex items-center gap-2">
                <Globe size={14} /> Link portfolio tác giả (Footer)
              </label>
              <input
                className="w-full p-4 bg-blue-50/50 rounded-xl outline-none text-xs border border-blue-100"
                value={localConfig.authorUrl || ''}
                onChange={e => setLocalConfig({ ...localConfig, authorUrl: e.target.value })}
                placeholder="https://your-portfolio.com"
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm space-y-6">
          <h3 className="font-bold text-lg border-b pb-4">Thông tin pháp lý</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2">Quyết định thành lập</label>
                <textarea
                  className="w-full p-4 bg-slate-50 rounded-xl outline-none text-sm resize-none"
                  rows={2}
                  value={localConfig.establishmentDecision}
                  onChange={e => setLocalConfig({ ...localConfig, establishmentDecision: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2">Số giấy phép /Mã số thuế (MSDN)</label>
                <textarea
                  className="w-full p-4 bg-slate-50 rounded-xl outline-none text-sm resize-none"
                  rows={2}
                  value={localConfig.businessLicense}
                  onChange={e => setLocalConfig({ ...localConfig, businessLicense: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2">Người đại diện</label>
                <input className="w-full p-4 bg-slate-50 rounded-xl outline-none text-sm" value={localConfig.representative} onChange={e => setLocalConfig({ ...localConfig, representative: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2">Ngày thành lập</label>
                <input className="w-full p-4 bg-slate-50 rounded-xl outline-none text-sm" value={localConfig.foundingDate} onChange={e => setLocalConfig({ ...localConfig, foundingDate: e.target.value })} />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm space-y-6 lg:col-span-2">
          <h3 className="font-bold text-lg border-b pb-4">Vị trí bản đồ (Google Maps Embed)</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2">URL nhúng Google Maps (Iframe SRC)</label>
              <textarea
                className="w-full p-4 bg-slate-50 rounded-xl outline-none text-xs font-mono"
                rows={3}
                value={localConfig.googleMapsEmbed}
                onChange={e => {
                  const val = e.target.value;
                  let finalUrl = val.trim().startsWith('<iframe')
                    ? (val.match(/src="([^"]+)"/)?.[1] || val)
                    : val;

                  // Force high zoom (!1d parameter) if found
                  if (finalUrl.includes('!1d')) {
                    finalUrl = finalUrl.replace(/!1d[\d\.]+/, '!1d200');
                  }

                  setLocalConfig({ ...localConfig, googleMapsEmbed: finalUrl });
                }}
                placeholder="https://www.google.com/maps/embed?pb=..."
              />
              <p className="text-[10px] text-slate-400 mt-2">
                * Truy cập Google Maps, chọn 'Chia sẻ' &rarr; 'Nhúng bản đồ' và copy phần URL trong thuộc tính <strong>src="..."</strong>
              </p>
            </div>
            {localConfig.googleMapsEmbed && (
              <div className="aspect-video w-full rounded-2xl overflow-hidden border border-slate-100 shadow-inner">
                <iframe src={localConfig.googleMapsEmbed} className="w-full h-full border-0" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const LeadsManager: React.FC = () => {
  const { state } = useApp();
  const [replyLead, setReplyLead] = useState<any>(null);

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Danh sách yêu cầu tư vấn</h2>
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest min-w-[240px]">Khách hàng</th>
              <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Liên hệ</th>
              <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Nội dung</th>
              <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Thời gian</th>
              <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {state.messages.map(m => (
              <tr key={m.id} className="group hover:bg-slate-50/50 transition duration-300">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-blue-100 flex-shrink-0">
                      {m.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-lg leading-tight">{m.name}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Khách hàng tiềm năng</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6 space-y-1">
                  {m.email && (
                    <button
                      onClick={() => setReplyLead(m)}
                      className="block text-sm text-blue-600 font-medium hover:underline flex items-center gap-1.5"
                    >
                      <Mail size={14} className="opacity-0 group-hover:opacity-100 transition" /> {m.email}
                    </button>
                  )}
                  <a
                    href={`tel:${m.phone}`}
                    className="block text-xs text-slate-500 font-bold hover:text-blue-600 transition flex items-center gap-1.5"
                  >
                    <Phone size={14} className="opacity-0 group-hover:opacity-100 transition" /> {m.phone}
                  </a>
                </td>
                <td className="px-8 py-6">
                  <p className="text-sm text-slate-600 font-medium line-clamp-2 max-w-xs">{m.message}</p>
                </td>
                <td className="px-8 py-6">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{m.timestamp}</p>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex justify-end gap-2">
                    <a
                      href={`https://zalo.me/${m.phone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-sky-50 text-sky-600 px-4 py-2.5 rounded-xl text-xs font-black hover:bg-sky-600 hover:text-white transition transform active:scale-95 shadow-sm flex items-center gap-2"
                    >
                      <img src={getAssetPath("/images/zalo.png")} className="w-5 h-5 object-contain rounded" alt="Zalo" />
                      Zalo
                    </a >
                    <button
                      onClick={() => setReplyLead(m)}
                      className="bg-blue-50 text-blue-600 px-4 py-2.5 rounded-xl text-xs font-black hover:bg-blue-600 hover:text-white transition transform active:scale-95 shadow-sm"
                    >
                      Phản hồi Email
                    </button>
                  </div >
                </td >
              </tr >
            ))}
          </tbody >
        </table >
        {
          state.messages.length === 0 && (
            <div className="p-32 text-center space-y-4">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
                <MessageSquare size={40} />
              </div>
              <p className="text-slate-400 font-bold text-lg">Chưa có yêu cầu nào được gửi đến.</p>
            </div>
          )
        }
      </div >

      {replyLead && (
        <EmailReplyModal
          lead={replyLead}
          onClose={() => setReplyLead(null)}
        />
      )}
    </div >
  );
};

const EmailReplyModal: React.FC<{ lead: any, onClose: () => void }> = ({ lead, onClose }) => {
  const [senderEmail, setSenderEmail] = useState(() => localStorage.getItem('bm_admin_sender_email') || '');
  const [msg, setMsg] = useState('');
  const [sending, setSending] = useState(false);

  const handleSenderChange = (val: string) => {
    setSenderEmail(val);
    localStorage.setItem('bm_admin_sender_email', val);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lead.email) return;

    const subject = encodeURIComponent(`Phản hồi từ Bình Minh: Về yêu cầu của bạn`);
    const body = encodeURIComponent(msg);
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${lead.email}&su=${subject}&body=${body}`;

    window.open(gmailUrl, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-300 border border-slate-100">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="space-y-1">
            <h3 className="text-xl font-black text-slate-900">Phản hồi khách hàng</h3>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{lead.name}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition"><X size={20} /></button>
        </div>

        <form onSubmit={handleSend} className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Người nhận</label>
              <input
                disabled
                className="w-full p-4 bg-slate-50 border-0 rounded-2xl text-slate-500 font-bold outline-none"
                value={lead.email || 'N/A'}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email của bạn (Sender)</label>
              <input
                required
                type="email"
                placeholder="domain@binhminh.edu.vn"
                className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none transition font-medium"
                value={senderEmail}
                onChange={e => handleSenderChange(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nội dung phản hồi</label>
              <textarea
                required
                rows={6}
                placeholder="Chào bạn, cảm ơn bạn đã quan tâm đến..."
                className="w-full p-6 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none transition font-medium resize-none"
                value={msg}
                onChange={e => setMsg(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={sending}
              className="bg-blue-600 text-white px-10 py-5 rounded-[2rem] font-black text-sm flex items-center gap-3 transition transform active:scale-95 shadow-xl shadow-blue-100 disabled:bg-slate-300"
            >
              {sending ? 'Đang gửi...' : <><Send size={18} /> Gửi phản hồi ngay</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const CoursesManager: React.FC = () => {
  const { state, updateState } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);

  const handleDelete = async (course: any) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa khóa học này?')) {
      await deletePhysicalFile(course.image);
      const newCourses = state.courses.filter(c => c.id !== course.id);
      updateState({ courses: newCourses });
      toast.success('Đã xóa khóa học!');
    }
  };

  const handleSave = (courseData: any) => {
    let newCourses;
    const isNewCategory = !state.categories.includes(courseData.category);

    if (editingCourse?.id) {
      newCourses = state.courses.map(c => c.id === editingCourse.id ? { ...courseData, id: c.id } : c);
    } else {
      const newCourse = { ...courseData, id: Date.now().toString() };
      newCourses = [...state.courses, newCourse];
    }

    const newState: Partial<typeof state> = { courses: newCourses };
    if (isNewCategory) {
      newState.categories = [...state.categories, courseData.category];
    }

    updateState(newState);
    setShowModal(false);
    setEditingCourse(null);
    toast.success(editingCourse ? 'Cập nhật khóa học thành công!' : 'Đã thêm khóa học mới!');
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900">Quản lý khóa học</h2>
          <p className="text-slate-500">Thêm, sửa hoặc xóa các khóa học trên hệ thống.</p>
        </div>
        <button
          onClick={() => { setEditingCourse(null); setShowModal(true); }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-blue-100 transition transform active:scale-95"
        >
          <PlusCircle size={20} /> Thêm khóa học mới
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {state.courses.map(c => (
          <div key={c.id} className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden group hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
            <div className="relative h-48 overflow-hidden">
              <img src={c.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={c.title} />
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={() => { setEditingCourse(c); setShowModal(true); }}
                  className="p-3 bg-white/90 backdrop-blur shadow-lg rounded-xl text-slate-600 hover:text-blue-600 hover:scale-110 transition"
                  title="Chỉnh sửa"
                >
                  <Edit3 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(c)}
                  className="p-3 bg-white/90 backdrop-blur shadow-lg rounded-xl text-slate-600 hover:text-red-600 hover:scale-110 transition"
                  title="Xóa"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              <div className="absolute bottom-4 left-4">
                <span className="px-3 py-1 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg">
                  {c.category}
                </span>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <h3 className="font-bold text-xl text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">{c.title}</h3>
              <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">{c.description}</p>

              <div className="flex items-center gap-4 text-xs text-slate-400 font-medium">
                <div className="flex items-center gap-1.5">
                  <Clock size={14} />
                  <span>{c.duration}</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                <span className="text-xl font-black text-blue-600">{c.price}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <CourseModal
          course={editingCourse}
          onClose={() => { setShowModal(false); setEditingCourse(null); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

const CourseModal: React.FC<{ course: any, onClose: () => void, onSave: (data: any) => void }> = ({ course, onClose, onSave }) => {
  const { state } = useApp();
  const modalRef = React.useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState(course || {
    title: '',
    description: '',
    price: '',
    duration: '',
    category: state.categories[0] || '',
    image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=800'
  });
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [imageTab, setImageTab] = useState<'upload' | 'url'>('upload');

  React.useEffect(() => {
    modalRef.current?.focus();
  }, []);

  const handleCategoryChange = (val: string) => {
    if (val === 'ADD_NEW') {
      setIsAddingCategory(true);
      setNewCategory('');
    } else {
      setIsAddingCategory(false);
      setFormData({ ...formData, category: val });
    }
  };

  const handleImageFile = async (file: File) => {
    const formDataUpload = new FormData();
    formDataUpload.append('file', file);

    try {
      // Delete old local file if exists
      if (formData.image) {
        await deletePhysicalFile(formData.image);
      }

      const token = localStorage.getItem('bm_admin_token') || sessionStorage.getItem('bm_admin_token');
      const res = await fetch(`${API_BASE_URL}/api/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formDataUpload,
      });
      const data = await res.json();
      if (data.url) {
        setFormData({ ...formData, image: data.url });
      }
    } catch (err) {
      console.error(err);
      toast.error("Tải ảnh thất bại!");
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = Array.from(e.clipboardData.items);
    const imageItem = items.find(item => item.type.includes('image'));

    if (imageItem) {
      const file = imageItem.getAsFile();
      if (file) handleImageFile(file);
    }
  };

  const handleSaveClick = () => {
    const finalData = { ...formData };
    if (isAddingCategory && newCategory.trim()) {
      finalData.category = newCategory.trim();
    }
    onSave(finalData);
  };

  return (
    <div
      ref={modalRef}
      tabIndex={-1}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 outline-none"
      onPaste={handlePaste}
    >
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-white w-full max-w-3xl rounded-[2.5rem] shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-8 border-b flex justify-between items-center bg-slate-50/50">
          <h3 className="text-2xl font-black text-slate-900">{course ? 'Cập nhật khóa học' : 'Thêm khóa học mới'}</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition"><X size={24} /></button>
        </div>

        <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Tên khóa học</label>
                <input
                  className="w-full p-4 bg-slate-50 border-0 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ví dụ: IELTS Masterclass"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Danh mục</label>
                {!isAddingCategory ? (
                  <select
                    className="w-full p-4 bg-slate-50 border-0 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition appearance-none"
                    value={formData.category}
                    onChange={e => handleCategoryChange(e.target.value)}
                  >
                    {state.categories.map((cat: string) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                    <option value="ADD_NEW" className="text-blue-600 font-bold">+ Thêm danh mục mới...</option>
                  </select>
                ) : (
                  <div className="flex gap-2">
                    <input
                      autoFocus
                      className="flex-1 p-4 bg-blue-50 border-2 border-blue-200 rounded-2xl outline-none transition"
                      value={newCategory}
                      onChange={e => setNewCategory(e.target.value)}
                      placeholder="Nhập danh mục mới..."
                    />
                    <button onClick={() => setIsAddingCategory(false)} className="p-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl transition" title="Hủy">
                      <X size={20} />
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Giá</label>
                  <input
                    className="w-full p-4 bg-slate-50 border-0 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition"
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                    placeholder="Ví dụ: 2.500.000 VNĐ"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Thời lượng</label>
                  <input
                    className="w-full p-4 bg-slate-50 border-0 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition"
                    value={formData.duration}
                    onChange={e => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="Ví dụ: 3 tháng (36 buổi)"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Hình ảnh khóa học</label>
              <div className="bg-slate-50 rounded-3xl p-4 space-y-4">
                <div className="flex gap-2 p-1 bg-white rounded-xl">
                  <button
                    onClick={() => setImageTab('upload')}
                    className={`flex-1 flex items-center justify - center gap - 2 py - 2 rounded - lg text - sm font - bold transition ${imageTab === 'upload' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                  >
                    <Upload size={16} /> Tải lên /Paste
                  </button>
                  <button
                    onClick={() => setImageTab('url')}
                    className={`flex-1 flex items-center justify - center gap - 2 py - 2 rounded - lg text - sm font - bold transition ${imageTab === 'url' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'} `}
                  >
                    <LinkIcon size={16} /> URL
                  </button>
                </div>

                {imageTab === 'upload' ? (
                  <div
                    className="relative group h-48 rounded-2xl border-2 border-dashed border-slate-200 hover:border-blue-400 transition-colors flex flex-col items-center justify-center text-center p-4 cursor-pointer overflow-hidden"
                    onClick={() => document.getElementById('imageFile')?.click()}
                  >
                    {formData.image ? (
                      <img src={formData.image} className="absolute inset-0 w-full h-full object-cover" alt="Preview" />
                    ) : (
                      <>
                        <ImageIcon size={32} className="text-slate-300 mb-2 group-hover:text-blue-400 transition" />
                        <p className="text-xs font-bold text-slate-400 group-hover:text-blue-500">Kéo thả, Click hoặc Paste hình ảnh vào đây</p>
                      </>
                    )}
                    <input
                      type="file"
                      id="imageFile"
                      className="hidden"
                      accept="image/*"
                      onChange={e => e.target.files?.[0] && handleImageFile(e.target.files[0])}
                    />
                    {formData.image && (
                      <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                        <span className="bg-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg">Thay đổi hình ảnh</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <input
                    className="w-full p-4 bg-white border-0 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
                    value={formData.image}
                    onChange={e => setFormData({ ...formData, image: e.target.value })}
                    placeholder="Dán link hình ảnh (https://...)"
                  />
                )}

                {formData.image && (
                  <button
                    onClick={() => setFormData({ ...formData, image: '' })}
                    className="w-full py-2 text-xs font-bold text-red-500 hover:text-red-600 transition"
                  >
                    Gỡ bỏ hình ảnh
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Mô tả chi tiết</label>
            <textarea
              className="w-full p-4 bg-slate-50 border-0 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition"
              rows={4}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder="Nhập nội dung giảng dạy, mục tiêu khóa học..."
            />
          </div>
        </div>

        <div className="p-8 bg-slate-50 border-t flex justify-end gap-4">
          <button onClick={onClose} className="px-10 py-3 text-slate-600 font-bold hover:bg-slate-200 rounded-2xl transition">Hủy bỏ</button>
          <button
            onClick={handleSaveClick}
            className="px-14 py-3 bg-blue-600 text-white font-bold rounded-2xl shadow-xl shadow-blue-100 hover:bg-blue-700 transition transform active:scale-95"
          >
            {course ? 'Cập nhật ngay' : 'Thêm khóa học'}
          </button>
        </div>
      </div>
    </div>
  );
};

const SeoManager: React.FC = () => {
  const { state, updateState } = useApp();
  const [localSeo, setLocalSeo] = useState({
    title: state.config.seoTitle,
    description: state.config.seoDescription,
    keywords: state.config.seoKeywords
  });

  return (
    <div className="max-w-4xl space-y-10">
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900">Quản trị SEO</h2>
        <p className="text-slate-500">Tối ưu hóa sự hiện diện của trung tâm trên công cụ tìm kiếm.</p>
      </div>

      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm space-y-8">
        <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-2xl text-blue-700">
          <Globe className="shrink-0 mt-1" />
          <p className="text-sm leading-relaxed">Google sẽ hiển thị kết quả dựa trên các thẻ tiêu đề và mô tả dưới đây. Hãy chắc chắn rằng chúng chứa các từ khóa quan trọng như "Tây Ninh", "Tiếng Anh", "Luyện thi IELTS".</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Page Title (Meta Title)</label>
            <input
              className="w-full p-4 bg-slate-50 border-0 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition"
              value={localSeo.title}
              onChange={e => setLocalSeo({ ...localSeo, title: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Meta Description</label>
            <textarea
              className="w-full p-4 bg-slate-50 border-0 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition"
              rows={4}
              value={localSeo.description}
              onChange={e => setLocalSeo({ ...localSeo, description: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Keywords (Cách nhau bằng dấu phẩy)</label>
            <input
              className="w-full p-4 bg-slate-50 border-0 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition"
              value={localSeo.keywords}
              onChange={e => setLocalSeo({ ...localSeo, keywords: e.target.value })}
            />
          </div>
        </div>

        <button
          onClick={() => {
            updateState({ config: { ...state.config, seoTitle: localSeo.title, seoDescription: localSeo.description, seoKeywords: localSeo.keywords } });
            toast.success("Cập nhật SEO thành công!");
          }}
          className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-black transition"
        >
          Lưu cấu hình SEO
        </button>
      </div>

      <div className="p-8 bg-slate-100 rounded-3xl">
        <h4 className="font-bold mb-4 flex items-center gap-2"><Globe size={18} /> Xem trước hiển thị</h4>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-2">
          <p className="text-blue-800 text-lg font-medium hover:underline cursor-pointer">{localSeo.title}</p>
          <p className="text-green-700 text-sm">{typeof window !== 'undefined' ? window.location.origin : 'https://binhminh-tayninh.edu.vn'}</p>
          <p className="text-slate-600 text-sm line-clamp-2">{localSeo.description}</p>
        </div>
      </div>
    </div>
  );
};

const TeachersManager: React.FC = () => {
  const { state, updateState } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<any>(null);

  const handleDelete = async (teacher: any) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa giảng viên này?')) {
      await deletePhysicalFile(teacher.image);
      const newTeachers = state.teachers.filter(t => t.id !== teacher.id);
      updateState({ teachers: newTeachers });
      toast.success('Đã xóa giảng viên!');
    }
  };

  const handleSave = (teacherData: any) => {
    let newTeachers;
    if (editingTeacher?.id) {
      newTeachers = state.teachers.map(t => t.id === editingTeacher.id ? { ...teacherData, id: t.id } : t);
    } else {
      const newTeacher = { ...teacherData, id: Date.now().toString() };
      newTeachers = [...state.teachers, newTeacher];
    }
    updateState({ teachers: newTeachers });
    setShowModal(false);
    setEditingTeacher(null);
    toast.success(editingTeacher ? 'Cập nhật thông tin giảng viên thành công!' : 'Đã thêm giảng viên mới!');
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900tracking-tight">Quản lý giảng viên</h2>
          <p className="text-slate-500">Danh sách đội ngũ giáo viên của trung tâm.</p>
        </div>
        <button
          onClick={() => { setEditingTeacher(null); setShowModal(true); }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold transition transform active:scale-95 shadow-xl shadow-indigo-100 flex items-center gap-2"
        >
          <PlusCircle size={20} /> Thêm giảng viên
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {state.teachers.map((t: any) => (
          <div key={t.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm group hover:shadow-xl hover:shadow-indigo-100/30 transition-all duration-300 space-y-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-3xl bg-indigo-50 overflow-hidden border-4 border-white shadow-inner">
                {t.image ? (
                  <img src={getAssetPath(t.image)} className="w-full h-full object-cover" alt={t.name} />
                ) : (
                  <img
                    src={getAssetPath(t.gender === 'female' ? '/assets/3d/women.png' : '/assets/3d/men.png')}
                    className="w-full h-full object-cover"
                    alt="Default Avatar"
                  />
                )}
              </div>
              <div className="absolute -bottom-2 -right-2">
                <span className={`px - 3 py - 1 text - [10px] font-black uppercase tracking - widest rounded - full shadow - lg text - white ${t.gender === 'female' ? 'bg-pink-500' : 'bg-blue-500'} `}>
                  {t.gender === 'female' ? 'Nữ' : 'Nam'}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="font-black text-xl text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{t.name}</h3>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{t.role}</p>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-50">
              <div className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                <Phone size={16} className="text-indigo-400" />
                <span>{t.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600 font-medium line-clamp-1">
                <Mail size={16} className="text-indigo-400" />
                <span>{t.email}</span>
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                onClick={() => { setEditingTeacher(t); setShowModal(true); }}
                className="flex-1 py-3 bg-slate-50 text-indigo-600 rounded-xl text-xs font-black hover:bg-indigo-600 hover:text-white transition transform active:scale-95"
              >
                Chỉnh sửa
              </button>
              <button
                onClick={() => handleDelete(t)}
                className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition transform active:scale-95"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}

        {state.teachers.length === 0 && (
          <div className="col-span-full py-32 bg-white rounded-[3rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-300">
              <UsersIcon size={40} />
            </div>
            <div>
              <p className="text-slate-400 font-black text-xl">Chưa có giảng viên nào</p>
              <p className="text-slate-400 text-sm">Hãy bắt đầu bằng cách thêm giảng viên đầu tiên.</p>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <TeacherModal
          teacher={editingTeacher}
          onClose={() => { setShowModal(false); setEditingTeacher(null); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

const TeacherModal: React.FC<{ teacher: any, onClose: () => void, onSave: (data: any) => void }> = ({ teacher, onClose, onSave }) => {
  const modalRef = React.useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState(teacher || {
    name: '',
    role: '',
    phone: '',
    email: '',
    gender: 'male',
    bio: '',
    image: '',
    zalo: '',
    showPhone: false,
    showEmail: false
  });
  const [imageTab, setImageTab] = useState<'upload' | 'url'>('upload');

  React.useEffect(() => {
    modalRef.current?.focus();
  }, []);

  const handleImageFile = async (file: File) => {
    const formDataUpload = new FormData();
    formDataUpload.append('file', file);

    try {
      // Delete old local file if exists
      if (formData.image) {
        await deletePhysicalFile(formData.image);
      }

      const token = localStorage.getItem('bm_admin_token') || sessionStorage.getItem('bm_admin_token');
      const res = await fetch(`${API_BASE_URL}/api/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formDataUpload,
      });
      const data = await res.json();
      if (data.url) {
        setFormData({ ...formData, image: data.url });
      }
    } catch (err) {
      console.error(err);
      toast.error("Tải ảnh thất bại!");
    }
  };

  const handleSaveClick = () => {
    if (!formData.name || !formData.role) {
      toast.warning("Vui lòng nhập đầy đủ Tên và Chức vụ!");
      return;
    }
    // Final check for default avatar if none provided
    const finalData = { ...formData };
    if (!finalData.image) {
      // We don't necessarily need to set it here if the list rendering handles it, 
      // but let's keep it clear.
      // finalData.image = finalData.gender === 'female' ? '/assets/3d/women.png' : '/assets/3d/men.png';
    }
    onSave(finalData);
  };

  return (
    <div
      ref={modalRef}
      tabIndex={-1}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 outline-none"
    >
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-300 border border-slate-100 flex flex-col max-h-[90vh]">
        <div className="p-10 border-b flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">{teacher ? 'Cập nhật giảng viên' : 'Thêm giảng viên mới'}</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Thông tin chi tiết đội ngũ</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-slate-200 rounded-full transition"><X size={24} /></button>
        </div>

        <div className="p-10 space-y-8 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Column: Avatar & Basic Info */}
            <div className="lg:col-span-4 space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ảnh đại diện</label>
                <div className="bg-slate-50 rounded-[2.5rem] p-6 space-y-4">
                  <div
                    className="relative group w-full aspect-square rounded-[2rem] border-2 border-dashed border-slate-200 hover:border-indigo-400 transition-all flex flex-col items-center justify-center text-center cursor-pointer overflow-hidden bg-white shadow-inner"
                    onClick={() => document.getElementById('teacherImageFile')?.click()}
                  >
                    {formData.image ? (
                      <img src={getAssetPath(formData.image)} className="absolute inset-0 w-full h-full object-cover" alt="Preview" />
                    ) : (
                      <div className="flex flex-col items-center p-4">
                        <img
                          src={getAssetPath(formData.gender === 'female' ? '/assets/3d/women.png' : '/assets/3d/men.png')}
                          className="w-20 h-20 object-contain mb-3 opacity-50 opacity-100 transition-opacity"
                          alt="Default"
                        />
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-indigo-500">Click để tải ảnh</p>
                      </div>
                    )}
                    <input
                      type="file"
                      id="teacherImageFile"
                      className="hidden"
                      accept="image/*"
                      onChange={e => e.target.files?.[0] && handleImageFile(e.target.files[0])}
                    />
                    {formData.image && (
                      <div className="absolute inset-0 bg-indigo-900/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                        <span className="bg-white px-4 py-2 rounded-xl text-xs font-black shadow-lg">Thay đổi ảnh</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 p-1 bg-white rounded-xl shadow-sm">
                    <button
                      onClick={() => setFormData({ ...formData, gender: 'male' })}
                      className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition ${formData.gender === 'male' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}
                    >
                      Nam
                    </button>
                    <button
                      onClick={() => setFormData({ ...formData, gender: 'female' })}
                      className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition ${formData.gender === 'female' ? 'bg-pink-500 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}
                    >
                      Nữ
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Detailed Forms */}
            <div className="lg:col-span-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Họ và Tên</label>
                  <input
                    className="w-full p-5 bg-slate-50 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none transition font-bold text-slate-700"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ví dụ: Nguyễn Văn A"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Chức vụ /Chuyên môn</label>
                  <input
                    className="w-full p-5 bg-slate-50 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none transition font-bold text-slate-700"
                    value={formData.role}
                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                    placeholder="Ví dụ: Giảng viên IELTS"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center ml-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Số điện thoại</label>
                    <label className="flex items-center gap-1.5 cursor-pointer group">
                      <input
                        type="checkbox"
                        className="w-3 h-3 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        checked={formData.showPhone}
                        onChange={e => setFormData({ ...formData, showPhone: e.target.checked })}
                      />
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest group-hover:text-indigo-600 transition-colors">Công khai</span>
                    </label>
                  </div>
                  <input
                    className="w-full p-5 bg-slate-50 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none transition font-bold text-slate-700"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Ví dụ: 090xxx"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center ml-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email liên hệ</label>
                    <label className="flex items-center gap-1.5 cursor-pointer group">
                      <input
                        type="checkbox"
                        className="w-3 h-3 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        checked={formData.showEmail}
                        onChange={e => setFormData({ ...formData, showEmail: e.target.checked })}
                      />
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest group-hover:text-indigo-600 transition-colors">Công khai</span>
                    </label>
                  </div>
                  <input
                    className="w-full p-5 bg-slate-50 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none transition font-bold text-slate-700"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Ví dụ: hotro@binhminh.edu.vn"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Giới thiệu ngắn (Bio)</label>
                <textarea
                  className="w-full p-6 bg-slate-50 border-2 border-transparent focus:border-indigo-500 rounded-[2rem] outline-none transition font-medium text-slate-600 resize-none"
                  rows={4}
                  value={formData.bio}
                  onChange={e => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Nhập đôi nét về kinh nghiệm giảng dạy..."
                />
              </div>
            </div>
          </div>
        </div>
        <div className="p-10 bg-slate-50 border-t flex justify-end gap-5">
          <button
            onClick={onClose}
            className="px-10 py-4 text-slate-400 font-black uppercase tracking-widest hover:text-slate-600 transition"
          >
            Hủy bỏ
          </button>
          <button
            onClick={handleSaveClick}
            className="px-16 py-4 bg-indigo-600 text-white font-black uppercase tracking-widest rounded-2xl shadow-2xl shadow-indigo-200 hover:bg-indigo-700 transition transform active:scale-95 flex items-center gap-3"
          >
            <Save size={18} /> {teacher ? 'Cập nhật ngay' : 'Thêm giảng viên'}
          </button>
        </div>
      </div>
    </div>
  );
};

const AchievementsManager = () => {
  const { state, updateState } = useApp();
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null | 'new'>(null);

  const handleDelete = (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xoá thành tích này?')) return;
    updateState({
      achievements: (state.achievements || []).filter(a => a.id !== id)
    });
    toast.success('Đã xoá thành tích');
  };

  const handleSave = (data: Achievement) => {
    const list = state.achievements || [];
    const exists = list.find(a => a.id === data.id);
    if (exists) {
      updateState({
        achievements: list.map(a => a.id === data.id ? data : a)
      });
    } else {
      updateState({
        achievements: [...list, data]
      });
    }
    setEditingAchievement(null);
  };

  const sortedAchievements = [...(state.achievements || [])].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Thành tích nổi bật</h2>
          <p className="text-slate-500 font-medium mt-1">Quản lý các giải thưởng, chứng nhận của trung tâm</p>
        </div>
        <button
          onClick={() => setEditingAchievement('new')}
          className="flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition transform hover:-translate-y-1 active:scale-95"
        >
          <Trophy size={20} /> Thêm thành tích
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedAchievements.map(a => (
          <div key={a.id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 group hover:shadow-xl transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
              <button
                onClick={() => setEditingAchievement(a)}
                className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-colors"
              >
                <Edit3 size={16} />
              </button>
              <button
                onClick={() => handleDelete(a.id)}
                className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="flex flex-col h-full">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-black text-xl">
                  {a.year}
                </div>
                <div className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Thứ tự: {a.order || 0}
                </div>
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-3 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{a.title}</h3>
              <p className="text-slate-500 font-medium text-sm leading-relaxed line-clamp-3">{a.description}</p>
            </div>
          </div>
        ))}
      </div>

      {editingAchievement && (
        <AchievementModal
          achievement={editingAchievement === 'new' ? null : editingAchievement}
          onClose={() => setEditingAchievement(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

const AchievementModal = ({ achievement, onClose, onSave }: { achievement: Achievement | null, onClose: () => void, onSave: (data: Achievement) => void }) => {
  const [formData, setFormData] = useState<Achievement>(achievement || {
    id: Date.now().toString(),
    year: new Date().getFullYear().toString(),
    title: '',
    description: '',
    order: 0
  });

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center">
          <h3 className="text-2xl font-black text-slate-900">{achievement ? 'Chỉnh sửa' : 'Thêm'} thành tích</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition"><X size={20} /></button>
        </div>

        <div className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Năm</label>
              <input
                className="w-full p-5 bg-slate-50 border-2 border-transparent focus:border-blue-600 rounded-2xl outline-none transition font-black text-slate-900"
                value={formData.year}
                onChange={e => setFormData({ ...formData, year: e.target.value })}
                placeholder="VD: 2023"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Thứ tự ưu tiên</label>
              <input
                type="number"
                className="w-full p-5 bg-slate-50 border-2 border-transparent focus:border-blue-600 rounded-2xl outline-none transition font-black text-slate-900"
                value={formData.order || 0}
                onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tiêu đề thành tích</label>
            <input
              className="w-full p-5 bg-slate-50 border-2 border-transparent focus:border-blue-600 rounded-2xl outline-none transition font-black text-slate-900"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              placeholder="VD: Trung Tâm Xuất Sắc"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Chi tiết /Mô tả</label>
            <textarea
              className="w-full p-5 bg-slate-50 border-2 border-transparent focus:border-blue-600 rounded-2xl outline-none transition font-medium text-slate-600 resize-none"
              rows={4}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder="Nhập chi tiết về thành tích..."
            />
          </div>

          <button
            onClick={() => {
              if (!formData.title || !formData.year) {
                toast.error('Vui lòng nhập đầy đủ Tiêu đề và Năm');
                return;
              }
              onSave(formData);
            }}
            className="w-full bg-blue-600 text-white p-5 rounded-2xl font-black text-lg shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 transition transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2"
          >
            <Save size={20} /> {achievement ? 'Cập nhật ngay' : 'Thêm ngay'}
          </button>
        </div>
      </div>
    </div>
  );
};
const TestimonialsManager: React.FC = () => {
  const { state, updateState } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);

  const handleDelete = async (testimonial: Testimonial) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa đánh giá này?')) {
      await deletePhysicalFile(testimonial.image);
      const newTestimonials = (state.testimonials || []).filter(t => t.id !== testimonial.id);
      updateState({ testimonials: newTestimonials });
      toast.success('Đã xóa đánh giá!');
    }
  };

  const handleSave = (testimonialData: Testimonial) => {
    let newTestimonials;
    const list = state.testimonials || [];
    if (editingTestimonial?.id) {
      newTestimonials = list.map(t => t.id === editingTestimonial.id ? { ...testimonialData, id: t.id } : t);
    } else {
      const newTestimonial = { ...testimonialData, id: Date.now().toString() };
      newTestimonials = [...list, newTestimonial];
    }
    updateState({ testimonials: newTestimonials });
    setShowModal(false);
    setEditingTestimonial(null);
    toast.success(editingTestimonial ? 'Cập nhật đánh giá thành công!' : 'Đã thêm đánh giá mới!');
  };

  const sortedTestimonials = [...(state.testimonials || [])].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Đánh giá khách hàng</h2>
          <p className="text-slate-500 font-medium mt-1">Quản lý nhận xét từ phụ huynh và học sinh</p>
        </div>
        <button
          onClick={() => { setEditingTestimonial(null); setShowModal(true); }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition transform active:scale-95 flex items-center gap-2"
        >
          <PlusCircle size={20} /> Thêm đánh giá
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {sortedTestimonials.map((t: Testimonial) => (
          <div key={t.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm group hover:shadow-xl transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
              <button
                onClick={() => { setEditingTestimonial(t); setShowModal(true); }}
                className="p-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-colors"
              >
                <Edit3 size={16} />
              </button>
              <button
                onClick={() => handleDelete(t)}
                className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-20 h-20 rounded-2xl bg-slate-50 overflow-hidden border-2 border-slate-100 shrink-0 shadow-inner">
                {t.image ? (
                  <img src={getAssetPath(t.image)} className="w-full h-full object-cover" alt={t.name} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50">
                    <ImageIcon size={30} />
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className={i < t.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"} />
                  ))}
                </div>
                <h3 className="font-black text-xl text-slate-900 uppercase tracking-tight">{t.name}</h3>
                <p className="text-xs font-black text-indigo-600 uppercase tracking-widest">{t.role}</p>
              </div>
            </div>

            <p className="mt-6 text-slate-500 font-medium italic text-sm leading-relaxed line-clamp-4">
              "{t.content}"
            </p>

            <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Thứ tự hiển thị: {t.order || 0}</span>
            </div>
          </div>
        ))}

        {sortedTestimonials.length === 0 && (
          <div className="col-span-full py-32 bg-white rounded-[3rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
              <MessageSquare size={40} />
            </div>
            <div>
              <p className="text-slate-400 font-black text-xl">Chưa có đánh giá khách hàng nào</p>
              <p className="text-slate-400 text-sm">Nhấn nút "Thêm đánh giá" để bắt đầu.</p>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <TestimonialModal
          testimonial={editingTestimonial}
          onClose={() => { setShowModal(false); setEditingTestimonial(null); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

const TestimonialModal = ({ testimonial, onClose, onSave }: { testimonial: Testimonial | null, onClose: () => void, onSave: (data: Testimonial) => void }) => {
  const [formData, setFormData] = useState<Testimonial>(testimonial || {
    id: '',
    name: '',
    role: 'PHHS',
    content: '',
    rating: 5,
    order: 0,
    image: ''
  });

  const handleImageUpload = async (file: File) => {
    const data = new FormData();
    data.append('file', file);
    try {
      if (formData.image) await deletePhysicalFile(formData.image);
      const token = localStorage.getItem('bm_admin_token') || sessionStorage.getItem('bm_admin_token');
      const res = await fetch(`${API_BASE_URL}/api/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: data
      });
      const { url } = await res.json();
      if (url) setFormData({ ...formData, image: url });
    } catch (err) {
      toast.error('Lỗi tải ảnh');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center">
          <h3 className="text-2xl font-black text-slate-900">{testimonial ? 'Chỉnh sửa' : 'Thêm'} đánh giá</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition"><X size={20} /></button>
        </div>

        <div className="p-8 space-y-6 overflow-y-auto max-h-[70vh]">
          <div className="flex gap-8 items-start">
            <div
              className="w-32 h-32 rounded-[2rem] bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer overflow-hidden group shrink-0"
              onClick={() => document.getElementById('testiImage')?.click()}
            >
              {formData.image ? (
                <img src={getAssetPath(formData.image)} className="w-full h-full object-cover" alt="Preview" />
              ) : (
                <>
                  <Upload size={24} className="text-slate-300 group-hover:text-indigo-500 transition-colors" />
                  <span className="text-[9px] font-black text-slate-300 uppercase mt-2 group-hover:text-indigo-500">Ảnh</span>
                </>
              )}
              <input
                id="testiImage"
                type="file"
                hidden
                accept="image/*"
                onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
              />
            </div>

            <div className="flex-1 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tên khách hàng</label>
                <input
                  className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-2xl outline-none transition font-black text-slate-900"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="VD: Minh Hằng"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Vai trò</label>
                  <input
                    className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-2xl outline-none transition font-black text-slate-900"
                    value={formData.role}
                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                    placeholder="VD: PHHS"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Xếp hạng (1-5)</label>
                  <select
                    className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-2xl outline-none transition font-black text-slate-900"
                    value={formData.rating}
                    onChange={e => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                  >
                    {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} Sao</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nhận xét /Đánh giá</label>
            <textarea
              className="w-full p-5 bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-2xl outline-none transition font-medium text-slate-600 resize-none"
              rows={4}
              value={formData.content}
              onChange={e => setFormData({ ...formData, content: e.target.value })}
              placeholder="Nhập nội dung đánh giá từ khách hàng..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Thứ tự ưu tiên</label>
            <input
              type="number"
              className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-2xl outline-none transition font-black text-slate-900"
              value={formData.order || 0}
              onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
            />
          </div>

          <button
            onClick={() => {
              if (!formData.name || !formData.content) {
                toast.error('Vui lòng nhập đầy đủ Tên và Nội dung');
                return;
              }
              onSave(formData);
            }}
            className="w-full bg-indigo-600 text-white p-5 rounded-2xl font-black text-lg shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40 transition transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2"
          >
            <Save size={20} /> {testimonial ? 'Cập nhật ngay' : 'Thêm ngay'}
          </button>
        </div>
      </div>
    </div>
  );
};

const DocumentsManager = () => {
  const { state, updateState } = useApp();
  const [isUploading, setIsUploading] = useState(false);
  const [newDocLabel, setNewDocLabel] = useState('');
  const [newDocDescription, setNewDocDescription] = useState('');
  const [newDocOrder, setNewDocOrder] = useState('0');
  const [adminDocSearch, setAdminDocSearch] = useState('');

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Chỉ hỗ trợ file định dạng PDF');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('bm_admin_token') || sessionStorage.getItem('bm_admin_token');
      const response = await fetch(`${API_BASE_URL}/api/upload-pdf`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });
      if (response.ok) {
        const { url } = await response.json();
        const newDoc: PublicDocument = {
          id: Date.now().toString(),
          name: file.name,
          label: newDocLabel.trim() || file.name,
          description: newDocDescription.trim(),
          type: 'PDF',
          uploadDate: new Date().toLocaleDateString('vi-VN'),
          url,
          order: parseInt(newDocOrder) || 0
        };
        updateState({ publicDocuments: [...(state.publicDocuments || []), newDoc] });
        setNewDocLabel('');
        setNewDocDescription('');
        setNewDocOrder('0');
        toast.success('Đã tải lên tài liệu thành công');
      } else {
        toast.error('Lỗi khi tải lên tệp');
      }
    } catch (error) {
      toast.error('Không thể kết nối đến server');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (doc: PublicDocument) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa tài liệu này?')) return;

    try {
      await deletePhysicalFile(doc.url);
      updateState({
        publicDocuments: (state.publicDocuments || []).filter(d => d.id !== doc.id)
      });
      toast.success('Đã xóa tài liệu');
    } catch (error) {
      toast.error('Lỗi khi xóa tài liệu trên cloud');
    }
  };

  const updateOrder = (docId: string, newOrder: number) => {
    updateState({
      publicDocuments: (state.publicDocuments || []).map(d =>
        d.id === docId ? { ...d, order: newOrder } : d
      )
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
        <div className="flex-1">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Văn bản Công khai</h2>
          <p className="text-slate-500 font-medium mt-1">Quản lý các tài liệu PDF công khai của trung tâm</p>
        </div>

        <div className="flex flex-col gap-4 w-full lg:w-3/4">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-8 flex flex-col gap-2">
              <input
                type="text"
                placeholder="Nhãn văn bản (VD: Quyết định thành lập...)"
                className="px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none transition font-bold text-slate-700 w-full"
                value={newDocLabel}
                onChange={(e) => setNewDocLabel(e.target.value)}
              />
              <input
                type="text"
                placeholder="Mô tả (không bắt buộc)..."
                className="px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none transition font-medium text-slate-600 w-full"
                value={newDocDescription}
                onChange={(e) => setNewDocDescription(e.target.value)}
              />
            </div>

            <div className="sm:col-span-4 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Thứ tự:</span>
                <input
                  type="number"
                  className="w-full px-4 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none transition font-bold text-center"
                  value={newDocOrder}
                  onChange={(e) => setNewDocOrder(e.target.value)}
                />
              </div>
              <label className="flex items-center justify-center gap-2 cursor-pointer bg-blue-600 text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition transform hover:-translate-y-1 active:scale-95 whitespace-nowrap">
                {isUploading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Upload size={20} />}
                <span>Tải lên PDF</span>
                <input type="file" className="hidden" accept=".pdf" onChange={handleUpload} disabled={isUploading} />
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-100 bg-slate-50/30 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm tài liệu đã đăng..."
              className="w-full bg-white border-2 border-slate-100 rounded-2xl py-3 pl-14 pr-6 text-slate-900 font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-sm"
              value={adminDocSearch}
              onChange={(e) => setAdminDocSearch(e.target.value)}
            />
          </div>
          <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">
            {(state.publicDocuments || []).length} Tài liệu
          </div>
        </div>

        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">Tên tài liệu</th>
              <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-widest text-center" style={{ width: '100px' }}>Thứ tự</th>
              <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">Ngày đăng</th>
              <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {(() => {
              const filtered = (state.publicDocuments || []).filter(doc =>
                (doc.label || doc.name).toLowerCase().includes(adminDocSearch.toLowerCase())
              ).sort((a, b) => (a.order || 0) - (b.order || 0));

              if (filtered.length > 0) {
                return filtered.map(doc => (
                  <tr key={doc.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-start space-x-4">
                        <div className="p-3 bg-red-50 text-red-500 rounded-xl group-hover:scale-110 group-hover:bg-red-500 group-hover:text-white transition-all duration-500 flex-shrink-0 mt-1">
                          <FileText size={24} />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-black text-slate-900 text-xl leading-tight mb-1">{doc.label || doc.name}</span>
                          {doc.description && (
                            <p className="text-sm text-slate-500 font-medium mb-2 leading-relaxed max-w-md">
                              {doc.description}
                            </p>
                          )}
                          <span className="text-[10px] font-bold text-slate-400 font-mono bg-slate-100 px-2 py-0.5 rounded w-fit italic">
                            Tệp gốc: {doc.name}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <input
                        type="number"
                        className="w-16 px-2 py-2 bg-slate-50 border border-slate-200 rounded-lg text-center font-bold text-slate-700 focus:border-blue-500 outline-none"
                        value={doc.order || 0}
                        onChange={(e) => updateOrder(doc.id, parseInt(e.target.value) || 0)}
                      />
                    </td>
                    <td className="px-8 py-6 text-slate-500 font-medium text-sm">{doc.uploadDate}</td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end space-x-2">
                        <a
                          href={getAssetPath(doc.url)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-xl transition-all"
                        >
                          <ExternalLink size={18} />
                        </a>
                        <button
                          onClick={() => handleDelete(doc)}
                          className="p-3 text-red-600 bg-red-50 hover:bg-red-600 hover:text-white rounded-xl transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ));
              }

              return (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center justify-center space-y-4 opacity-30">
                      <FileText size={48} />
                      <p className="font-black text-xl">
                        {adminDocSearch ? 'Không tìm thấy tài liệu nào khớp' : 'Chưa có tài liệu nào'}
                      </p>
                    </div>
                  </td>
                </tr>
              );
            })()}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const SystemOptimizer: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [junkFiles, setJunkFiles] = useState<any[]>([]);
  const [scanned, setScanned] = useState(false);

  const scanForGarbage = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('bm_admin_token') || sessionStorage.getItem('bm_admin_token');
      const res = await fetch(`${API_BASE_URL}/api/garbage-collector`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setJunkFiles(data.files);
      setScanned(true);
      toast.info(`Tìm thấy ${data.files.length} tệp rác`);
    } catch (e) {
      toast.error('Lỗi khi quét tệp rác');
    } finally {
      setLoading(false);
    }
  };

  const cleanGarbage = async () => {
    if (!window.confirm(`Bạn có chắc muốn xóa ${junkFiles.length} tệp này?`)) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('bm_admin_token') || sessionStorage.getItem('bm_admin_token');
      const res = await fetch(`${API_BASE_URL}/api/garbage-collector?action=delete`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Đã xóa thành công ${data.deleted} tệp rác`);
        setJunkFiles([]);
        setScanned(true);
      }
    } catch (e) {
      toast.error('Lỗi khi xóa tệp rác');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-10">
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900">Tối ưu hệ thống</h2>
        <p className="text-slate-500">Dọn dẹp các tệp tin dư thừa không được sử dụng trong cơ sở dữ liệu.</p>
      </div>

      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm space-y-8">
        <div className="flex items-center justify-between p-6 bg-blue-50 rounded-3xl">
          <div className="space-y-1">
            <h4 className="font-bold text-blue-900">Quét tệp rác</h4>
            <p className="text-sm text-blue-700/70">Hệ thống sẽ tìm các ảnh và tài liệu trong thư mục uploads/pdfs nhưng không có trong trang web.</p>
          </div>
          <button
            onClick={scanForGarbage}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Đang xử lý...' : 'Bắt đầu quét'}
          </button>
        </div>

        {scanned && (
          <div className="space-y-6 animate-in fade-in slide-in-from-top-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-900">Kết quả quét: {junkFiles.length} tệp</h3>
              {junkFiles.length > 0 && (
                <button
                  onClick={cleanGarbage}
                  className="bg-red-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-red-700 transition flex items-center gap-2"
                >
                  <Trash2 size={18} /> Dọn dẹp tất cả
                </button>
              )}
            </div>

            {junkFiles.length > 0 ? (
              <div className="border border-slate-100 rounded-3xl overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase">Tên tệp</th>
                      <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase">Thư mục</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {junkFiles.map((file, idx) => (
                      <tr key={idx}>
                        <td className="px-6 py-4 text-sm font-medium text-slate-700">{file.name}</td>
                        <td className="px-6 py-4 text-sm text-slate-500 uppercase">{file.dir}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-10 bg-slate-50 rounded-3xl text-slate-400 font-medium">
                Tuyệt vời! Hệ thống của bạn đã sạch sẽ, không tìm thấy tệp rác nào.
              </div>
            )}
          </div>
        )}
      </div>

      <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100 flex gap-4">
        <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl h-fit">
          <ShieldAlert size={24} />
        </div>
        <div className="space-y-1">
          <h4 className="font-bold text-amber-900">Lưu ý quan trọng</h4>
          <p className="text-sm text-amber-800/70 leading-relaxed">
            Dung lượng thư mục `node_modules` (~240MB) và `dist` (~50MB) là các thành phần kỹ thuật cần thiết để chạy dự án tại máy bộ.
            <strong> Chúng KHÔNG được tải lên GitHub</strong> nên bạn không cần lo lắng về giới hạn dung lượng của GitHub.
          </p>
        </div>
      </div>
    </div>
  );
};

const ComplianceManager: React.FC = () => {
  const { state, updateState, apiBaseUrl } = useApp();
  const [showEditor, setShowEditor] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [editorType, setEditorType] = useState<'terms' | 'privacy'>('terms');
  const [localContent, setLocalContent] = useState('');

  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });

  const openEditor = (type: 'terms' | 'privacy') => {
    setEditorType(type);
    setLocalContent(type === 'terms' ? state.config.termsOfService || '' : state.config.privacyPolicy || '');
    setShowEditor(true);
  };

  const handleSaveContent = () => {
    updateState({
      config: {
        ...state.config,
        [editorType === 'terms' ? 'termsOfService' : 'privacyPolicy']: localContent
      }
    });
    setShowEditor(false);
    toast.success('Cập nhật nội dung thành công!');
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      toast.error('Mật khẩu mới không khớp!');
      return;
    }

    try {
      const res = await fetch(`${apiBaseUrl}/api/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('bm_admin_token') || sessionStorage.getItem('bm_admin_token')}`
        },
        body: JSON.stringify({ currentPassword: passwords.current, newPassword: passwords.new })
      });

      const data = await res.json();
      if (res.ok) {
        toast.success('Đổi mật khẩu thành công!');
        setShowPasswordModal(false);
        setPasswords({ current: '', new: '', confirm: '' });
      } else {
        toast.error(data.error || 'Đổi mật khẩu thất bại');
      }
    } catch (err) {
      toast.error('Không thể kết nối tới máy chủ');
    }
  };

  return (
    <div className="max-w-4xl space-y-10 mb-20">
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900">Bảo mật & Pháp lý</h2>
        <p className="text-slate-500">Quản lý các điều khoản, chính sách bảo mật và cài đặt an toàn hệ thống.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Security Settings Card */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm flex flex-col justify-between border border-slate-100 hover:shadow-md transition">
          <div className="space-y-4">
            <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
              <Lock size={28} />
            </div>
            <h4 className="font-black text-xl text-slate-900">Cài đặt bảo mật</h4>
            <p className="text-sm text-slate-500 leading-relaxed">
              Xác thực 2 lớp (2FA), quản lý phiên đăng nhập và thay đổi mật khẩu quản trị viên định kỳ.
            </p>
          </div>
          <button
            onClick={() => setShowPasswordModal(true)}
            className="w-full mt-8 bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-black transition text-sm"
          >
            Đổi mật khẩu ngay →
          </button>
        </div>

        {/* Data Privacy Card */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm flex flex-col justify-between border border-slate-100 hover:shadow-md transition">
          <div className="space-y-4">
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
              <Shield size={28} />
            </div>
            <h4 className="font-black text-xl text-slate-900">Dữ liệu & Quyền riêng tư</h4>
            <p className="text-sm text-slate-500 leading-relaxed">
              Tuân thủ các quy định về bảo vệ dữ liệu cá nhân (GDPR/ND73). Quản lý cách thông tin học viên được xử lý.
            </p>
          </div>
          <button
            onClick={() => openEditor('privacy')}
            className="w-full mt-8 bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 transition text-sm"
          >
            Cập nhật Chính sách →
          </button>
        </div>

        {/* Terms of Service Card */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm flex flex-col justify-between border border-slate-100 hover:shadow-md transition md:col-span-2">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-6">
              <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shrink-0">
                <FileText size={28} />
              </div>
              <div className="space-y-2">
                <h4 className="font-black text-xl text-slate-900">Điều khoản dịch vụ</h4>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Cập nhật các quy tắc, quy định dành cho học viên và phụ huynh khi tham gia đào tạo tại trung tâm.
                </p>
              </div>
            </div>
            <button
              onClick={() => openEditor('terms')}
              className="md:w-auto w-full bg-slate-100 text-slate-900 font-bold px-8 py-4 rounded-2xl hover:bg-slate-200 transition text-sm shrink-0"
            >
              Chỉnh sửa Điều khoản →
            </button>
          </div>
        </div>
      </div>

      {/* Content Editor Modal */}
      {showEditor && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[3rem] shadow-2xl flex flex-col overflow-hidden">
            <div className="p-8 border-b flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="text-2xl font-black text-slate-900">
                  {editorType === 'terms' ? 'Chỉnh sửa Điều khoản dịch vụ' : 'Chỉnh sửa Chính sách bảo mật'}
                </h3>
                <p className="text-sm text-slate-500 flex items-center gap-1">
                  <Clock size={14} /> Tự động lưu bản nháp vào bộ nhớ tạm
                </p>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    if (window.confirm('Hành động này sẽ thay thế nội dung hiện tại bằng mẫu gợi ý chuyên nghiệp. Bạn có chắc chắn?')) {
                      setLocalContent(editorType === 'terms' ? (INITIAL_CONFIG.termsOfService || '') : (INITIAL_CONFIG.privacyPolicy || ''));
                      toast.info('Đã áp dụng mẫu gợi ý mới!');
                    }
                  }}
                  className="flex items-center gap-2 bg-amber-50 text-amber-600 font-bold px-4 py-2 rounded-xl text-xs hover:bg-amber-100 transition shadow-sm border border-amber-100"
                >
                  <Sparkles size={14} /> Dùng mẫu gợi ý
                </button>
                <button
                  onClick={() => setShowEditor(false)}
                  className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 transition shadow-sm"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8">
              <div className="prose-editor min-h-[400px]">
                <ReactQuill
                  theme="snow"
                  value={localContent}
                  onChange={setLocalContent}
                  modules={quillModules}
                  formats={quillFormats}
                  placeholder="Bắt đầu nhập nội dung pháp lý tại đây..."
                  className="h-[350px] mb-12"
                />
              </div>
            </div>

            <div className="p-8 border-t bg-slate-50 flex gap-4">
              <button
                onClick={() => setShowEditor(false)}
                className="flex-1 py-4 text-slate-500 font-bold hover:bg-white rounded-2xl transition"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleSaveContent}
                className="flex-[2] bg-blue-600 text-white font-black py-4 rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-200 transition flex items-center justify-center gap-2"
              >
                <Save size={20} /> Lưu & Xuất bản ngay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl flex flex-col overflow-hidden">
            <div className="p-8 border-b flex justify-between items-center bg-slate-50">
              <h3 className="text-2xl font-black text-slate-900">Đổi mật khẩu</h3>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 transition shadow-sm"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handlePasswordChange} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Mật khẩu hiện tại</label>
                <input
                  type="password"
                  required
                  className="w-full p-4 bg-slate-50 border-0 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition"
                  value={passwords.current}
                  onChange={e => setPasswords({ ...passwords, current: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Mật khẩu mới</label>
                <input
                  type="password"
                  required
                  className="w-full p-4 bg-slate-50 border-0 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition"
                  value={passwords.new}
                  onChange={e => setPasswords({ ...passwords, new: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Xác nhận mật khẩu mới</label>
                <input
                  type="password"
                  required
                  className="w-full p-4 bg-slate-50 border-0 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition"
                  value={passwords.confirm}
                  onChange={e => setPasswords({ ...passwords, confirm: e.target.value })}
                />
              </div>

              <div className="pt-4 flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 py-4 text-slate-500 font-bold hover:bg-slate-50 rounded-2xl transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-[2] bg-slate-900 text-white font-black py-4 rounded-2xl hover:bg-black shadow-xl shadow-slate-200 transition"
                >
                  Cập nhật
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    [{ 'size': ['small', false, 'large', 'huge'] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'align': [] }],
    ['blockquote', 'code-block'],
    ['link', 'image'],
    ['clean']
  ],
};

const quillFormats = [
  'header', 'size',
  'bold', 'italic', 'underline', 'strike',
  'color', 'background',
  'list', 'bullet', 'align',
  'blockquote', 'code-block',
  'link', 'image'
];

const BlogPostsManager: React.FC = () => {
  const { state, updateState } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [localPost, setLocalPost] = useState<any>({ title: '', summary: '', content: '', image: '', category: 'Sự kiện', date: new Date().toLocaleDateString('vi-VN') });

  const handleEdit = (post: any) => {
    setEditingPost(post);
    setLocalPost(post);
    setShowModal(true);
  };

  const handleCreate = () => {
    setEditingPost(null);
    setLocalPost({ title: '', summary: '', content: '', image: '', category: 'Sự kiện', date: new Date().toLocaleDateString('vi-VN') });
    setShowModal(true);
  };

  const handleDelete = async (post: any) => {
    if (window.confirm('Bạn có chắc muốn xóa bài viết này?')) {
      await deletePhysicalFile(post.image);
      updateState({ blogPosts: state.blogPosts.filter(p => p.id !== post.id) });
      toast.success('Đã xóa bài viết!');
    }
  };

  const handleSave = () => {
    if (editingPost) {
      updateState({ blogPosts: state.blogPosts.map(p => p.id === editingPost.id ? { ...localPost, id: p.id } : p) });
      toast.success('Cập nhật thành công!');
    } else {
      const newPost = { ...localPost, id: Date.now().toString() };
      updateState({ blogPosts: [newPost, ...state.blogPosts] });
      toast.success('Đã tạo bài viết mới!');
    }
    setShowModal(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      const token = localStorage.getItem('bm_admin_token') || sessionStorage.getItem('bm_admin_token');
      const res = await fetch(`${API_BASE_URL}/api/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      if (data.url) setLocalPost({ ...localPost, image: data.url });
    } catch (err) {
      toast.error('Tải ảnh thất bại!');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900">Tin tức & Thư viện</h2>
          <p className="text-slate-500">Quản lý các bài viết tin tức và hình ảnh sự kiện.</p>
        </div>
        <button onClick={handleCreate} className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-blue-100">
          <PlusCircle size={20} /> Tạo bài viết mới
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {state.blogPosts.map(post => (
          <div key={post.id} className="bg-white rounded-[2rem] border overflow-hidden group hover:shadow-xl transition-all">
            <div className="relative h-48">
              <img src={post.image} className="w-full h-full object-cover" alt="" />
              <div className="absolute top-4 right-4 flex gap-2">
                <button onClick={() => handleEdit(post)} className="p-2 bg-white/90 rounded-lg text-blue-600 shadow-sm"><Edit3 size={18} /></button>
                <button onClick={() => handleDelete(post)} className="p-2 bg-white/90 rounded-lg text-red-600 shadow-sm"><Trash2 size={18} /></button>
              </div>
            </div>
            <div className="p-6 space-y-3">
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{post.category}</span>
              <h3 className="font-bold text-lg line-clamp-2">{post.title}</h3>
              <p className="text-sm text-slate-500 line-clamp-2">{post.summary}</p>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col">
            <div className="p-8 border-b flex justify-between items-center bg-slate-50/50">
              <h3 className="text-xl font-black">{editingPost ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới'}</h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-200 rounded-full transition"><X size={20} /></button>
            </div>
            <div className="p-8 overflow-y-auto space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Tiêu đề bài viết</label>
                  <input className="w-full p-4 bg-slate-50 rounded-2xl outline-none" value={localPost.title} onChange={e => setLocalPost({ ...localPost, title: e.target.value })} placeholder="VD: Tuyển dụng giáo viên English..." />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Danh mục</label>
                  <select className="w-full p-4 bg-slate-50 rounded-2xl outline-none" value={localPost.category} onChange={e => setLocalPost({ ...localPost, category: e.target.value })}>
                    <option>Sự kiện</option>
                    <option>Tin tức</option>
                    <option>Tuyển dụng</option>
                    <option>Thư viện</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Tóm tắt ngắn (Summary)</label>
                <textarea className="w-full p-4 bg-slate-50 rounded-2xl outline-none resize-none" rows={2} value={localPost.summary} onChange={e => setLocalPost({ ...localPost, summary: e.target.value })} placeholder="Mô tả ngắn gọn nội dung bài viết..." />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Ảnh đại diện</label>
                <div className="flex gap-4 items-center">
                  <div className="w-32 h-24 bg-slate-100 rounded-2xl overflow-hidden border">
                    {localPost.image ? <img src={localPost.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-300"><ImageIcon size={32} /></div>}
                  </div>
                  <label className="bg-blue-50 text-blue-600 px-6 py-3 rounded-2xl font-bold cursor-pointer hover:bg-blue-100 transition">
                    Tải ảnh lên <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Nội dung chi tiết (Rich Text)</label>
                <div className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 min-h-[400px]">
                  <ReactQuill
                    theme="snow"
                    value={localPost.content}
                    onChange={val => setLocalPost({ ...localPost, content: val })}
                    modules={quillModules}
                    formats={quillFormats}
                    className="bg-white h-[350px]"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-6">
                <button onClick={handleSave} className="bg-blue-600 text-white px-10 py-5 rounded-[2rem] font-black shadow-xl shadow-blue-100 transition transform active:scale-95">
                  Lưu bài viết ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

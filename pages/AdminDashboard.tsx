
import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../constants';
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
  HardDrive
} from 'lucide-react';
const isLocalDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_BASE_URL = isLocalDev ? 'http://localhost:5001' : '';

const deletePhysicalFile = async (url?: string) => {
  if (!url) return;
  // Handle both local development uploads and Cloudinary production uploads
  const isLocal = url.includes('localhost:5001/uploads') || url.includes('localhost:5001/pdfs');
  const isCloud = url.includes('cloudinary.com');

  if (!isLocal && !isCloud) return;

  try {
    await fetch(`${API_BASE_URL}/api/delete-file`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });
  } catch (err) {
    console.error('Failed to delete physical file:', err);
  }
};

const SidebarLink: React.FC<{ to: string, icon: React.ReactNode, label: string, active: boolean }> = ({ to, icon, label, active }) => (
  <Link
    to={to}
    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition font-medium ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-500 hover:bg-blue-50 hover:text-blue-600'}`}
  >
    {icon} <span>{label}</span>
  </Link>
);

const AdminDashboard: React.FC = () => {
  const { state, updateState } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    updateState({ isAuthenticated: false });
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-200 p-6 flex flex-col fixed h-full z-20">
        <div className="flex items-center space-x-3 mb-10 px-2">
          <div className={state.config.brandLogoImage ? "" : "bg-blue-600 p-2 rounded-lg font-bold text-white"}>
            {state.config.brandLogoImage ? (
              <img src={getAssetPath(state.config.brandLogoImage)} className="w-14 h-14 object-contain" alt="Logo" />
            ) : (
              state.config.brandShortName
            )}
          </div>
          <span className="font-extrabold text-lg text-slate-900 tracking-tight">{state.config.brandNamePrincipal} Admin</span>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto pr-2">
          <SidebarLink to="/admin" icon={<LayoutDashboard size={20} />} label="Tổng quan" active={location.pathname === '/admin'} />
          <SidebarLink to="/admin/content" icon={<Edit3 size={20} />} label="Quản trị giao diện" active={location.pathname === '/admin/content'} />
          <SidebarLink to="/admin/courses" icon={<BookOpen size={20} />} label="Khóa học" active={location.pathname === '/admin/courses'} />
          <SidebarLink to="/admin/teachers" icon={<UsersIcon size={20} />} label="Giảng viên" active={location.pathname === '/admin/teachers'} />
          <SidebarLink to="/admin/documents" icon={<FileText size={20} />} label="Văn bản công khai" active={location.pathname === '/admin/documents'} />
          <SidebarLink to="/admin/system" icon={<HardDrive size={20} />} label="Tối ưu hệ thống" active={location.pathname === '/admin/system'} />
          <SidebarLink to="/admin/leads" icon={<MessageSquare size={20} />} label="Yêu cầu tư vấn" active={location.pathname === '/admin/leads'} />
          <SidebarLink to="/admin/seo" icon={<Search size={20} />} label="Quản trị SEO" active={location.pathname === '/admin/seo'} />
          <SidebarLink to="/admin/compliance" icon={<ShieldAlert size={20} />} label="Bảo mật & Pháp lý" active={location.pathname === '/admin/compliance'} />
        </nav>

        <SidebarLink to="/" icon={<Home size={20} />} label="Trang chủ" active={false} />

        <button
          onClick={handleLogout}
          className="mt-6 flex items-center space-x-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition font-bold"
        >
          <LogOut size={20} /> <span>Đăng xuất</span>
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-72 p-10">
        <Routes>
          <Route index element={<Overview state={state} />} />
          <Route path="content" element={<ContentManager />} />
          <Route path="courses" element={<CoursesManager />} />
          <Route path="leads" element={<LeadsManager />} />
          <Route path="seo" element={<SeoManager />} />
          <Route path="teachers" element={<TeachersManager />} />
          <Route path="documents" element={<DocumentsManager />} />
          <Route path="system" element={<SystemOptimizer />} />
          <Route path="compliance" element={<ComplianceManager />} />
        </Routes>
      </main>
    </div>
  );
};

// --- Sub-pages ---

const Overview: React.FC<{ state: any }> = ({ state }) => (
  <div className="space-y-10">
    <div>
      <h2 className="text-3xl font-extrabold text-slate-900">Tổng quan hệ thống</h2>
      <p className="text-slate-500">Chào mừng trở lại, Admin.</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <StatCard label="Khóa học" value={state.courses.length} color="blue" />
      <StatCard label="Giảng viên" value={state.teachers.length} color="indigo" />
      <StatCard label="Yêu cầu tư vấn" value={state.messages.length} color="orange" />
      <StatCard label="Khách hôm nay" value="128" color="green" />
    </div>
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
      <h3 className="font-bold text-lg mb-4">Hoạt động gần đây</h3>
      <div className="space-y-4">
        {state.messages.slice(0, 3).map((m: any) => (
          <div key={m.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-xl">
            <div>
              <p className="font-bold text-slate-800">{m.name}</p>
              <p className="text-xs text-slate-500">Gửi yêu cầu lúc {m.timestamp}</p>
            </div>
            <span className="text-blue-600 font-bold text-xs uppercase tracking-widest">Mới</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const StatCard: React.FC<{ label: string, value: any, color: string }> = ({ label, value, color }) => (
  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-2">
    <p className="text-slate-500 text-sm font-medium">{label}</p>
    <p className={`text-4xl font-black text - ${color}-600`}>{value}</p>
  </div>
);

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

      const res = await fetch(`${API_BASE_URL}/api/upload`, {
        method: 'POST',
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
      const res = await fetch(`${API_BASE_URL}/api/delete-file`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
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
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-extrabold">Cập nhật giao diện</h2>
        <button onClick={save} className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2">
          <Save size={18} /> Lưu thay đổi
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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

      const res = await fetch(`${API_BASE_URL}/api/upload`, {
        method: 'POST',
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
          <p className="text-green-700 text-sm">https://binhminh-tayninh.edu.vn</p>
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
    zalo: ''
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

      const res = await fetch(`${API_BASE_URL}/api/upload`, {
        method: 'POST',
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
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Số điện thoại</label>
                  <input
                    className="w-full p-5 bg-slate-50 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none transition font-bold text-slate-700"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Ví dụ: 090xxx"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email liên hệ</label>
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
const DocumentsManager = () => {
  const { state, updateState } = useApp();
  const [isUploading, setIsUploading] = useState(false);
  const [newDocLabel, setNewDocLabel] = useState('');

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
      const response = await fetch(`${API_BASE_URL}/api/upload-pdf`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const { url } = await response.json();
        const newDoc: PublicDocument = {
          id: Date.now().toString(),
          name: file.name,
          label: newDocLabel.trim() || file.name,
          type: 'PDF',
          uploadDate: new Date().toLocaleDateString('vi-VN'),
          url
        };
        updateState({ publicDocuments: [...state.publicDocuments, newDoc] });
        setNewDocLabel('');
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
      const response = await fetch(`${API_BASE_URL}/api/delete-file`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: doc.url })
      });

      if (response.ok) {
        updateState({
          publicDocuments: state.publicDocuments.filter(d => d.id !== doc.id)
        });
        toast.success('Đã xóa tài liệu');
      } else {
        toast.error('Lỗi khi xóa tài liệu');
      }
    } catch (error) {
      toast.error('Không thể kết nối đến server');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
        <div className="flex-1">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Văn bản Công khai</h2>
          <p className="text-slate-500 font-medium mt-1">Quản lý các tài liệu PDF công khai của trung tâm</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <input
            type="text"
            placeholder="Nhãn văn bản (VD: Quyết định thành lập...)"
            className="px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none transition font-bold text-slate-700 min-w-[300px]"
            value={newDocLabel}
            onChange={(e) => setNewDocLabel(e.target.value)}
          />
          <label className="flex items-center justify-center gap-2 cursor-pointer bg-blue-600 text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition transform hover:-translate-y-1 active:scale-95 whitespace-nowrap">
            {isUploading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Upload size={20} />}
            <span>Tải lên PDF</span>
            <input type="file" className="hidden" accept=".pdf" onChange={handleUpload} disabled={isUploading} />
          </label>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">Tên tài liệu</th>
              <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">Loại</th>
              <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">Ngày đăng</th>
              <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {state.publicDocuments.length > 0 ? (
              state.publicDocuments.map(doc => (
                <tr key={doc.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-red-50 text-red-500 rounded-xl group-hover:scale-110 transition-transform flex-shrink-0">
                        <FileText size={20} />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-extrabold text-slate-900 text-lg leading-tight mb-1">{doc.label || doc.name}</span>
                        <span className="text-xs font-medium text-slate-400 font-mono truncate max-w-[200px]">{doc.name}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold uppercase">{doc.type}</span>
                  </td>
                  <td className="px-8 py-6 text-slate-500 font-medium">{doc.uploadDate}</td>
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
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-8 py-20 text-center">
                  <div className="flex flex-col items-center justify-center space-y-4 opacity-30">
                    <FileText size={48} />
                    <p className="font-black text-xl">Chưa có tài liệu nào</p>
                  </div>
                </td>
              </tr>
            )}
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
      const res = await fetch(`${API_BASE_URL}/api/garbage-collector`);
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
      const res = await fetch(`${API_BASE_URL}/api/garbage-collector?action=delete`);
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
  return (
    <div className="max-w-3xl space-y-10">
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900">Bảo mật & Pháp lý</h2>
        <p className="text-slate-500">Quản lý các điều khoản và chính sách bảo mật.</p>
      </div>

      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm space-y-6">
        <div className="p-6 bg-slate-50 rounded-2xl space-y-2">
          <h4 className="font-bold text-slate-800">Cài đặt bảo mật</h4>
          <p className="text-sm text-slate-500">Xác thực 2 lớp, quản lý phiên đăng nhập và các quyền truy cập hệ thống.</p>
          <button className="text-blue-600 text-sm font-bold mt-2">Thiết lập ngay →</button>
        </div>

        <div className="p-6 bg-slate-50 rounded-2xl space-y-2">
          <h4 className="font-bold text-slate-800">Điều khoản dịch vụ</h4>
          <p className="text-sm text-slate-500">Cập nhật nội dung hiển thị trong trang Chính sách của trung tâm.</p>
          <button className="text-blue-600 text-sm font-bold mt-2">Cập nhật nội dung →</button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

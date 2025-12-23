
import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../constants';
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
  Send
} from 'lucide-react';

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
          <div className="bg-blue-600 p-2 rounded-lg font-bold text-white">BM</div>
          <span className="font-extrabold text-lg text-slate-900 tracking-tight">Admin Console</span>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto pr-2">
          <SidebarLink to="/admin" icon={<LayoutDashboard size={20} />} label="Tổng quan" active={location.pathname === '/admin'} />
          <SidebarLink to="/admin/content" icon={<Edit3 size={20} />} label="Quản trị giao diện" active={location.pathname === '/admin/content'} />
          <SidebarLink to="/admin/courses" icon={<BookOpen size={20} />} label="Khóa học" active={location.pathname === '/admin/courses'} />
          <SidebarLink to="/admin/teachers" icon={<UsersIcon size={20} />} label="Giảng viên" active={location.pathname === '/admin/teachers'} />
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
    <p className={`text-4xl font-black text-${color}-600`}>{value}</p>
  </div>
);

const ContentManager: React.FC = () => {
  const { state, updateState } = useApp();
  const [localConfig, setLocalConfig] = useState(state.config);

  const save = () => {
    updateState({ config: localConfig });
    alert("Cập nhật thành công!");
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
              <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Khách hàng</th>
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
                  <p className="font-bold text-slate-800 text-lg">{m.name}</p>
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
                  <button
                    onClick={() => setReplyLead(m)}
                    className="bg-blue-50 text-blue-600 px-6 py-2.5 rounded-xl text-xs font-black hover:bg-blue-600 hover:text-white transition transform active:scale-95 shadow-sm"
                  >
                    Phản hồi Email
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {state.messages.length === 0 && (
          <div className="p-32 text-center space-y-4">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
              <MessageSquare size={40} />
            </div>
            <p className="text-slate-400 font-bold text-lg">Chưa có yêu cầu nào được gửi đến.</p>
          </div>
        )}
      </div>

      {replyLead && (
        <EmailReplyModal
          lead={replyLead}
          onClose={() => setReplyLead(null)}
        />
      )}
    </div>
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

  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa khóa học này?')) {
      const newCourses = state.courses.filter(c => c.id !== id);
      updateState({ courses: newCourses });
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
                  onClick={() => handleDelete(c.id)}
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

  const handleImageFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, image: reader.result as string });
    };
    reader.readAsDataURL(file);
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
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition ${imageTab === 'upload' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                  >
                    <Upload size={16} /> Tải lên / Paste
                  </button>
                  <button
                    onClick={() => setImageTab('url')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition ${imageTab === 'url' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
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
            alert("SEO updated!");
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
  const { state } = useApp();
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900">Quản lý giảng viên</h2>
          <p className="text-slate-500">Danh sách đội ngũ giáo viên của trung tâm.</p>
        </div>
        <button className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold transition transform active:scale-95 shadow-xl shadow-indigo-100">
          + Thêm giảng viên
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {state.teachers.map((t: any) => (
          <div key={t.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
            <div className="w-20 h-20 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <UsersIcon size={32} />
            </div>
            <div>
              <p className="font-bold text-lg text-slate-900">{t.name}</p>
              <p className="text-sm text-slate-500">{t.role}</p>
            </div>
            <div className="pt-4 border-t flex gap-2">
              <button className="text-xs font-bold text-indigo-600 hover:underline">Chỉnh sửa</button>
              <button className="text-xs font-bold text-red-500 hover:underline">Xóa</button>
            </div>
          </div>
        ))}
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

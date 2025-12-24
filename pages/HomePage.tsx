
import React, { useState } from 'react';
import { useApp } from '../constants';
import { getAssetPath } from '../utils';
import {
  ArrowRight,
  Video,
  Target,
  History,
  Trophy,
  CheckCircle,
  Users,
  Clock,
  DollarSign,
  MessageSquare,
  Send,
  BookOpen,
  GraduationCap,
  Star,
  Sparkles,
  Zap,
  Circle,
  FileText,
  Globe,
  ExternalLink,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  Mail,
  Phone as PhoneIcon
} from 'lucide-react';

import { toast } from 'react-toastify';

const HomePage: React.FC = () => {
  const { state, addMessage } = useApp();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [docSearchQuery, setDocSearchQuery] = useState('');
  const [docCurrentPage, setDocCurrentPage] = useState(1);
  const docsPerPage = 5;
  const [currentTestiPage, setCurrentTestiPage] = useState(0);
  const [selectedPost, setSelectedPost] = useState(null);
  const testiItemsPerPage = 2;
  const testimonialsList = (state.testimonials && state.testimonials.length > 0 ? state.testimonials : INITIAL_TESTIMONIALS).sort((a, b) => (a.order || 0) - (b.order || 0));
  const testiTotalPages = Math.ceil(testimonialsList.length / testiItemsPerPage);

  React.useEffect(() => {
    if (testiTotalPages <= 1) return;
    const timer = setInterval(() => {
      setCurrentTestiPage((prev) => (prev + 1) % testiTotalPages);
    }, 5000);
    return () => clearInterval(timer);
  }, [testiTotalPages]);

  const currentTestimonials = testimonialsList.slice(
    currentTestiPage * testiItemsPerPage,
    (currentTestiPage + 1) * testiItemsPerPage
  );

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMessage(formData);
    setSubmitted(true);
    toast.success('Cảm ơn bạn! Thông tin đã được gửi. Chúng tôi sẽ liên hệ lại sớm.');
    setFormData({ name: '', email: '', phone: '', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main className="overflow-x-hidden pt-24">
      {/* Blog Detail Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={() => setSelectedPost(null)} />
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
            <div className="relative h-64 md:h-80 shrink-0">
              <img src={selectedPost.image} className="w-full h-full object-cover" alt={selectedPost.title} />
              <button
                onClick={() => setSelectedPost(null)}
                className="absolute top-6 right-6 p-3 bg-white/20 backdrop-blur-md text-white hover:bg-white hover:text-slate-900 rounded-full transition-all shadow-lg"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-8 md:p-12 overflow-y-auto">
              <div className="flex items-center gap-4 mb-6 text-sm text-slate-500 font-bold uppercase tracking-widest">
                <span className="text-blue-600 font-black">{selectedPost.category}</span>
                <span>•</span>
                <span>{selectedPost.date}</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-8 leading-tight">{selectedPost.title}</h2>
              <div className="prose prose-lg max-w-none text-slate-600 leading-relaxed font-medium" dangerouslySetInnerHTML={{ __html: selectedPost.content }} />
            </div>
          </div>
        </div>
      )}
      {/* Hero Section */}
      <section className="relative pt-12 md:pt-20 pb-16 md:pb-24 px-4 md:px-6">
        <div className="max-w-7xl mx-auto w-full relative">
          <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 rounded-[3.5rem] p-10 py-24 md:py-32 overflow-hidden relative shadow-2xl 
          shadow-blue-900/40 min-h-[500px] flex flex-col justify-center">
            {/* Decorative circles - Moved to background */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-[100px] pointer-events-none z-0"></div>
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-900/20 rounded-full blur-[100px] pointer-events-none z-0"></div>

            {/* Bubble Effect */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[3.5rem] z-0">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="bubble opacity-20"
                  style={{
                    left: `${(i * 15) % 100}%`,
                    width: `${20 + (i % 3) * 30}px`,
                    height: `${20 + (i % 3) * 30}px`,
                    animationDelay: `${i * 1.5}s`,
                    animationDuration: `${8 + i}s`,
                    bottom: '-100px'
                  }}
                />
              ))}
            </div>

            {/* Decorative Particles */}
            <div className="absolute top-10 left-10 animate-bounce delay-700 opacity-60 hidden md:block z-10">
              <Star className="text-yellow-300 w-8 h-8" fill="currentColor" />
            </div>
            <div className="absolute bottom-16 left-1/3 animate-pulse delay-300 opacity-50 hidden md:block z-10">
              <Sparkles className="text-white w-10 h-10" />
            </div>
            <div className="absolute top-1/4 right-[30%] animate-spin-slow opacity-30 hidden md:block z-10">
              <Zap className="text-pink-300 w-10 h-10" fill="currentColor" />
            </div>

            {/* 3D Floating Icons - ENLARGED and REFINED CLARITY */}
            <div className="absolute top-[80%] md:top-[35%] -translate-y-1/2 -right-8 md:right-1 w-[280px] h-[280px] md:w-[600px] md:h-[600px] animate-float opacity-100 block select-none z-50 pointer-events-none uppercase">
              <img src={getAssetPath("/assets/3d/book.png")} className="w-full h-full object-contain" alt="3D Book" />
            </div>

            <div className="absolute top-12 right-1/4 w-28 h-28 md:w-44 md:h-44 animate-float-delayed opacity-100 hidden md:block select-none z-50">
              <img src={getAssetPath("/assets/3d/laptop.png")} className="w-full h-full object-contain" alt="3D Laptop" />
            </div>

            <div className="absolute bottom-12 right-[52%] w-39 h-39 md:w-36 md:h-36 animate-float-slow opacity-100 hidden md:block select-none z-50">
              <img src={getAssetPath("/assets/3d/cap.png")} className="w-full h-full object-contain" alt="3D Graduation Cap" />
            </div>

            <div className="absolute top-12 right-[58%] w-16 h-16 md:w-44 md:h-44 animate-float-delayed opacity-100 hidden md:block select-none z-50">
              <img src={getAssetPath("/assets/3d/crown.png")} className="w-full h-full object-contain" alt="crown" />
            </div>

            <div className="relative z-50 max-w-2xl space-y-6 text-center lg:text-left">
              <div className="inline-block bg-white/20 backdrop-blur-md text-white px-5 py-2 rounded-full text-xs md:text-sm font-bold border border-white/30 tracking-tight">
                ✨ KHAI PHÁ TIỀM NĂNG CÙNG BÌNH MINH
              </div>
              <h1 className="text-4xl md:text-7xl font-black text-white leading-[1.15] tracking-tight">
                {state.config.heroTitle.split(' ').slice(0, 2).join(' ')} <br />
                <span className="text-blue-100">{state.config.heroTitle.split(' ').slice(2).join(' ')}</span>
              </h1>
              <p className="text-base md:text-lg text-blue-50 font-medium max-w-lg leading-relaxed opacity-90 mx-auto lg:mx-0">
                {state.config.heroSubtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start">
                <button
                  onClick={() => scrollToSection('courses')}
                  className="bg-gradient-to-r from-orange-400 to-rose-500 text-white px-8 py-4 rounded-2xl font-black text-base flex items-center justify-center gap-3 hover:scale-105 transition transform shadow-2xl shadow-orange-500/30 active:scale-95"
                >
                  Bắt đầu ngay <ArrowRight size={20} strokeWidth={3} />
                </button>
                <button
                  onClick={() => setShowVideoModal(true)}
                  className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-2xl font-black text-base flex items-center justify-center gap-3 hover:bg-white/20 transition transform hover:-translate-y-1"
                >
                  <Video size={20} /> Khám phá
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats / Highlights - Compact */}
      <section className="relative z-40 mt-12 md:mt-20 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'NĂM KINH NGHIỆM', value: state.config.statsYears || '10+', color: 'bg-rose-50', iconColor: 'bg-rose-500', icon: <BookOpen className="text-white" size={20} />, textColor: 'text-rose-600' },
            { label: 'GIẢNG VIÊN GIỎI', value: state.config.statsTeachers || '50+', color: 'bg-indigo-50', iconColor: 'bg-indigo-500', icon: <Users className="text-white" size={20} />, textColor: 'text-indigo-600' },
            { label: 'KHÓA HỌC', value: state.config.statsCourses || '20+', color: 'bg-cyan-50', iconColor: 'bg-cyan-500', icon: <GraduationCap className="text-white" size={20} />, textColor: 'text-cyan-600' },
            { label: 'HÀI LÒNG', value: state.config.statsSatisfaction || '98%', color: 'bg-amber-50', iconColor: 'bg-amber-500', icon: <Trophy className="text-white" size={20} />, textColor: 'text-amber-600' },
          ].map((stat, i) => (
            <div key={i} className={`${stat.color} p-5 rounded-[2rem] shadow-lg shadow-slate-200/50 flex flex-col items-center text-center space-y-3 transform hover:-translate-y-1 transition-all duration-300 border border-white/80`}>
              <div className={`${stat.iconColor} w-12 h-12 rounded-full flex items-center justify-center shadow-md`}>
                {stat.icon}
              </div>
              <div>
                <div className={`text-3xl font-black ${stat.textColor} tracking-tight`}>{stat.value}</div>
                <div className="text-slate-500 text-[10px] font-black tracking-widest uppercase">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mission & Vision */}
      <section id="about" className="py-16 px-6 bg-slate-50/50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-10 md:p-16 rounded-[3rem] shadow-sm flex flex-col justify-center space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -mr-32 -mt-32"></div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight relative z-10">{state.config.aboutTitle || 'Về chúng tôi'}</h2>
            <p className="text-slate-600 text-lg leading-relaxed relative z-10 font-medium">{state.config.aboutText}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 relative z-10">
              <div className="space-y-4 p-6 bg-slate-50 rounded-3xl">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                  <Target size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 uppercase tracking-wider">Tầm Nhìn</h3>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">{state.config.vision}</p>
              </div>
              <div className="space-y-4 p-6 bg-slate-50 rounded-3xl">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                  <History size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 uppercase tracking-wider">Sứ Mệnh</h3>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">{state.config.mission}</p>
              </div>
            </div>
          </div>
          <div className="bg-blue-600 p-10 md:p-16 rounded-[3rem] text-white flex flex-col justify-between overflow-hidden relative shadow-2xl shadow-blue-900/30">
            <div className="relative z-10">
              <div className="w-24 h-24 mb-6">
                <img src={getAssetPath("/assets/3d/trophy.png")} className="w-full h-full object-contain animate-float-delayed" alt="3D Trophy" />
              </div>
              <h3 className="text-3xl font-black mb-8 leading-tight">Thành Tích <br />Nổi Bật</h3>
              <ul className="space-y-6">
                {[...(state.achievements || [])].sort((a, b) => (a.order || 0) - (b.order || 0)).map((a, i) => (
                  <li key={i} className="flex gap-4 group">
                    <span className="font-black text-blue-200 text-lg">{a.year}</span>
                    <div>
                      <p className="font-bold text-lg group-hover:text-blue-200 transition-colors">{a.title}</p>
                      <p className="text-sm text-blue-100/80 mt-1 leading-relaxed">{a.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="absolute -bottom-10 -right-10 opacity-10">
              <Trophy size={300} />
            </div>
          </div>
        </div>
      </section>

      {/* Courses */}
      <section id="courses" className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-6">
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight">Lộ Trình Học Tập <span className="text-blue-600">Toàn Diện</span></h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg font-medium">Các khóa học được thiết kế chuyên biệt, bám sát nhu cầu thực tế của từng độ tuổi và mục tiêu học tập.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {state.courses.map(course => (
              <div
                key={course.id}
                className="group bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 hover:shadow-[0_20px_50px_rgba(37,99,235,0.15)] transition duration-500 hover:-translate-y-3 cursor-pointer"
                onClick={() => setSelectedCourse(course)}
              >
                <div className="h-64 relative overflow-hidden">
                  <img src={getAssetPath(course.image)} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" alt={course.title} />
                  <div className="absolute top-6 left-6 bg-white px-4 py-1.5 rounded-2xl text-[10px] font-black text-blue-600 uppercase tracking-widest shadow-lg">
                    {course.category}
                  </div>
                </div>
                <div className="p-10 space-y-5">
                  <h3 className="text-2xl font-black text-slate-900 group-hover:text-blue-600 transition tracking-tight">{course.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed font-medium line-clamp-2">{course.description}</p>
                  <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                    <div className="flex items-center gap-3 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                      <Clock size={16} className="text-blue-600" /> <span>{course.duration}</span>
                    </div>
                    <div className="bg-blue-50 text-blue-600 px-4 py-1 rounded-xl font-black text-lg">{course.price}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Course Detail Modal */}
      {selectedCourse && (
        <CourseDetailModal
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
        />
      )}

      {/* Teachers */}
      <section id="teachers" className="py-16 px-6 bg-slate-50/30">
        <div className="max-w-7xl mx-auto text-center space-y-16">
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight">Đội Ngũ <span className="text-blue-600">Giảng Viên</span></h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {state.teachers.map(t => (
              <div key={t.id} className="group flex flex-col items-center">
                <div className="w-56 h-56 rounded-[3rem] overflow-hidden border-8 border-white shadow-2xl mb-8 transform group-hover:scale-105 group-hover:rotate-3 transition duration-500 bg-indigo-50">
                  <img
                    src={getAssetPath(t.image || (t.gender === 'female' ? '/assets/3d/women.png' : '/assets/3d/men.png'))}
                    className="w-full h-full object-cover"
                    alt={t.name}
                  />
                </div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">{t.name}</h3>
                <p className="text-blue-600 text-sm font-black mb-4 uppercase tracking-widest">{t.role}</p>
                <div className="flex flex-col items-center gap-3 mb-6">
                  {t.showPhone && t.phone && (
                    <div className="flex items-center gap-3 group/phone">
                      <div className="flex gap-1.5">
                        <a
                          href={`tel:${t.phone}`}
                          title="Gọi điện"
                          className="w-10 h-10 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center hover:bg-orange-600 hover:text-white transition-all shadow-sm border border-orange-100"
                        >
                          <PhoneIcon size={18} />
                        </a>
                        <a
                          href={`https://zalo.me/${t.zalo || t.phone}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center hover:scale-110 transition-all shadow-sm border border-blue-100"
                          title="Chat Zalo"
                        >
                          <img src="/images/zalo.png" className="w-6 h-6 object-contain" alt="Zalo" />
                        </a>
                      </div>
                      <span className="text-slate-700 text-lg font-bold tracking-tight">{t.phone}</span>
                    </div>
                  )}
                  {t.showEmail && t.email && (
                    <div className="flex items-center gap-3 group/email">
                      <a
                        href={`mailto:${t.email}`}
                        title="Gửi Email"
                        className="w-10 h-10 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all shadow-sm border border-rose-100"
                      >
                        <Mail size={18} />
                      </a>
                      <span className="text-slate-700 text-lg font-bold tracking-tight truncate max-w-[200px]">{t.email}</span>
                    </div>
                  )}
                </div>
                <p className="text-slate-500 text-sm italic font-medium max-w-[200px] leading-relaxed line-clamp-2">{t.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* News / Blog Section - Horizontal Scroll */}
      <section id="news" className="py-16 px-6 bg-slate-50/50 overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div className="space-y-4">
              <span className="bg-blue-600/10 text-blue-600 px-6 py-2 rounded-full text-xs font-black tracking-widest uppercase inline-block">Tin mới nhất</span>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Tin tức & Thư viện</h2>
            </div>
          </div>

          <div className="relative group">
            <div className="flex overflow-x-auto gap-8 pb-8 no-scrollbar scroll-smooth snap-x">
              {state.blogPosts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => setSelectedPost(post)}
                  className="min-w-[300px] md:min-w-[400px] snap-start bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 hover:shadow-2xl transition-all duration-500 cursor-pointer group/card"
                >
                  <div className="relative h-60 overflow-hidden">
                    <img src={post.image} className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-700" alt={post.title} />
                    <div className="absolute top-4 left-4">
                      <span className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-8 space-y-4">
                    <div className="text-slate-400 text-xs font-black tracking-tight">{post.date}</div>
                    <h3 className="text-xl font-black text-slate-900 group-hover/card:text-blue-600 transition-colors line-clamp-2 leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 font-medium">
                      {post.summary}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-[#4a0d0d] relative overflow-hidden">
        {/* Snow/Bubble Effect */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white/20 rounded-full blur-sm animate-snow"
              style={{
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 6 + 2}px`,
                height: `${Math.random() * 6 + 2}px`,
                animationDuration: `${Math.random() * 10 + 5}s`,
                animationDelay: `${Math.random() * 5}s`,
                opacity: Math.random() * 0.4 + 0.1
              }}
            />
          ))}
        </div>

        {/* Glow Blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-white/10 rounded-full blur-[150px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="mb-10 border-b border-white/10 pb-6">
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-[0.1em] uppercase">
              Phụ huynh học sinh nói về chúng tôi
            </h2>
          </div>

          <div className="relative group/carousel">
            {/* Arrows */}
            <button
              onClick={() => setCurrentTestiPage((prev) => (prev - 1 + testiTotalPages) % testiTotalPages)}
              className="absolute left-[-40px] md:left-[-80px] top-1/2 -translate-y-1/2 w-14 h-14 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-all z-20 hidden md:flex opacity-0 group-hover/carousel:opacity-100"
            >
              <ChevronLeft size={32} strokeWidth={1} />
            </button>
            <button
              onClick={() => setCurrentTestiPage((prev) => (prev + 1) % testiTotalPages)}
              className="absolute right-[-40px] md:right-[-80px] top-1/2 -translate-y-1/2 w-14 h-14 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-all z-20 hidden md:flex opacity-0 group-hover/carousel:opacity-100"
            >
              <ChevronRight size={32} strokeWidth={1} />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 transition-all duration-500 min-h-[300px]">
              {currentTestimonials.map((t) => (
                <div key={t.id} className="flex flex-col md:flex-row gap-8 items-start group animate-in fade-in slide-in-from-right-8 duration-500">
                  <div className="w-32 h-32 md:w-36 md:h-36 shrink-0 rounded-full overflow-hidden border-4 border-white/10 shadow-2xl group-hover:scale-105 transition-transform duration-500">
                    <img src={getAssetPath(t.image || (t.role === 'PHHS' ? '/assets/3d/women.png' : '/assets/3d/cap.png'))} className="w-full h-full object-cover" alt={t.name} />
                  </div>
                  <div className="space-y-4">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} className={i < t.rating ? "fill-orange-400 text-orange-400" : "text-white/20"} />
                      ))}
                    </div>
                    <p className="text-white/90 text-base md:text-lg font-medium leading-relaxed italic">
                      "{t.content}"
                    </p>
                    <div className="pt-2">
                      <span className="text-white font-black text-lg md:text-xl tracking-tight uppercase">{t.name}</span>
                      <span className="text-white/40 font-black text-xs md:text-sm uppercase tracking-widest ml-3">/ {t.role}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Dots */}
            <div className="flex justify-center gap-3 mt-16">
              {[...Array(testiTotalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentTestiPage(i)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${currentTestiPage === i ? 'bg-white scale-125' : 'bg-white/20 hover:bg-white/40'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Public Documents Section */}
      <section id="documents" className="py-16 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-10">
            <span className="bg-blue-50 text-blue-600 px-6 py-2 rounded-full text-sm font-black tracking-widest uppercase mb-4 inline-block">Niêm yết</span>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight">Văn bản Công khai</h2>
            <div className="w-24 h-2 bg-blue-600 mx-auto mt-6 rounded-full"></div>
          </div>


          <div className="bg-white rounded-[3rem] shadow-2xl shadow-blue-900/10 border border-slate-100 overflow-hidden">
            {/* Desktop Table: Hidden on Mobile */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-100">
                    <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-widest w-2/3">
                      <div className="flex items-center justify-between gap-4">
                        <span>Thông tin văn bản</span>
                        <div className="relative w-64 group font-sans">
                          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={14} />
                          <input
                            type="text"
                            placeholder="Tìm nhanh..."
                            className="w-full bg-white/50 border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-xs font-bold text-slate-900 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 outline-none transition-all"
                            value={docSearchQuery}
                            onChange={(e) => {
                              setDocSearchQuery(e.target.value);
                              setDocCurrentPage(1);
                            }}
                          />
                        </div>
                      </div>
                    </th>
                    <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Ngày ban hành</th>
                    <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Tùy chọn</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {(() => {
                    const filtered = (state.publicDocuments || []).filter(doc =>
                      (doc.label || doc.name).toLowerCase().includes(docSearchQuery.toLowerCase())
                    ).sort((a, b) => (a.order || 0) - (b.order || 0));
                    const startIndex = (docCurrentPage - 1) * docsPerPage;
                    const paginated = filtered.slice(startIndex, startIndex + docsPerPage);

                    if (paginated.length > 0) {
                      return paginated.map(doc => (
                        <tr key={doc.id} className="group hover:bg-blue-50/40 transition-all duration-300">
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-5">
                              <div className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center shadow-sm group-hover:bg-red-500 group-hover:text-white transition-all duration-500 flex-shrink-0">
                                <FileText size={20} />
                              </div>
                              <div className="flex flex-col min-w-0">
                                <span className="font-bold text-slate-900 text-lg tracking-tight leading-tight group-hover:text-blue-600 transition-colors truncate">
                                  {doc.label || doc.name}
                                </span>
                                <div className="flex items-center gap-3 mt-1 underline-offset-4">
                                  <span className="text-[10px] font-bold text-slate-400 font-mono italic">
                                    #{doc.name.split('_')[0]}
                                  </span>
                                  <span className="text-[10px] font-bold text-blue-500 flex items-center gap-1">
                                    <Globe size={10} /> Công khai
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6 text-center">
                            <span className="text-slate-500 font-bold text-sm">{doc.uploadDate}</span>
                          </td>
                          <td className="px-8 py-6 text-right">
                            <a
                              href={getAssetPath(doc.url)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 bg-white border-2 border-slate-900 text-slate-900 px-5 py-2.5 rounded-xl font-black text-xs hover:bg-slate-900 hover:text-white transition-all shadow-sm hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                            >
                              <ExternalLink size={14} />
                              <span>XEM NGAY</span>
                            </a>
                          </td>
                        </tr>
                      ));
                    }
                    return (
                      <tr>
                        <td colSpan={3} className="px-8 py-20 text-center text-slate-400 font-bold">
                          <div className="flex flex-col items-center gap-4 opacity-20">
                            <FileText size={48} />
                            <p className="text-xl">Không tìm thấy tài liệu</p>
                          </div>
                        </td>
                      </tr>
                    );
                  })()}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards: Show on small screens */}
            <div className="lg:hidden p-6 space-y-6">
              {(() => {
                const filtered = (state.publicDocuments || []).filter(doc =>
                  (doc.label || doc.name).toLowerCase().includes(docSearchQuery.toLowerCase())
                ).sort((a, b) => (a.order || 0) - (b.order || 0));
                const startIndex = (docCurrentPage - 1) * docsPerPage;
                const paginated = filtered.slice(startIndex, startIndex + docsPerPage);

                if (paginated.length > 0) {
                  return paginated.map(doc => (
                    <div key={doc.id} className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 bg-red-500 text-white rounded-lg flex items-center justify-center shadow-md flex-shrink-0">
                          <FileText size={18} />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <h4 className="font-bold text-slate-900 truncate text-sm">{doc.label || doc.name}</h4>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{doc.uploadDate}</span>
                        </div>
                      </div>
                      <a
                        href={getAssetPath(doc.url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-slate-900 text-white p-2.5 rounded-lg shadow-lg flex-shrink-0 hover:bg-blue-600 transition-colors"
                      >
                        <ExternalLink size={14} />
                      </a>
                    </div>
                  ));
                }
                return (
                  <div className="py-20 text-center text-slate-400 font-bold opacity-20">
                    <FileText size={48} className="mx-auto mb-4" />
                    <p>Không thấy văn bản</p>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Pagination Controls */}
          {(() => {
            const filtered = (state.publicDocuments || []).filter(doc =>
              (doc.label || doc.name).toLowerCase().includes(docSearchQuery.toLowerCase())
            );
            const totalPages = Math.ceil(filtered.length / docsPerPage);
            if (totalPages <= 1) return null;

            return (
              <div className="flex items-center justify-center gap-4 mt-12">
                <button
                  onClick={() => setDocCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={docCurrentPage === 1}
                  className="w-14 h-14 bg-white border-2 border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-600 disabled:opacity-30 disabled:hover:text-slate-400 disabled:hover:border-slate-100 transition-all shadow-lg"
                >
                  <ChevronLeft size={24} />
                </button>
                <div className="flex items-center gap-2">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setDocCurrentPage(i + 1)}
                      className={`w-10 h-10 rounded-xl font-black text-xs transition-all ${docCurrentPage === i + 1 ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white text-slate-400 hover:bg-slate-50'}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setDocCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={docCurrentPage === totalPages}
                  className="w-14 h-14 bg-white border-2 border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-600 disabled:opacity-30 disabled:hover:text-slate-400 disabled:hover:border-slate-100 transition-all shadow-lg"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            );
          })()}
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact" className="py-16 px-4 md:px-6 bg-white overflow-hidden relative">
        <div className="max-w-6xl mx-auto">
          <div className="bg-slate-900 rounded-[3.5rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row relative">
            {/* 3D Laptop Icon in Background */}
            <div className="absolute -bottom-10 -right-10 w-80 h-80 opacity-20 hidden lg:block">
              <img src={getAssetPath("/assets/3d/laptop.png")} className="w-full h-full object-contain [clip-path:circle(45%)]" alt="3D Laptop" />
            </div>

            <div className="lg:w-3/5 p-10 md:p-16 space-y-10 text-white relative z-10">
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-black tracking-tight">Kết nối với <br />chúng tôi</h2>
                <p className="text-slate-400 text-lg font-medium">Đội ngũ tư vấn sẽ liên hệ lại ngay trong vòng 24 giờ làm việc.</p>
              </div>
              <form onSubmit={handleContactSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <input
                    className="bg-slate-800/50 border-2 border-slate-700/50 rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-full transition-all"
                    placeholder="Họ và tên"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                  <input
                    className="bg-slate-800/50 border-2 border-slate-700/50 rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-full transition-all"
                    placeholder="Số điện thoại"
                    required
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <input
                  className="bg-slate-800/50 border-2 border-slate-700/50 rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-full transition-all"
                  placeholder="Địa chỉ Email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
                <textarea
                  className="bg-slate-800/50 border-2 border-slate-700/50 rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-full transition-all"
                  placeholder="Bạn quan tâm đến khóa học nào?"
                  rows={4}
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                ></textarea>
                <button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition transform active:scale-95 disabled:bg-slate-800 disabled:text-slate-500 shadow-xl shadow-blue-900/20"
                  disabled={submitted}
                >
                  {submitted ? <>Đã gửi thành công <CheckCircle size={24} /></> : <>Gửi thông tin ngay <Send size={24} /></>}
                </button>
              </form>
            </div>
            <div className="lg:w-2/5 relative bg-blue-600 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-700 to-blue-500 opacity-90"></div>
              <div className="relative p-10 md:p-16 text-white flex flex-col justify-center h-full space-y-10">
                <div className="flex items-start gap-5 group cursor-pointer">
                  <div className="bg-white/20 p-4 rounded-2xl group-hover:bg-white group-hover:text-blue-600 transition-all duration-300 shadow-lg"><MessageSquare size={28} /></div>
                  <div>
                    <h4 className="font-black text-xl mb-1 tracking-tight">Chat với tư vấn viên</h4>
                    <p className="text-blue-100 text-sm leading-relaxed mb-4">Hỗ trợ nhanh qua Zalo: {state.config.zalo}</p>
                    <a href={`https://zalo.me/${state.config.zalo}`} target="_blank" className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-xl font-black text-sm transition transform hover:-translate-y-1 shadow-xl">
                      <img src={getAssetPath("/images/zalo.png")} className="w-5 h-5 object-contain rounded" alt="Zalo" />
                      Nhắn ngay <ArrowRight size={16} />
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-5">
                  <div className="bg-white/20 p-4 rounded-2xl shadow-lg"><DollarSign size={28} /></div>
                  <div>
                    <h4 className="font-black text-xl mb-1 tracking-tight">Hỗ trợ trả góp 0%</h4>
                    <p className="text-blue-100 text-sm leading-relaxed">Giảm áp lực tài chính cho phụ huynh và học sinh.</p>
                  </div>
                </div>
              </div>
              <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </section >

      {
        showVideoModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-10">
            <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-xl" onClick={() => setShowVideoModal(false)} />
            <div className="bg-black w-full max-w-6xl aspect-video rounded-[2rem] md:rounded-[3rem] shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-500 border border-white/10">
              <button
                onClick={() => setShowVideoModal(false)}
                className="absolute top-6 right-6 z-50 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition backdrop-blur-md border border-white/20"
              >
                <X size={24} />
              </button>
              <iframe
                src={state.config.heroVideoUrl.includes('?') ? `${state.config.heroVideoUrl}&autoplay=1` : `${state.config.heroVideoUrl}?autoplay=1`}
                className="w-full h-full border-0"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            </div>
          </div>
        )
      }
    </main >
  );
};

const CourseDetailModal: React.FC<{ course: any, onClose: () => void }> = ({ course, onClose }) => {
  const { addMessage } = useApp();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: `Tôi quan tâm đến khóa học: ${course.title}` });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMessage(formData);
    setSubmitted(true);
    setTimeout(() => onClose(), 2000);
  };


  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 overflow-hidden">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={onClose} />

      <div className="bg-slate-900 w-full max-w-5xl rounded-[3rem] shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-500 flex flex-col md:flex-row max-h-[95vh] border border-slate-700/50">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-50 p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-full transition shadow-lg border border-slate-700"
        >
          <X size={20} />
        </button>

        {/* Left Side: Registration Form */}
        <div className="w-full md:w-3/5 p-8 md:p-14 space-y-8 overflow-y-auto">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">Đăng ký tư vấn <br /><span className="text-blue-500">miễn phí</span></h2>
            <p className="text-slate-400 font-medium">Để lại thông tin, Bình Minh sẽ liên hệ hỗ trợ bạn ngay lập tức.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                className="bg-slate-800/50 border-2 border-slate-700/50 rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-full transition-all font-medium"
                placeholder="Họ và tên"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
              <input
                className="bg-slate-800/50 border-2 border-slate-700/50 rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-full transition-all font-medium"
                placeholder="Số điện thoại"
                required
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <input
              className="bg-slate-800/50 border-2 border-slate-700/50 rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-full transition-all font-medium"
              placeholder="Địa chỉ Email (nếu có)"
              type="email"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
            />
            <textarea
              className="bg-slate-800/50 border-2 border-slate-700/50 rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-full transition-all font-medium min-h-[120px]"
              placeholder="Bạn có thắc mắc gì thêm không?"
              value={formData.message}
              onChange={e => setFormData({ ...formData, message: e.target.value })}
            ></textarea>

            <button
              type="submit"
              disabled={submitted}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition transform active:scale-95 shadow-xl shadow-blue-900/40 disabled:bg-slate-800 disabled:text-slate-500"
            >
              {submitted ? <>Gửi thành công! <CheckCircle size={20} /></> : <>Gửi thông tin ngay <Send size={20} /></>}
            </button>
          </form>
        </div>

        {/* Right Side: Course Summary Card */}
        <div className="w-full md:w-2/5 bg-slate-800/40 p-8 md:p-12 flex flex-col justify-center border-l border-slate-700/50 relative overflow-hidden">
          {/* 3D Laptop Icon in Background (subtle) */}
          <div className="absolute -bottom-10 -right-10 w-64 h-64 opacity-10 pointer-events-none">
            <img src={getAssetPath("/assets/3d/laptop.png")} className="w-full h-full object-contain" alt="3D Laptop" />
          </div>

          <div className="space-y-8 relative">
            {/* Thumbnail */}
            <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl group border border-white/10">
              <img src={getAssetPath(course.image)} className="w-full h-full object-cover transform group-hover:scale-105 transition duration-700" alt={course.title} />
              <div className="absolute inset-0 bg-slate-900/20" />
              <div className="absolute top-4 left-4">
                <span className="bg-blue-600 text-white px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">
                  {course.category}
                </span>
              </div>
            </div>

            {/* Course Info */}
            <div className="space-y-4">
              <h3 className="text-2xl font-black text-white leading-tight tracking-tight">{course.title}</h3>
              <div className="flex items-center gap-4 text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                <div className="flex items-center gap-2 bg-white/5 px-2 py-1 rounded-lg">
                  <Clock size={16} className="text-blue-500" /> <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 px-2 py-1 rounded-lg">
                  <Star size={16} className="text-amber-500" /> <span>Yêu thích 98%</span>
                </div>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed line-clamp-3 font-medium">
                {course.description}
              </p>
            </div>

            {/* Price section */}
            <div className="pt-6 border-t border-slate-700/50">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Học phí trọn gói</p>
              <div className="text-3xl font-black text-blue-500">{course.price}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const X: React.FC<{ size?: number }> = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

export default HomePage;

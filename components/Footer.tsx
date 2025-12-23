
import React from 'react';
import { useApp } from '../constants';
import { getAssetPath } from '../utils';
import { MapPin, Phone, Mail, CheckCircle2, ShieldCheck } from 'lucide-react';

const Footer: React.FC = () => {
  const { state } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-24 pb-12 overflow-hidden relative">
      {/* Decorative background element */}
      <div className="absolute top-0 left-1/2 w-[1000px] h-[300px] bg-blue-600/10 -translate-x-1/2 rounded-full blur-[120px]"></div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
        <div className="space-y-8">
          <div className="flex items-center space-x-3 text-white group cursor-pointer">
            <div className="bg-blue-600 p-2.5 rounded-xl font-black text-lg transition-transform group-hover:rotate-12">
              {state.config.brandLogoImage ? (
                <img src={getAssetPath(state.config.brandLogoImage)} className="w-8 h-8 object-contain" alt="Logo" />
              ) : (
                state.config.brandShortName
              )}
            </div>
            <span className="font-black text-2xl tracking-tighter">{state.config.brandNamePrincipal}</span>
          </div>
          <p className="text-base leading-relaxed font-medium text-slate-400">
            Hệ thống đào tạo ngôn ngữ chất lượng cao tại Cần Đước, Tây Ninh. Đồng hành cùng bạn trên con đường chinh phục tiếng Anh.
          </p>
          <div className="flex space-x-4">
            {/* Social mock buttons */}
            <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all transform hover:-translate-y-1 cursor-pointer shadow-lg font-black text-sm">f</div>
            <a href={`https://zalo.me/${state.config.zalo}`} target="_blank" className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center hover:bg-blue-400 hover:text-white transition-all transform hover:-translate-y-1 cursor-pointer shadow-lg">
              <img src={getAssetPath("/images/zalo.png")} className="w-6 h-6 object-contain rounded-md" alt="Zalo" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-white font-black text-lg mb-8 tracking-tight uppercase text-sm">Liên Hệ</h4>
          <ul className="space-y-5 text-sm font-medium">
            <li className="flex items-start space-x-4 group cursor-pointer">
              <div className="bg-slate-800 p-2 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300"><MapPin size={18} className="shrink-0" /></div>
              <span className="text-slate-400 group-hover:text-slate-200 transition-colors mt-1">{state.config.address}</span>
            </li>
            <li className="flex items-center space-x-4 group cursor-pointer">
              <div className="bg-slate-800 p-2 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300"><Phone size={18} className="shrink-0" /></div>
              <span className="text-slate-400 group-hover:text-slate-200 transition-colors">{state.config.phone}</span>
            </li>
            <li className="flex items-center space-x-4 group cursor-pointer">
              <div className="bg-slate-800 p-2 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300"><Mail size={18} className="shrink-0" /></div>
              <span className="text-slate-400 group-hover:text-slate-200 transition-colors font-semibold">{state.config.email}</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-black text-lg mb-8 tracking-tight uppercase text-sm">Thông Tin Công Khai</h4>
          <div className="bg-slate-800/40 p-6 rounded-3xl space-y-4 text-xs font-medium border border-slate-800/50 backdrop-blur-sm">
            <p className="flex items-center space-x-3">
              <ShieldCheck size={16} className="text-green-500" />
              <span className="text-slate-300 truncate">Giấy phép: {state.config.businessLicense}</span>
            </p>
            <p className="flex items-center space-x-3">
              <CheckCircle2 size={16} className="text-blue-500" />
              <span className="text-slate-300">Đại diện: {state.config.representative}</span>
            </p>
            <p className="text-slate-400 pl-7">Thành lập: {state.config.foundingDate}</p>
            <p className="text-slate-500 italic pl-7 opacity-60 leading-relaxed">Phục vụ công tác thanh tra, kiểm tra theo quy định.</p>
          </div>
        </div>

        <div className="md:col-span-1 lg:col-span-1">
          <h4 className="text-white font-black text-lg mb-8 tracking-tight uppercase text-sm">Vị Trí</h4>
          <div className="rounded-[2.5rem] overflow-hidden h-64 bg-slate-800 shadow-2xl border-4 border-slate-800/50">
            <iframe
              src={state.config.googleMapsEmbed}
              className="w-full h-full border-0 transition duration-1000"
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-20 pt-10 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
        <p className="text-center md:text-left">&copy; 2025 TRUNG TÂM NGOẠI NGỮ {state.config.brandNamePrincipal}. CHÍNH TRỰC - TẬN TÂM.</p>
        <div className="flex space-x-8 mt-6 md:mt-0">
          <a href="#" className="hover:text-blue-500 transition-colors">Điều khoản</a>
          <a href="#" className="hover:text-blue-500 transition-colors">Bảo mật</a>
          <a href="#" className="hover:text-blue-500 transition-colors">Hỗ trợ</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


import React, { createContext, useContext } from 'react';
import { SiteConfig, Course, Teacher, Achievement, AppState, GuestMessage } from './types';

// --- Context and Hook (Moved here to avoid circular dependencies) ---
// --- Constants for Environment ---
const isLocalDev = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

// IMPORTANT: Replace this with your actual Render/Production Backend URL
// Example: 'https://binhminh-backend.onrender.com'
const PRODUCTION_API_URL = '';

export const API_BASE_URL = isLocalDev ? 'http://localhost:5001' : PRODUCTION_API_URL;

export const AppContext = createContext<{
  state: AppState;
  updateState: (newState: Partial<AppState>) => void;
  addMessage: (msg: Omit<GuestMessage, 'id' | 'timestamp' | 'replied'>) => void;
  apiBaseUrl: string;
} | null>(null);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};

export const INITIAL_CONFIG: SiteConfig = {
  heroVideoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1&loop=1",
  heroTitle: "Bình Minh Language Center",
  heroSubtitle: "Khơi nguồn đam mê - Chắp cánh tương lai tại Cần Đước, Tây Ninh",
  aboutText: "Trung tâm ngoại ngữ Bình Minh tự hào là đơn vị giáo dục hàng đầu tại Tây Ninh với đội ngũ giáo viên tận tâm và giáo trình chuẩn quốc tế.",
  mission: "Mang đến môi trường học tập tiếng Anh hiện đại, giúp học viên tự tin hội nhập quốc tế.",
  vision: "Trở thành hệ thống trung tâm ngoại ngữ uy tín nhất khu vực Đông Nam Bộ.",
  address: "119 A, KHU PHố 2, Xã Cần Đước, Tỉnh Tây Ninh, Việt Nam",
  phone: "0949959668",
  zalo: "0949959668",
  email: "info@binhminh-tayninh.edu.vn",
  googleMapsEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d200!2d106.15654625764401!3d10.529789287729349!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31754b05a3723d5f%3A0x5b44e403b9a2c331!2zVHJ1bmcgVMOibSBOZ2_huqFpIE5n4buvIELDrG5oIE1pbmg!5e0!3m2!1svi!2s!4v1766505091639!5m2!1svi!2s",
  seoTitle: "Trung Tâm Ngoại Ngữ Bình Minh - Cần Đước, Tây Ninh",
  seoDescription: "Học tiếng Anh chất lượng cao tại Cần Đước, Tây Ninh. Khóa học IELTS, giao tiếp, tiếng Anh trẻ em.",
  seoKeywords: "tiếng anh tây ninh, ngoại ngữ cần đước, ielts tây ninh, trung tam binh minh",
  establishmentDecision: "1030/QĐ-SGDĐT ngày 01/12/2020",
  businessLicense: "MSDN: 1102023311",
  representative: "TRẦN THỊ THANH TÂM",
  foundingDate: "10/01/2023",
  brandNamePrincipal: "BÌNH MINH",
  brandNameSub: "LANGUAGE CENTER",
  brandShortName: "",
  brandLogoImage: "/uploads/1766506378705-208546692.png"
};

export const INITIAL_COURSES: Course[] = [
  {
    "id": "1",
    "title": "Binh Minh English (Persistent)",
    "description": "Học thông qua trò chơi và hoạt động sáng tạo.",
    "image": "https://picsum.photos/seed/kids/400/300",
    "price": "2.500.000 VNĐ",
    "duration": "3 tháng",
    "category": "Young Learners"
  },
  {
    "id": "2",
    "title": "Luyện Thi IELTS",
    "description": "Cam kết đầu ra 6.5+ với lộ trình cá nhân hóa.",
    "image": "https://picsum.photos/seed/ielts/400/300",
    "price": "5.000.000 VNĐ",
    "duration": "6 tháng",
    "category": "Academic"
  },
  {
    "title": "Dành cho người đi làm",
    "description": "Dành cho người đi làm bận rộn nhanh nâng cao trình độ",
    "price": "2.500.000",
    "duration": "1 tháng",
    "category": "Tiếng Anh Giao Tiếp",
    "image": "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=800",
    "id": "1766493901082"
  }
];

export const INITIAL_TEACHERS: Teacher[] = [
  {
    "name": "Mr. Đạt",
    "role": "Giảng viên IELTS",
    "phone": "07080808011",
    "email": "datss@gmail.com",
    "gender": "male",
    "bio": "Kinh nghiệm 15 năm, vui vẻ, hài hước",
    "image": "",
    "zalo": "",
    "id": "1766497027001"
  },
  {
    "name": "Ms. Trang",
    "role": "Giảng viên B1",
    "phone": "076518899122",
    "email": "trangbb@gmail.com",
    "gender": "female",
    "bio": "Nhiệt tình, tận tuỵ, ân cần với học viên",
    "image": "",
    "zalo": "",
    "id": "1766497089769"
  },
  {
    "name": "Mrs. Kim Phụng",
    "role": "Giám đốc trung tâm",
    "phone": "087898989891",
    "email": "kimphung@gmail.com",
    "gender": "female",
    "bio": "",
    "image": "",
    "zalo": "",
    "id": "1766497175367"
  },
  {
    "name": "Test Teacher",
    "role": "English Teacher",
    "phone": "0987654321",
    "email": "teacher@example.com",
    "gender": "male",
    "bio": "Experienced English teacher with 10 years of experience.",
    "image": "",
    "zalo": "",
    "id": "1766498248826"
  }
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    "id": "1",
    "year": "2023",
    "title": "Trung Tâm Xuất Sắc",
    "description": "Nhận bằng khen từ Sở Giáo dục Đào tạo tỉnh Tây Ninh."
  }
];

export const INITIAL_CATEGORIES = [
  "Tiếng Anh Giao Tiếp",
  "Luyện Thi IELTS",
  "Tiếng Anh Trẻ Em",
  "Tiếng Anh Doanh Nghiệp",
  "Young Learners"
];

export const INITIAL_DOCUMENTS: PublicDocument[] = [];

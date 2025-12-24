
import React, { createContext, useContext } from 'react';
import { SiteConfig, Course, Teacher, Achievement, AppState, GuestMessage, Testimonial, PublicDocument } from './types';

// --- Context and Hook (Moved here to avoid circular dependencies) ---
// --- Constants for Environment ---
const isLocalDev = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

// IMPORTANT: Replace this with your actual Render/Production Backend URL
// Example: 'https://binhminh-backend.onrender.com'
const PRODUCTION_API_URL = 'https://ngoaingubinhminh.onrender.com';

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
  aboutTitle: "Sứ mệnh chắp cánh ước mơ",
  address: "Số 123 Đường 30/4, KP4, P3, TP. Tây Ninh, Việt Nam",
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
  brandLogoImage: "/uploads/1766506378705-208546692.png",
  facebook: "https://facebook.com",
  youtube: "https://youtube.com",
  messenger: "https://m.me/binhminhlanguage",
  statsYears: "10+",
  statsTeachers: "50+",
  statsCourses: "20+",
  statsSatisfaction: "98%"
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

export const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Minh Hằng',
    role: 'PHHS',
    content: 'Gia đình cháu Ngọc Lâm chân thành cảm ơn các thầy cô! Hẹn gặp lại các thầy cô ở trại hè sau! ( Cháu đang muốn sang năm đi trại hè ở Mỹ) Hi hi . Các con chơi vui quá! Con bảo là con rất thích! Sang năm mẹ lại cho con đi nữa. Hi! Cảm ơn các thầy cô BME rất nhiều!',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    order: 1
  },
  {
    id: '2',
    name: 'Lan MT',
    role: 'PHHS',
    content: 'Xin chân thành cảm ơn BME, cảm ơn cô Yến, cô Linh và mọi người đã luôn chăm sóc, chu toàn cho các con. Đặc biệt cảm ơn cô Linh xinh xắn đã trở thành người bạn của các con, luôn cập nhật tình hình hàng ngày cho các bố mẹ ở nhà bằng những đoạn văn rất hay, giàu cảm xúc, được minh họa bằng những bức ảnh thật sinh động. Xin cảm ơn! ❤️',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200',
    order: 2
  },
  {
    id: '3',
    name: 'Chi Trần',
    role: 'PHHS',
    content: 'Cảm ơn các cô, chú. Nhìn ánh mắt bọn trẻ long lanh, thích thú và vui sướng. Chúc thầy cô và các trò có chuyến bay an lành và tốt đẹp',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    order: 3
  },
  {
    id: '4',
    name: 'Nguyễn Hải Yến',
    role: 'PHHS',
    content: 'Cảm ơn BME, cảm ơn các cô chú đã cho các con khoảng thời gian trải nghiệm tuyệt vời !!!',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&q=80&w=200',
    order: 4
  },
  {
    id: '5',
    name: 'Thảo Mit',
    role: 'PHHS',
    content: 'Cảm ơn BME đã cho các con cuộc hành trình trải nghiệm thật thú vị và bổ ích, đã giúp các con học hỏi thêm được rất nhiều kiến thức, có tính tự giác, chủ động trong việc học tập! Tôi xin gửi lời cảm ơn chân thành tới trưởng đoàn, các groupleader tại BME!',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&q=80&w=200',
    order: 5
  },
  {
    id: '6',
    name: 'Vũ Thu Trang',
    role: 'PHHS',
    content: 'Cảm ơn các cô chú BME đã cho các con tình cảm ấm áp như ở gia đình, dù các con ở xa gia đình! Chỉ cần nhìn thấy nụ cười của các bạn nhỏ là các bố mẹ cũng vui lây! Cảm ơn các cô chú đã rất nhiệt tình vì các con!',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    order: 6
  }
];

export const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'TUYỂN DỤNG GV VIỆT NAM GIẢNG DẠY IELTS',
    summary: 'Trung tâm ngoại ngữ Bình Minh (BME) đang tìm kiếm IELTS trainer fulltime và parttime...',
    content: '<h2>Thông tin lớp học:</h2><ul><li>Đối tượng học viên: giáo viên Việt Nam</li><li>Số lượng: dự kiến 20 học viên/ lớp</li></ul><h3>Nhiệm vụ:</h3><ul><li>Chuẩn bị giáo án, danh sách học cụ...</li></ul>',
    image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=800',
    date: '01/10/2023',
    category: 'Tuyển dụng'
  },
  {
    id: '2',
    title: 'ĐƯỜNG ĐUA KỲ THÚ TIỂU HỌC LONG BIÊN NĂM HỌC 2022-2023',
    summary: 'Sáng 18/03, chương trình “Giao lưu tiếng anh – English Marathon” đã diễn ra thành...',
    content: '<p>Chương trình giao lưu đã thu hút đông đảo các em học sinh tham gia với các hoạt động bổ ích...</p>',
    image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=800',
    date: '18/03/2023',
    category: 'Sự kiện'
  }
];

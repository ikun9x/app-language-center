
import React, { createContext, useContext } from 'react';
import { SiteConfig, Course, Teacher, Achievement, AppState, GuestMessage } from './types';

// --- Context and Hook (Moved here to avoid circular dependencies) ---
export const AppContext = createContext<{
  state: AppState;
  updateState: (newState: Partial<AppState>) => void;
  addMessage: (msg: Omit<GuestMessage, 'id' | 'timestamp' | 'replied'>) => void;
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
  address: "Xã Cần Đước, Huyện Cần Đước (Mẫu), Tỉnh Tây Ninh",
  phone: "0901 234 567",
  zalo: "0901234567",
  email: "info@binhminh-tayninh.edu.vn",
  googleMapsEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125345.5678!2d106.1234!3d11.1234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x310b1234567!2zVMOieSBOaW5oLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v123456789",
  seoTitle: "Trung Tâm Ngoại Ngữ Bình Minh - Cần Đước, Tây Ninh",
  seoDescription: "Học tiếng Anh chất lượng cao tại Cần Đước, Tây Ninh. Khóa học IELTS, giao tiếp, tiếng Anh trẻ em.",
  seoKeywords: "tiếng anh tây ninh, ngoại ngữ cần đước, ielts tây ninh, trung tam binh minh",
  businessLicense: "MSDN: 3901234567 - Cấp bởi Sở Kế hoạch và Đầu tư Tây Ninh",
  representative: "Ông Nguyễn Bình Minh",
  foundingDate: "15/05/2015"
};

export const INITIAL_COURSES: Course[] = [
  {
    id: "1",
    title: "Tiếng Anh Trẻ Em",
    description: "Học thông qua trò chơi và hoạt động sáng tạo.",
    image: "https://picsum.photos/seed/kids/400/300",
    price: "2.500.000 VNĐ",
    duration: "3 tháng",
    category: "Young Learners"
  },
  {
    id: "2",
    title: "Luyện Thi IELTS",
    description: "Cam kết đầu ra 6.5+ với lộ trình cá nhân hóa.",
    image: "https://picsum.photos/seed/ielts/400/300",
    price: "5.000.000 VNĐ",
    duration: "6 tháng",
    category: "Academic"
  }
];

export const INITIAL_TEACHERS: Teacher[] = [
  {
    id: "1",
    name: "Ms. Lan Anh",
    role: "Giám đốc học thuật",
    bio: "Hơn 10 năm kinh nghiệm giảng dạy IELTS và TESOL.",
    image: "https://picsum.photos/seed/teacher1/200/200",
    zalo: "0901234567"
  }
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: "1",
    year: "2023",
    title: "Trung Tâm Xuất Sắc",
    description: "Nhận bằng khen từ Sở Giáo dục Đào tạo tỉnh Tây Ninh."
  }
];

export const INITIAL_CATEGORIES = [
  "Tiếng Anh Giao Tiếp",
  "Luyện Thi IELTS",
  "Tiếng Anh Trẻ Em",
  "Tiếng Anh Doanh Nghiệp"
];

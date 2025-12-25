import React, { useState, useEffect } from 'react';
import { useApp } from '../constants';
import { Phone, Mail, Facebook, Youtube, MessageCircle, ArrowUp, Share2 } from 'lucide-react';
import { toast } from 'react-toastify';

const FloatingToolbar: React.FC = () => {
    const { state } = useApp();
    const [showBackToTop, setShowBackToTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowBackToTop(window.scrollY > 400);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleShare = async (e: React.MouseEvent) => {
        e.preventDefault();
        const shareData = {
            title: state.config.brandNamePrincipal || 'Bình Minh Language Center',
            text: state.config.seoDescription || 'Khám phá các khóa học ngoại ngữ tại Bình Minh!',
            url: window.location.href,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.error('Error sharing:', err);
            }
        } else {
            // Fallback: Copy to clipboard
            try {
                await navigator.clipboard.writeText(window.location.href);
                toast.success('Đã sao chép liên kết vào bộ nhớ tạm!');
            } catch (err) {
                toast.error('Không thể sao chép liên kết.');
            }
        }
    };

    const contactButtons = [
        {
            id: 'share',
            icon: <Share2 size={24} />,
            onClick: handleShare,
            bgColor: 'bg-indigo-600',
            label: 'Chia sẻ',
        },
        {
            id: 'facebook',
            icon: <Facebook size={24} />,
            link: state.config.facebook,
            bgColor: 'bg-[#1877F2]',
            label: 'Facebook',
        },
        {
            id: 'youtube',
            icon: <Youtube size={24} />,
            link: state.config.youtube,
            bgColor: 'bg-[#FF0000]',
            label: 'YouTube',
        },
        {
            id: 'email',
            icon: <Mail size={24} />,
            link: `mailto:${state.config.email}`,
            bgColor: 'bg-[#D44638]',
            label: 'Email',
        },
        {
            id: 'phone',
            icon: <Phone size={24} />,
            link: `tel:${state.config.phone}`,
            bgColor: 'bg-[#00AFF0]',
            label: 'Gọi ngay',
        },
        {
            id: 'messenger',
            icon: <MessageCircle size={24} />,
            link: state.config.messenger,
            bgColor: 'bg-[#0084FF]',
            label: 'Messenger',
        },
        {
            id: 'zalo',
            icon: <img src="/images/zalo.png" className="w-6 h-6 object-contain brightness-0 invert" alt="Zalo" />,
            link: `https://zalo.me/${state.config.zalo || state.config.phone}`,
            bgColor: 'bg-[#0068ff]',
            label: 'Zalo',
        },
    ];

    return (
        <>
            {/* Sticky Toolbar */}
            <div className="fixed right-4 bottom-24 z-50 flex flex-col gap-3 group">
                {contactButtons.map((btn) => (
                    (btn.link || btn.onClick) && (
                        <a
                            key={btn.id}
                            href={btn.link || '#'}
                            onClick={btn.onClick}
                            target={btn.link ? "_blank" : undefined}
                            rel={btn.link ? "noopener noreferrer" : undefined}
                            className={`${btn.bgColor} w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform relative group/btn cursor-pointer`}
                            title={btn.label}
                        >
                            {btn.icon}
                            {/* Tooltip for desktop */}
                            <span className="absolute right-full mr-3 px-3 py-1 bg-slate-900 text-white text-xs font-bold rounded-lg opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap pointer-events-none hidden md:block">
                                {btn.label}
                            </span>
                        </a>
                    )
                ))}
            </div>

            {/* Back to Top Button */}
            {showBackToTop && (
                <button
                    onClick={scrollToTop}
                    className="fixed right-4 bottom-6 z-50 w-12 h-12 md:w-14 md:h-14 bg-white border-2 border-slate-900 text-slate-900 rounded-full flex items-center justify-center shadow-xl hover:bg-slate-900 hover:text-white transition-all transform hover:-translate-y-1"
                    title="Quay lại đầu trang"
                >
                    <ArrowUp size={24} strokeWidth={3} />
                </button>
            )}
        </>
    );
};

export default FloatingToolbar;

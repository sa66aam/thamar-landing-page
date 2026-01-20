import React, { useEffect } from 'react';
import { MapPin, BookOpen, ArrowLeft, Instagram, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { logEvent, initScrollTracking, startTimeTracking, endTimeTracking } from '../lib/firebase';

// Custom WhatsApp & TikTok SVGs
const WhatsAppIcon = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
);

const TikTokIcon = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
);

const LandingPage = () => {
    useEffect(() => {
        // Start tracking
        startTimeTracking();
        const cleanupScroll = initScrollTracking('landing');

        // Cleanup on unmount
        return () => {
            endTimeTracking('landing');
            cleanupScroll();
        };
    }, []);

    return (
        <div className="font-body bg-cream text-brown-text min-h-screen relative overflow-x-hidden selection:bg-gold-pale selection:text-brown-dark">

            {/* Pattern Background */}
            <div className="fixed inset-0 pointer-events-none z-0 opacity-10" style={{
                backgroundImage: 'radial-gradient(#B8860B 0.5px, transparent 0.5px)',
                backgroundSize: '20px 20px'
            }} />

            {/* Main Container - Glass Effect */}
            <div className="relative z-10 max-w-md mx-auto min-h-screen bg-white/60 backdrop-blur-xl shadow-2xl border-x border-white/40 flex flex-col">

                {/* Header / Hero Section */}
                <header className="pt-12 pb-8 px-6 text-center relative overflow-hidden">
                    {/* Decorative Circles */}
                    <div className="absolute -top-20 -left-20 w-48 h-48 bg-gold-pale/30 rounded-full blur-3xl" />
                    <div className="absolute top-10 -right-10 w-32 h-32 bg-gold-main/10 rounded-full blur-2xl" />

                    {/* Logo Area */}
                    <div className="relative mx-auto w-40 h-40 mb-6 animate-fade-in-up">
                        {/* Rich Golden Halo / Glass Effect */}
                        <div className="absolute -inset-4 bg-gradient-to-tr from-gold-main/20 via-gold-dark/10 to-transparent rounded-full blur-xl animate-pulse" />
                        <div className="absolute inset-0 rounded-full border border-gold-main/30 bg-gold-pale/10 backdrop-blur-sm" />

                        <div className="relative w-full h-full rounded-full border-[3px] border-white shadow-2xl overflow-hidden bg-cream flex items-center justify-center group">
                            <img
                                src="/logo.jpg"
                                alt="شعار ثمر النخيل"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                        </div>
                        {/* Verified Badge */}
                        <div className="absolute bottom-2 right-2 bg-blue-500 text-white p-1 rounded-full border-2 border-white shadow-sm" title="موثق رسمي">
                            <Check size={16} />
                        </div>
                    </div>

                    {/* Brand Info */}
                    <div className="space-y-3 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        <h1 className="font-reem font-bold text-5xl text-brown-dark leading-relaxed py-2">
                            ثَمَرْ النَّخِيلْ 🌴
                        </h1>
                        <p className="text-gold-dark font-medium text-lg">لضيافة تستحق التميز</p>
                        <div className="inline-flex items-center gap-2 bg-gold-main/10 px-4 py-1.5 rounded-full text-sm font-bold text-gold-dark border border-gold-pale/50">
                            <MapPin size={16} />
                            المنطقة الشرقية
                        </div>

                        {/* Primary CTA: Menu Link - Gold Gradient with Glassmorphism */}
                        <Link
                            to="/menu"
                            onClick={() => logEvent('click_menu', { location: 'header' })}
                            className="flex items-center justify-center gap-4 p-4 mt-5 bg-gradient-to-r from-gold-main to-gold-dark backdrop-blur-md rounded-2xl shadow-lg shadow-gold-main/30 border border-white/30 hover:shadow-xl hover:shadow-gold-main/40 hover:-translate-y-1 active:scale-[0.98] transition-all duration-500 ease-spring group relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 group-hover:via-white/20 transition-all duration-500" />
                            <div className="flex flex-col items-center text-center relative z-10">
                                <span className="font-bold text-xl text-white group-hover:text-cream transition-colors">قائمة المنتجات</span>
                                <span className="text-sm text-white/80 font-medium mt-1">تصفح أذواقنا الفاخرة 🌴</span>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white shadow-lg shadow-gold-dark/20 group-hover:scale-110 transition-transform duration-300 ease-spring border border-white/30 relative z-10">
                                <BookOpen size={24} />
                            </div>
                        </Link>
                    </div>
                </header>

                {/* Social Links */}
                <main className="flex-1 px-5 pb-12 space-y-4">
                    <div className="space-y-3 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>

                        {/* WhatsApp Link */}
                        <a
                            href="https://wa.me/966596440340?text=%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85%20%D8%B9%D9%84%D9%8A%D9%83%D9%85%D8%8C%20%D9%85%D8%B3%D8%A7%D8%A1%20%D8%A7%D9%84%D8%AE%D9%8A%D8%B1%0A%0A%D9%85%D9%85%D9%83%D9%86%20%D8%A3%D8%B9%D8%B1%D9%81%20%D8%A7%D8%B5%D9%86%D8%A7%D9%81%D9%83%D9%85%20%D8%A7%D9%84%D9%85%D9%88%D8%AC%D9%88%D8%AF%D8%A9%D8%9F"
                            onClick={() => logEvent('click_whatsapp_list', { type: 'conversion' })}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg shadow-gold-main/10 border border-white/60 hover:border-[#25D366]/30 hover:shadow-xl hover:-translate-y-1 active:scale-[0.98] transition-all duration-500 ease-spring group relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-[#25D366]/0 via-[#25D366]/0 to-[#25D366]/5 group-hover:via-[#25D366]/5 transition-all duration-500" />
                            <div className="flex items-center gap-4 relative z-10">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#25D366] to-[#128C7E] flex items-center justify-center text-white shadow-lg shadow-[#25D366]/30 group-hover:scale-110 transition-transform duration-300 ease-spring">
                                    <WhatsAppIcon className="w-6 h-6" />
                                </div>
                                <div className="flex flex-col text-right">
                                    <span className="font-bold text-lg text-brown-dark group-hover:text-[#25D366] transition-colors">تواصل معنا على واتساب</span>
                                    <span className="text-xs text-gray-500 font-medium">اطلب أو استفسر الحين</span>
                                </div>
                            </div>
                            <ArrowLeft size={20} className="text-gold-main/50 group-hover:text-[#25D366] group-hover:-translate-x-1 transition-all duration-300 ease-spring relative z-10" />
                        </a>

                        {/* Instagram Link */}
                        <a
                            href="https://instagram.com/thamar.alnakheel"
                            onClick={() => logEvent('click_instagram', { type: 'engagement' })}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg shadow-gold-main/10 border border-white/60 hover:border-pink-500/30 hover:shadow-xl hover:-translate-y-1 active:scale-[0.98] transition-all duration-500 ease-spring group relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/0 via-pink-500/0 to-pink-500/5 group-hover:via-pink-500/5 transition-all duration-500" />
                            <div className="flex items-center gap-4 relative z-10">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-pink-500/30 group-hover:scale-110 transition-transform duration-300 ease-spring">
                                    <Instagram size={24} />
                                </div>
                                <div className="flex flex-col text-right">
                                    <span className="font-bold text-lg text-brown-dark group-hover:text-pink-600 transition-colors">تابعنا على انستقرام</span>
                                    <span className="text-xs text-gray-500 font-medium">صور، وصفات، ويوميات</span>
                                </div>
                            </div>
                            <ArrowLeft size={20} className="text-gold-main/50 group-hover:text-pink-600 group-hover:-translate-x-1 transition-all duration-300 ease-spring relative z-10" />
                        </a>

                        {/* TikTok Link */}
                        <a
                            href="https://tiktok.com/@thamar.alnakheel"
                            onClick={() => logEvent('click_tiktok', { type: 'engagement' })}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg shadow-gold-main/10 border border-white/60 hover:border-black/30 hover:shadow-xl hover:-translate-y-1 active:scale-[0.98] transition-all duration-500 ease-spring group relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-gray-200/0 via-gray-200/0 to-gray-200/5 group-hover:via-gray-200/5 transition-all duration-500" />
                            <div className="flex items-center gap-4 relative z-10">
                                <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center text-white shadow-lg shadow-black/30 group-hover:scale-110 transition-transform duration-300">
                                    <TikTokIcon className="w-6 h-6" />
                                </div>
                                <div className="flex flex-col text-right">
                                    <span className="font-bold text-lg text-brown-dark group-hover:text-black transition-colors">تيك توك</span>
                                    <span className="text-xs text-gray-500 font-medium">شوف كواليسنا وعروضنا</span>
                                </div>
                            </div>
                            <ArrowLeft size={20} className="text-gold-main/50 group-hover:text-black group-hover:-translate-x-1 transition-all relative z-10" />
                        </a>
                    </div>
                </main>

                {/* Footer */}
                <footer className="bg-cream-dark border-t border-gold-pale py-6 text-center text-sm text-brown-text/70 mt-auto">
                    <p className="font-reem text-xl text-gold-dark mb-1">ثَمَرْ النَّخِيلْ</p>
                    <p className="mb-2">من بيتنا لبيتك، بكل حب 🧡</p>
                    <p className="text-xs opacity-50">© 2025 جميع الحقوق محفوظة</p>
                </footer>

            </div>
        </div>
    );
};

export default LandingPage;

import React, { useEffect, useRef } from 'react';
import { ArrowRight, Send, Heart, Star, Crown, Package, Info, Instagram, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { logEvent, initScrollTracking, startTimeTracking, endTimeTracking, trackProductView, resetProductViews } from '../lib/firebase';

// Custom SVG Icons
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

const products = [
    {
        id: 1,
        name: 'ذوق المدينة',
        nameEn: 'Thawq Al-Madinah',
        description: 'عجوة المدينة المنورة بحشوة من المكسرات بخلطتنا الخاصة، مع صوص الدبس العضوي اللي يذوب بفمك! 🌴✨',
        image: '/products/thawq-madinah.jpg',
        badge: '⭐ الأكثر طلباً',
        badgeStyle: 'bg-gradient-to-r from-gold-main via-gold-light to-gold-main',
        tagIcon: Heart,
        tagText: 'من قلب طيبة الطيبة',
        tagColor: 'text-red-400',
        whatsappMessage: 'السلام عليكم، أبغى أطلب ذوق المدينة 🌴'
    },
    {
        id: 2,
        name: 'ذوق السكري',
        nameEn: 'Thawq Al-Sukari',
        description: 'سكري مفتّل بحشوة البسكويت الخاصة فينا، ومزيّن بصوص الطحينة الفاخرة. كل قضمة تجربة ما تتكرر! 🤤',
        image: '/products/thawq-sukari.jpg',
        badge: '🍯 حلاوة طبيعية',
        badgeStyle: 'bg-gold-main',
        tagIcon: Star,
        tagText: 'سكري القصيم الفاخر',
        tagColor: 'text-gold-main',
        whatsappMessage: 'السلام عليكم، أبغى أطلب ذوق السكري 🍯'
    },
    {
        id: 3,
        name: 'ذوق نجد',
        nameEn: 'Thawq Najd',
        description: 'هنا طعم الأصالة! تمر خلاص مع الأقط والسمن البلدي، ياخذك لأصالتنا العريقة. ضيافة أجدادنا بلمسة عصرية! 🐪👑',
        image: '/products/thawq-najd.jpg',
        badge: '🏜️ طعم الأصالة',
        badgeStyle: 'bg-gradient-to-r from-brown-dark via-amber-700 to-brown-dark',
        tagIcon: Crown,
        tagText: 'وصفة الأجداد',
        tagColor: 'text-gold-dark',
        whatsappMessage: 'السلام عليكم، أبغى أطلب ذوق نجد 🏜️'
    },
    {
        id: 4,
        name: 'المجموعة الكاملة',
        nameEn: 'The Complete Collection',
        description: 'تبغى تجرب كل الأذواق؟ المجموعة الكاملة تجمع لك ذوق المدينة + ذوق السكري + ذوق نجد في طبق واحد فاخر! 🌴✨🎁',
        image: '/products/thawq-collection.jpg',
        badge: '🎁 عرض خاص',
        badgeStyle: 'bg-gradient-to-r from-gold-main to-gold-dark',
        tagIcon: Package,
        tagText: 'ثلاثة أذواق في طبق واحد',
        tagColor: 'text-gold-main',
        whatsappMessage: 'السلام عليكم، أبغى أطلب المجموعة الكاملة (ذوق المدينة + ذوق السكري + ذوق نجد) 🎁',
        isSpecial: true
    }
];

// Product Card with view tracking
const ProductCard = ({ product }) => {
    const cardRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    trackProductView(product.name);
                }
            },
            { threshold: 0.5 } // Trigger when 50% visible
        );

        if (cardRef.current) {
            observer.observe(cardRef.current);
        }

        return () => observer.disconnect();
    }, [product.name]);

    return (
        <article
            ref={cardRef}
            className={`relative rounded-3xl overflow-hidden shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl active:scale-[0.98] active:rotate-[0.5deg] group isolate
            ${product.isSpecial
                    ? 'bg-gradient-to-br from-white/95 to-gold-pale/10 border-2 border-gold-main/40'
                    : 'bg-white/90 backdrop-blur-xl border border-white/50'}`}
        >
            {/* Image */}
            <div className="relative h-56 overflow-hidden">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                />
                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className={`absolute top-4 right-4 ${product.badgeStyle} text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-md bg-opacity-90`}>
                    {product.badge}
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                        <h3 className="font-amiri text-2xl font-bold text-brown-dark leading-tight">{product.name}</h3>
                        <p className="text-gold-dark text-sm font-bold mt-1 tracking-wide">{product.nameEn}</p>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="font-bold text-lg text-brown-dark opacity-40">---</span>
                    </div>
                </div>

                <p className="text-brown-text/90 text-sm leading-7 mb-6 font-medium">{product.description}</p>

                <div className="flex items-center justify-between pt-2 border-t border-gold-pale/20">
                    <div className="flex items-center gap-2 text-xs text-gray-600 bg-gold-pale/10 px-3 py-1.5 rounded-full">
                        <product.tagIcon size={14} className={product.tagColor} />
                        <span>{product.tagText}</span>
                    </div>
                    <div className="relative group/btn p-[2px] rounded-full overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-moving-border bg-[length:200%_100%] opacity-70" />
                        <a
                            href={`https://wa.me/966596440340?text=${encodeURIComponent(product.whatsappMessage)}`}
                            onClick={() => logEvent('click_order', { product: product.name, location: 'menu_page' })}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`relative flex items-center gap-2 text-white text-sm font-bold px-5 py-2.5 rounded-full shadow-lg shadow-gold-main/20 transition-all duration-200 active:scale-95
                            ${product.isSpecial
                                    ? 'bg-gradient-to-r from-gold-main to-gold-dark hover:from-gold-dark hover:to-gold-main'
                                    : 'bg-[#25D366] hover:bg-[#20BD5A]'}`}
                        >
                            <span>اطلب</span>
                            <Send size={18} className={!product.isSpecial ? 'animate-pulse' : ''} />
                        </a>
                    </div>
                </div>
            </div>
        </article>
    );
};

const MenuPage = () => {
    useEffect(() => {
        // Start tracking
        startTimeTracking();
        resetProductViews();
        const cleanupScroll = initScrollTracking('menu');

        // Cleanup on unmount
        return () => {
            endTimeTracking('menu');
            cleanupScroll();
        };
    }, []);

    return (
        <div className="font-body bg-cream text-brown-text min-h-screen">
            {/* Pattern Background */}
            <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.08]" style={{
                backgroundImage: 'radial-gradient(#B8860B 0.5px, transparent 0.5px)',
                backgroundSize: '20px 20px'
            }} />

            <div className="relative z-10 max-w-lg mx-auto min-h-screen bg-white/40 shadow-2xl">

                {/* Header with Watermark */}
                <header className="relative pt-16 pb-12 px-6 text-center border-b border-gold-pale/50 overflow-hidden">
                    {/* Watermark */}
                    <div
                        className="absolute inset-0 z-0 opacity-[0.15] pointer-events-none"
                        style={{
                            backgroundImage: "url('/logo.jpg')",
                            backgroundSize: 'cover',
                            backgroundPosition: 'center 30%',
                            mixBlendMode: 'multiply'
                        }}
                    />

                    {/* Back Button - Optimized for touch */}
                    <Link
                        to="/"
                        className="absolute top-6 right-4 z-20 w-12 h-12 flex items-center justify-center rounded-full bg-white/90 shadow-gold-main/20 shadow-lg active:scale-95 transition-transform"
                        aria-label="الرجوع للرئيسية"
                    >
                        <ArrowRight size={22} className="text-brown-dark" />
                    </Link>

                    {/* Content */}
                    <div className="relative z-10">
                        <h1 className="font-amiri text-4xl text-brown-dark font-bold mb-2">قائمة المنتجات</h1>
                        <p className="text-gold-dark font-medium">كل قطعة محضّرة بحب من بيتنا 🧡</p>

                        {/* Decorative Line */}
                        <div className="flex items-center justify-center gap-3 mt-4 opacity-80">
                            <div className="h-px w-16 bg-gradient-to-l from-gold-main to-transparent" />
                            <Sparkles size={16} className="text-gold-main" />
                            <div className="h-px w-16 bg-gradient-to-r from-gold-main to-transparent" />
                        </div>
                    </div>
                </header>

                {/* Products */}
                <main className="px-5 py-8 space-y-8">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}

                    {/* Info Note */}
                    <div className="bg-cream-dark/50 rounded-xl p-4 text-center border border-gold-pale/30">
                        <p className="text-sm text-brown-text/70 flex items-center justify-center gap-1">
                            <Info size={16} className="text-gold-main" />
                            التوصيل متاح داخل المنطقة الشرقية
                        </p>
                    </div>
                </main>

                {/* Footer */}
                <footer className="bg-cream-dark border-t border-gold-pale py-6 px-6">
                    <div className="text-center mb-4">
                        <p className="font-reem text-2xl text-brown-dark mb-1">ثَمَرْ النَّخِيلْ 🌴</p>
                        <p className="text-sm text-brown-text/70">من بيتنا لبيتك، بكل حب</p>
                    </div>

                    <div className="flex items-center justify-center gap-4 mb-4">
                        <a
                            href="https://wa.me/966596440340"
                            onClick={() => logEvent('click_whatsapp_footer', { location: 'menu_footer' })}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 flex items-center justify-center rounded-full bg-[#25D366] text-white shadow-md hover:shadow-lg transition-all"
                        >
                            <WhatsAppIcon className="w-5 h-5" />
                        </a>
                        <a
                            href="https://instagram.com/thamar.alnakheel"
                            onClick={() => logEvent('click_instagram_footer', { location: 'menu_footer' })}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 text-white shadow-md hover:shadow-lg transition-all"
                        >
                            <Instagram size={20} />
                        </a>
                        <a
                            href="https://tiktok.com/@thamar.alnakheel"
                            onClick={() => logEvent('click_tiktok_footer', { location: 'menu_footer' })}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 flex items-center justify-center rounded-full bg-black text-white shadow-md hover:shadow-lg transition-all"
                        >
                            <TikTokIcon className="w-5 h-5" />
                        </a>
                    </div>

                    <p className="text-center text-xs text-brown-text/50">© 2025 ثمر النخيل - جميع الحقوق محفوظة</p>
                </footer>
            </div>
        </div>
    );
};

export default MenuPage;

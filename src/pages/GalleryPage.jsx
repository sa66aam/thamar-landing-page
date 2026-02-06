import React, { useEffect, useState, useRef, memo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Images, Play, Pause, X, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { logEvent, initScrollTracking, startTimeTracking, endTimeTracking, trackGalleryVisit, trackMediaClick, trackVideoPlay, subscribeToVisitorCount, incrementVisitorCount } from '../lib/firebase';

// WhatsApp Icon
const WhatsAppIcon = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
);

// Detect in-app browsers (Instagram, TikTok, etc.) that hijack video .play()
const IN_APP_BROWSER = (() => {
    if (typeof navigator === 'undefined') return false;
    const ua = navigator.userAgent || '';
    return /Instagram|FBAN|FBAV|TikTok|BytedanceWebview|Line\/|Snapchat|Twitter/i.test(ua);
})();

// Gallery media items - Videos first, then photos distributed visually
const galleryMedia = [
    // Videos at the beginning (7 videos)
    { id: 1, type: 'video', src: '/events/event-video-1.mp4', alt: 'دامت أفراحكم', category: 'فيديو' },
    { id: 2, type: 'video', src: '/events/event-video-2.mp4', alt: 'لحظات جميلة', category: 'فيديو' },
    { id: 3, type: 'video', src: '/events/event-video-3.mp4', alt: 'دامت أفراحكم', category: 'فيديو' },
    { id: 24, type: 'video', src: '/events/event-video-4.mp4', alt: 'لحظة سعيدة', category: 'فيديو' },
    { id: 25, type: 'video', src: '/events/event-video-5.mp4', alt: 'أجواء رائعة', category: 'فيديو' },
    { id: 26, type: 'video', src: '/events/event-video-6.mp4', alt: 'ذكريات جميلة', category: 'فيديو' },
    { id: 27, type: 'video', src: '/events/event-video-7.mp4', alt: 'لحظات مميزة', category: 'فيديو' },
    // Photos - distributed by category for visual variety
    { id: 4, type: 'image', src: '/events/event-1.jpg', alt: 'ضيافة مناسبة', category: 'ضيافة' },
    { id: 5, type: 'image', src: '/events/event-9.jpg', alt: 'تجهيزات فاخرة', category: 'مناسبات' },
    { id: 6, type: 'image', src: '/events/event-2.jpg', alt: 'لمسة راقية', category: 'ضيافة' },
    { id: 7, type: 'image', src: '/events/event-12.jpg', alt: 'حفلة خاصة', category: 'حفلات' },
    { id: 8, type: 'image', src: '/events/event-3.jpg', alt: 'ضيافة عائلية', category: 'ضيافة' },
    { id: 9, type: 'image', src: '/events/event-17.jpg', alt: 'أجواء رائعة', category: 'فعاليات' },
    { id: 10, type: 'image', src: '/events/event-4.jpg', alt: 'مناسبة مميزة', category: 'مناسبات' },
    { id: 11, type: 'image', src: '/events/event-11.jpg', alt: 'ذكريات جميلة', category: 'ضيافة' },
    { id: 12, type: 'image', src: '/events/event-5.jpg', alt: 'تنسيق فاخر', category: 'حفلات' },
    { id: 13, type: 'image', src: '/events/event-19.jpg', alt: 'لحظات مميزة', category: 'مناسبات' },
    { id: 14, type: 'image', src: '/events/event-6.jpg', alt: 'ضيافة راقية', category: 'ضيافة' },
    { id: 15, type: 'image', src: '/events/event-14.jpg', alt: 'فعالية خاصة', category: 'فعاليات' },
    { id: 16, type: 'image', src: '/events/event-7.jpg', alt: 'تجهيز مناسبة', category: 'مناسبات' },
    { id: 17, type: 'image', src: '/events/event-16.jpg', alt: 'لمسة إبداعية', category: 'ضيافة' },
    { id: 18, type: 'image', src: '/events/event-8.jpg', alt: 'حفلة مميزة', category: 'حفلات' },
    { id: 19, type: 'image', src: '/events/event-13.jpg', alt: 'من مناسباتكم', category: 'ضيافة' },
    { id: 20, type: 'image', src: '/events/event-10.jpg', alt: 'مناسبة عائلية', category: 'مناسبات' },
    { id: 21, type: 'image', src: '/events/event-18.jpg', alt: 'أجواء مميزة', category: 'فعاليات' },
    { id: 22, type: 'image', src: '/events/event-15.jpg', alt: 'من مناسباتكم', category: 'ضيافة' },
    { id: 23, type: 'image', src: '/events/event-20.jpg', alt: 'لحظات سعيدة', category: 'مناسبات' },
];

// Media Card Component
// Normal browsers: video autoplays muted like a GIF
// In-app browsers: show poster image (no .play() to avoid native player hijack)
const MediaCard = memo(({ item, onClick }) => {
    const isVideo = item.type === 'video';
    const videoRef = useRef(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!isVideo || !video) return;

        // React muted prop bug workaround
        video.muted = true;

        // In-app browsers: never call .play() — poster image is shown instead
        if (IN_APP_BROWSER) return;

        // Normal browsers: autoplay muted like a GIF
        const playPromise = video.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => {});
        }

        return () => { video.pause(); };
    }, [isVideo, item.src]);

    return (
        <div
            onClick={onClick}
            className="relative aspect-square rounded-xl overflow-hidden shadow-lg cursor-pointer group hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        >
            {isVideo ? (
                <>
                    {/* In-app browsers: show poster image. Normal browsers: autoplay video */}
                    {IN_APP_BROWSER ? (
                        <img
                            src={item.src.replace('.mp4', '-poster.jpg')}
                            alt={item.alt}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            decoding="async"
                        />
                    ) : (
                        <video
                            ref={videoRef}
                            src={item.src}
                            loop
                            muted
                            playsInline
                            preload="metadata"
                            className="w-full h-full object-cover"
                        />
                    )}
                    {/* Corner badge only */}
                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                        <Play size={12} fill="white" />
                        <span>فيديو</span>
                    </div>
                </>
            ) : (
                <img
                    src={item.src}
                    alt={item.alt}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                    decoding="async"
                />
            )}

            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-3 right-3 left-3">
                    <span className="text-white text-sm font-medium bg-gold-main/80 px-2 py-1 rounded-full">
                        {item.category}
                    </span>
                </div>
            </div>
        </div>
    );
});

// Lightbox Component - Full Screen, no zoom, videos autoplay with sound
const Lightbox = ({ currentIndex, items, onClose, onNavigate }) => {
    const lightboxVideoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(true);

    // Autoplay video when lightbox opens or navigates to a video
    useEffect(() => {
        const video = lightboxVideoRef.current;
        if (!video) return;

        setIsPlaying(true);
        video.muted = false;
        const playPromise = video.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => {
                video.muted = true;
                video.play().catch(() => { setIsPlaying(false); });
            });
        }

        const onPlay = () => setIsPlaying(true);
        const onPause = () => setIsPlaying(false);
        video.addEventListener('play', onPlay);
        video.addEventListener('pause', onPause);

        return () => {
            video.pause();
            video.removeEventListener('play', onPlay);
            video.removeEventListener('pause', onPause);
        };
    }, [currentIndex]);

    if (currentIndex === null || currentIndex === undefined) return null;

    const item = items[currentIndex];
    const totalItems = items.length;

    const goToPrev = (e) => {
        e?.stopPropagation();
        onNavigate((currentIndex - 1 + totalItems) % totalItems);
    };

    const goToNext = (e) => {
        e?.stopPropagation();
        onNavigate((currentIndex + 1) % totalItems);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowLeft') goToNext();
        if (e.key === 'ArrowRight') goToPrev();
        if (e.key === 'Escape') onClose();
    };

    const handlePlayOverlayClick = (e) => {
        e.stopPropagation();
        const video = lightboxVideoRef.current;
        if (!video) return;
        video.play().catch(() => {});
    };

    return (
        <div
            className="fixed inset-0 z-50 bg-black flex items-center justify-center"
            onClick={onClose}
            onKeyDown={handleKeyDown}
            tabIndex={0}
        >
            {/* Close Button */}
            <button
                onClick={(e) => { e.stopPropagation(); onClose(); }}
                className="absolute top-4 right-4 z-30 w-12 h-12 flex items-center justify-center rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 active:scale-95 transition-all"
                aria-label="إغلاق"
            >
                <X size={28} />
            </button>

            {/* Counter */}
            <div className="absolute top-4 left-4 z-30 bg-black/50 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm">
                {currentIndex + 1} / {totalItems}
            </div>

            {/* Navigation Buttons */}
            <>
                <button
                    onClick={goToPrev}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-30 w-14 h-24 flex items-center justify-center rounded-2xl bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 active:scale-95 transition-all"
                    aria-label="السابق"
                >
                    <ChevronRight size={36} />
                </button>
                <button
                    onClick={goToNext}
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-30 w-14 h-24 flex items-center justify-center rounded-2xl bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 active:scale-95 transition-all"
                    aria-label="التالي"
                >
                    <ChevronLeft size={36} />
                </button>
            </>

            {/* Media Content - Full Screen */}
            <div
                className="w-full h-full flex items-center justify-center overflow-hidden relative"
                onClick={(e) => e.stopPropagation()}
            >
                {item.type === 'video' ? (
                    <>
                        <video
                            ref={lightboxVideoRef}
                            key={item.id}
                            src={item.src}
                            poster={item.src.replace('.mp4', '-poster.jpg')}
                            playsInline
                            controls
                            className="w-full h-full object-contain"
                        />
                        {/* Persistent play icon when paused — tap to resume */}
                        {!isPlaying && (
                            <div
                                className="absolute inset-0 flex items-center justify-center cursor-pointer"
                                onClick={handlePlayOverlayClick}
                            >
                                <div className="w-16 h-16 rounded-full bg-black/50 flex items-center justify-center">
                                    <Play size={32} fill="white" className="text-white" />
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <img
                        key={item.id}
                        src={item.src}
                        alt={item.alt}
                        className="w-full h-full object-contain"
                    />
                )}
            </div>
        </div>
    );
};

const GalleryPage = () => {
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [visitorCount, setVisitorCount] = useState(null);

    useEffect(() => {
        startTimeTracking();
        const cleanupScroll = initScrollTracking('gallery');

        // Track gallery visit
        trackGalleryVisit();

        // Increment visitor count (async)
        incrementVisitorCount();

        // Subscribe to real-time visitor count from Firestore
        const unsubscribeVisitors = subscribeToVisitorCount((count) => {
            setVisitorCount(count);
        });

        return () => {
            endTimeTracking('gallery');
            cleanupScroll();
            unsubscribeVisitors();
        };
    }, []);

    // Handle media click with tracking
    const handleMediaClick = (index) => {
        const item = galleryMedia[index];
        trackMediaClick(item.type, item.id, item.alt);

        if (item.type === 'video') {
            trackVideoPlay(item.id, item.alt);
        }

        setSelectedIndex(index);
    };

    // Close lightbox on Escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') setSelectedIndex(null);
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, []);

    const whatsappMessage = encodeURIComponent('السلام عليكم، أبغى أستفسر عن ضيافة لمناسبة خاصة 🎉');

    return (
        <div className="font-body bg-cream text-brown-text min-h-screen">
            {/* Pattern Background */}
            <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.08]" style={{
                backgroundImage: 'radial-gradient(#B8860B 0.5px, transparent 0.5px)',
                backgroundSize: '20px 20px'
            }} />

            <div className="relative z-10 max-w-lg mx-auto min-h-screen bg-white/40 shadow-2xl">

                {/* Header */}
                <header className="relative pt-16 pb-10 px-6 text-center border-b border-gold-pale/50 overflow-hidden">
                    {/* Watermark */}
                    <div
                        className="absolute inset-0 z-0 opacity-[0.12] pointer-events-none"
                        style={{
                            backgroundImage: "url('/logo.jpg')",
                            backgroundSize: 'cover',
                            backgroundPosition: 'center 30%',
                            mixBlendMode: 'multiply'
                        }}
                    />

                    {/* Back Button */}
                    <Link
                        to="/"
                        className="absolute top-6 right-4 z-20 w-12 h-12 flex items-center justify-center rounded-full bg-white/90 shadow-gold-main/20 shadow-lg active:scale-95 transition-transform"
                        aria-label="الرجوع للرئيسية"
                    >
                        <ArrowRight size={22} className="text-brown-dark" />
                    </Link>

                    {/* Content */}
                    <div className="relative z-10">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <Images size={28} className="text-gold-main" />
                        </div>
                        <h1 className="font-amiri text-4xl text-brown-dark font-bold mb-2">معرض الصور</h1>
                        <p className="text-gold-dark font-medium">لحظات من مناسباتكم الجميلة 📸</p>

                        {/* Visitor Counter - hidden until Firestore responds to prevent flash */}
                        {visitorCount !== null && (
                            <div className="flex items-center justify-center gap-2 mt-3">
                                <div className="bg-gradient-to-r from-gold-main/20 to-gold-dark/20 backdrop-blur-sm px-4 py-1.5 rounded-full border border-gold-main/30">
                                    <span className="text-sm text-brown-dark">
                                        👁️ <span className="font-bold text-gold-dark">{visitorCount}</span> زائر
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Decorative Line */}
                        <div className="flex items-center justify-center gap-3 mt-4 opacity-80">
                            <div className="h-px w-16 bg-gradient-to-l from-gold-main to-transparent" />
                            <Sparkles size={16} className="text-gold-main" />
                            <div className="h-px w-16 bg-gradient-to-r from-gold-main to-transparent" />
                        </div>
                    </div>
                </header>

                {/* Gallery Grid */}
                <main className="px-4 py-8">
                    <div className="grid grid-cols-2 gap-3">
                        {galleryMedia.map((item, index) => (
                            <MediaCard
                                key={item.id}
                                item={item}
                                onClick={() => handleMediaClick(index)}
                            />
                        ))}
                    </div>

                    {/* Info Note */}
                    <div className="bg-cream-dark/50 rounded-xl p-4 text-center border border-gold-pale/30 mt-8">
                        <p className="text-sm text-brown-text/70">
                            نسعد بخدمتكم في جميع المناسبات 🎉
                        </p>
                    </div>
                </main>

                {/* Sticky WhatsApp CTA */}
                <div className="sticky bottom-0 p-4 bg-gradient-to-t from-cream via-cream to-transparent">
                    <a
                        href={`https://wa.me/966596440340?text=${whatsappMessage}`}
                        onClick={() => logEvent('click_whatsapp_gallery', { location: 'gallery_page' })}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-[#25D366] to-[#128C7E] rounded-2xl shadow-lg shadow-[#25D366]/30 hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98] transition-all group"
                    >
                        <WhatsAppIcon className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                        <span className="font-bold text-lg text-white">احجز لمناسبتك القادمة 🎉</span>
                    </a>
                </div>

                {/* Footer */}
                <footer className="bg-cream-dark border-t border-gold-pale py-6 px-6">
                    <div className="text-center mb-4">
                        <p className="font-reem text-2xl text-brown-dark mb-1">ثَمَرْ النَّخِيلْ 🌴</p>
                        <p className="text-sm text-brown-text/70">من بيتنا لبيتك، بكل حب</p>
                    </div>
                    <p className="text-center text-xs text-brown-text/50">© 2025 ثمر النخيل - جميع الحقوق محفوظة</p>
                </footer>
            </div>

            {/* Lightbox with Swipe Support */}
            <Lightbox
                currentIndex={selectedIndex}
                items={galleryMedia}
                onClose={() => setSelectedIndex(null)}
                onNavigate={setSelectedIndex}
            />
        </div>
    );
};

export default GalleryPage;

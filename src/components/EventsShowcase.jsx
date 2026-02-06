import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { PartyPopper, ChevronLeft, ChevronRight, Sparkles, Play } from 'lucide-react';
import { logEvent } from '../lib/firebase';

// Detect in-app browsers (Instagram, TikTok, etc.) that hijack video playback
const IN_APP_BROWSER = (() => {
    if (typeof navigator === 'undefined') return false;
    const ua = navigator.userAgent || '';
    return /Instagram|FBAN|FBAV|TikTok|BytedanceWebview|Line\/|Snapchat|Twitter/i.test(ua);
})();

// Event media items - preview for carousel (mix of videos and images)
const eventMedia = [
    { id: 1, type: 'video', src: '/events/event-video-1.mp4', alt: 'دامت أفراحكم' },
    { id: 2, type: 'image', src: '/events/event-1.jpg', alt: 'ضيافة مناسبة' },
    { id: 3, type: 'video', src: '/events/event-video-2.mp4', alt: 'لحظات جميلة' },
    { id: 4, type: 'image', src: '/events/event-9.jpg', alt: 'تجهيزات فاخرة' },
    { id: 5, type: 'video', src: '/events/event-video-3.mp4', alt: 'دامت أفراحكم' },
    { id: 6, type: 'image', src: '/events/event-17.jpg', alt: 'أجواء رائعة' },
];

const EventsShowcase = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [autoplayFailed, setAutoplayFailed] = useState(false);
    const totalItems = eventMedia.length;
    const autoScrollInterval = 4000; // 4 seconds

    // Ref callback for video elements - fixes React muted prop bug
    // In in-app browsers: never call .play() to prevent native player hijacking
    const videoRefCallback = (el) => {
        if (!el) return;

        // React muted prop bug workaround
        el.muted = true;

        // In-app browsers intercept .play() and open native fullscreen player
        // causing repeated popup loops. Show static thumbnail instead.
        if (IN_APP_BROWSER) {
            setAutoplayFailed(true);
            return;
        }

        const playPromise = el.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => {
                setAutoplayFailed(true);
            });
        }
    };

    // Auto-scroll effect
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % totalItems);
        }, autoScrollInterval);

        return () => clearInterval(interval);
    }, [totalItems]);

    const scrollPrev = () => {
        setCurrentIndex((prev) => (prev - 1 + totalItems) % totalItems);
    };

    const scrollNext = () => {
        setCurrentIndex((prev) => (prev + 1) % totalItems);
    };

    const goToSlide = (index) => {
        setCurrentIndex(index);
    };

    const currentItem = eventMedia[currentIndex];

    return (
        <section className="py-8 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            {/* Section Header */}
            <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-2 mb-2">
                    <PartyPopper size={22} className="text-gold-main" />
                    <h2 className="font-amiri text-2xl font-bold text-brown-dark">ضيافة مناسباتكم</h2>
                </div>
                <p className="text-brown-text/70 text-sm font-medium">
                    حفلات • فعاليات • مناسبات خاصة
                </p>
                <div className="flex items-center justify-center gap-3 mt-3 opacity-60">
                    <div className="h-px w-12 bg-gradient-to-l from-gold-main to-transparent" />
                    <Sparkles size={12} className="text-gold-main" />
                    <div className="h-px w-12 bg-gradient-to-r from-gold-main to-transparent" />
                </div>
            </div>

            {/* Carousel Container */}
            <div className="relative px-12">
                {/* Arrow Navigation - Left */}
                <button
                    onClick={scrollPrev}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/90 shadow-lg border border-gold-pale/50 text-gold-dark hover:bg-gold-main hover:text-white active:scale-95 transition-all"
                    aria-label="السابق"
                >
                    <ChevronLeft size={24} />
                </button>

                {/* Arrow Navigation - Right */}
                <button
                    onClick={scrollNext}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/90 shadow-lg border border-gold-pale/50 text-gold-dark hover:bg-gold-main hover:text-white active:scale-95 transition-all"
                    aria-label="التالي"
                >
                    <ChevronRight size={24} />
                </button>

                {/* Media Display Container - Clickable to open gallery */}
                <Link
                    to="/gallery"
                    onClick={() => logEvent('click_events_showcase', {
                        current_media: currentItem.alt,
                        media_type: currentItem.type,
                        slide_index: currentIndex
                    })}
                    className="block rounded-2xl shadow-lg overflow-hidden border border-gold-pale/30 h-[200px] flex items-center justify-center relative bg-cream cursor-pointer hover:shadow-xl hover:border-gold-main/50 transition-all duration-300 group/media"
                >
                    {/* Logo Watermark Background */}
                    <div
                        className="absolute inset-0 z-0 opacity-[0.15] pointer-events-none"
                        style={{
                            backgroundImage: "url('/logo.jpg')",
                            backgroundSize: '180%',
                            backgroundPosition: 'center 45%',
                            mixBlendMode: 'multiply'
                        }}
                    />

                    {/* Media Item - Optimized loading */}
                    {currentItem.type === 'image' ? (
                        <img
                            key={currentIndex}
                            src={currentItem.src}
                            alt={currentItem.alt}
                            loading="lazy"
                            decoding="async"
                            className="max-w-[95%] max-h-[90%] object-contain rounded-xl shadow-md relative z-10 transition-all duration-300 group-hover/media:scale-105"
                        />
                    ) : (
                        <>
                            <video
                                ref={videoRefCallback}
                                key={currentIndex}
                                src={currentItem.src}
                                loop
                                muted
                                playsInline
                                preload="metadata"
                                className="max-w-[95%] max-h-[90%] object-contain rounded-xl shadow-md relative z-10 transition-all duration-300 group-hover/media:scale-105"
                            />
                            {/* Play overlay for in-app browsers where autoplay is blocked */}
                            {autoplayFailed && (
                                <div className="absolute inset-0 flex items-center justify-center z-15">
                                    <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                                        <Play size={20} fill="#B8860B" className="text-gold-main" />
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {/* Tap hint overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover/media:bg-black/10 transition-all duration-300 flex items-center justify-center z-20">
                        <span className="opacity-0 group-hover/media:opacity-100 text-white text-sm font-bold bg-black/50 px-3 py-1.5 rounded-full transition-opacity">
                            اضغط لعرض المزيد 📸
                        </span>
                    </div>
                </Link>

                {/* Dot Indicators */}
                <div className="flex justify-center gap-2 mt-4">
                    {eventMedia.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`h-2.5 rounded-full transition-all duration-300 ${
                                currentIndex === index
                                    ? 'bg-gold-main w-6'
                                    : 'bg-gold-pale hover:bg-gold-light w-2.5'
                            }`}
                            aria-label={`انتقل للعنصر ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default EventsShowcase;

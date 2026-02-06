import React, { useEffect, useRef, useState, memo, useCallback } from 'react';
import { ArrowRight, Send, Heart, Star, Crown, Package, Info, Instagram, Sparkles, X, ShoppingBag, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { logEvent, initScrollTracking, startTimeTracking, endTimeTracking, trackProductView, resetProductViews, subscribeToSelectionCounts, incrementProductSelection, subscribeToRatings, submitProductRating, subscribeToComments, submitProductComment, getProductComments } from '../lib/firebase';
import EventsShowcase from '../components/EventsShowcase';

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
        whatsappMessage: 'السلام عليكم، أبغى أطلب ذوق المدينة 🌴',
        rating: 4.8,
        ratingCount: 14,
        selectionCount: 28,
        price: 175,
        weight: '1 كيلو'
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
        whatsappMessage: 'السلام عليكم، أبغى أطلب ذوق السكري 🍯',
        rating: 4.7,
        ratingCount: 11,
        selectionCount: 19,
        price: 150,
        weight: '1 كيلو'
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
        whatsappMessage: 'السلام عليكم، أبغى أطلب ذوق نجد 🏜️',
        rating: 4.6,
        ratingCount: 9,
        selectionCount: 15,
        price: 120,
        weight: '1 كيلو'
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
        isSpecial: true,
        rating: 4.8,
        ratingCount: 12,
        selectionCount: 22,
        price: 215,
        weight: '1.5 كيلو'
    }
];

// Star Rating Component - Google Style
const StarRating = ({ rating, count, commentCount, onCommentClick }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.3;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
        <div className="flex items-center gap-2 flex-wrap">
            {/* Stars */}
            <div className="flex items-center gap-1">
                <div className="flex items-center gap-0.5">
                    {[...Array(fullStars)].map((_, i) => (
                        <svg key={`full-${i}`} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                    ))}
                    {hasHalfStar && (
                        <div className="relative w-4 h-4">
                            <svg className="absolute w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <div className="absolute overflow-hidden w-1/2 h-4">
                                <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            </div>
                        </div>
                    )}
                    {[...Array(emptyStars)].map((_, i) => (
                        <svg key={`empty-${i}`} className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                    ))}
                </div>
                <span className="text-sm font-bold text-amber-600">{rating}</span>
                <span className="text-xs text-gray-500">({count})</span>
            </div>

            {/* Divider */}
            <span className="text-gray-300">|</span>

            {/* Comments */}
            <button
                onClick={(e) => { e.stopPropagation(); onCommentClick(); }}
                className="flex items-center gap-1 text-gray-500 hover:text-blue-500 transition-colors"
            >
                <MessageCircle size={14} />
                <span className="text-xs">{commentCount}</span>
            </button>
        </div>
    );
};

// Rating Modal Component (with comment input)
const RatingModal = ({ product, isOpen, onClose, onSubmit, onCommentSubmit }) => {
    const [selectedRating, setSelectedRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        if (selectedRating > 0 && !isSubmitting) {
            setIsSubmitting(true);
            await onSubmit(product.id, product.name, selectedRating);
            // Submit comment if provided
            if (comment.trim()) {
                await onCommentSubmit(product.id, product.name, comment.trim());
            }
            setSubmitted(true);
            setTimeout(() => {
                onClose();
                setSubmitted(false);
                setSelectedRating(0);
                setComment('');
                setIsSubmitting(false);
            }, 2000);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose}>
            <div
                className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-sm transform animate-scale-up max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {!submitted ? (
                    <>
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-amiri text-xl font-bold text-brown-dark">قيّم {product.name}</h3>
                            <button
                                onClick={onClose}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                            >
                                <X size={18} className="text-gray-500" />
                            </button>
                        </div>

                        {/* Stars */}
                        <div className="flex justify-center gap-2 py-4">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onMouseEnter={() => setHoveredRating(star)}
                                    onMouseLeave={() => setHoveredRating(0)}
                                    onClick={() => setSelectedRating(star)}
                                    className="transform transition-all duration-200 hover:scale-125 active:scale-95"
                                >
                                    <svg
                                        className={`w-10 h-10 transition-colors duration-200 ${
                                            star <= (hoveredRating || selectedRating)
                                                ? 'text-amber-400'
                                                : 'text-gray-300'
                                        }`}
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                </button>
                            ))}
                        </div>

                        {/* Selected rating text */}
                        <p className="text-center text-sm text-gray-500 mb-4">
                            {selectedRating > 0 ? `اخترت ${selectedRating} نجوم` : 'اضغط على النجوم للتقييم'}
                        </p>

                        {/* Comment Input (optional) */}
                        <div className="mb-4">
                            <label className="text-sm text-gray-600 mb-2 block">أضف تعليقك (اختياري)</label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="شاركنا رأيك..."
                                className="w-full h-20 p-3 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:border-gold-main focus:ring-2 focus:ring-gold-main/20 transition-all"
                                dir="rtl"
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            onClick={handleSubmit}
                            disabled={selectedRating === 0 || isSubmitting}
                            className={`w-full py-3 rounded-xl font-bold text-white transition-all duration-300 ${
                                selectedRating > 0
                                    ? 'bg-gradient-to-r from-gold-main to-gold-dark hover:shadow-lg active:scale-[0.98]'
                                    : 'bg-gray-300 cursor-not-allowed'
                            }`}
                        >
                            {isSubmitting ? 'جاري الإرسال...' : 'إرسال التقييم'}
                        </button>
                    </>
                ) : (
                    /* Thank you state */
                    <div className="text-center py-8">
                        <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center animate-bounce-once">
                            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="font-amiri text-2xl font-bold text-brown-dark mb-2">شكراً لك! 🙏</h3>
                        <p className="text-gray-500">تقييمك يساعدنا على التطوير</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// Comments View Modal (Read-only - shows existing comments)
const CommentsModal = ({ product, isOpen, onClose }) => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen && product) {
            setLoading(true);
            getProductComments(product.id).then((data) => {
                setComments(data);
                setLoading(false);
            });
        }
    }, [isOpen, product]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose}>
            <div
                className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-sm transform animate-scale-up max-h-[80vh] overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <MessageCircle size={20} className="text-blue-500" />
                        <h3 className="font-amiri text-xl font-bold text-brown-dark">التعليقات</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                        <X size={18} className="text-gray-500" />
                    </button>
                </div>

                <p className="text-sm text-gold-dark font-medium mb-4">{product.name}</p>

                {/* Comments List */}
                <div className="flex-1 overflow-y-auto space-y-3 min-h-[150px]">
                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="w-6 h-6 border-2 border-gold-main border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : comments.filter(c => c.comment && c.comment.trim()).length > 0 ? (
                        comments.filter(c => c.comment && c.comment.trim()).map((c, index) => (
                            <div key={c.id || index} className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-100 shadow-sm">
                                <p className="text-sm text-gray-700 leading-relaxed" dir="rtl">{c.comment}</p>
                                <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
                                    <span className="text-xs text-gray-400">
                                        {c.timestamp ? new Date(c.timestamp).toLocaleDateString('ar-SA', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        }) : ''}
                                    </span>
                                    <span className="text-xs text-gold-main">⭐ زائر</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8">
                            <MessageCircle size={40} className="mx-auto text-gray-300 mb-3" />
                            <p className="text-gray-500 text-sm">لا توجد تعليقات بعد</p>
                            <p className="text-gray-400 text-xs mt-1">كن أول من يعلق!</p>
                        </div>
                    )}
                </div>

                {/* Hint to add comment */}
                <div className="mt-4 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-400 text-center">
                        لإضافة تعليق، اضغط على النجوم للتقييم ⭐
                    </p>
                </div>
            </div>
        </div>
    );
};

// Product Card with view tracking
const ProductCard = ({ product, onRatingClick, onCommentClick, selectionCount, ratingData, commentCount, onWhatsAppClick }) => {
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
                <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                        <h3 className="font-amiri text-2xl font-bold text-brown-dark leading-tight">{product.name}</h3>
                        <p className="text-gold-dark text-sm font-bold mt-1 tracking-wide">{product.nameEn}</p>
                    </div>
                    {/* Selection Counter */}
                    <div className="flex flex-col items-center bg-gradient-to-br from-emerald-50 to-green-100 px-3 py-1.5 rounded-xl border border-emerald-200/50 shadow-sm">
                        <div className="flex items-center gap-1">
                            <ShoppingBag size={14} className="text-emerald-600" />
                            <span className="font-bold text-emerald-700 text-lg">{selectionCount}</span>
                        </div>
                        <span className="text-[10px] text-emerald-600/80 font-medium">تم اختياره</span>
                    </div>
                </div>

                {/* Star Rating & Comments - Clickable */}
                <div className="mb-3 cursor-pointer" onClick={onRatingClick}>
                    <StarRating
                        rating={ratingData?.average || product.rating}
                        count={ratingData?.count || product.ratingCount}
                        commentCount={commentCount}
                        onCommentClick={onCommentClick}
                    />
                </div>

                <p className="text-brown-text/90 text-sm leading-7 mb-3 font-medium">{product.description}</p>

                {/* Price Display - Floating Elegant */}
                <div className="flex items-center justify-center gap-5 mb-5 py-2">
                    <div className="text-center">
                        <span className="text-xl font-bold text-brown-dark drop-shadow-sm">{product.price}</span>
                        <span className="text-xs text-gold-dark mr-1">ريال</span>
                    </div>
                    <div className="h-6 w-px bg-gradient-to-b from-transparent via-gold-main/30 to-transparent"></div>
                    <div className="text-brown-text/60 text-xs font-medium">{product.weight}</div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gold-pale/20">
                    <div className="flex items-center gap-2 text-xs text-gray-600 bg-gold-pale/10 px-3 py-1.5 rounded-full">
                        <product.tagIcon size={14} className={product.tagColor} />
                        <span>{product.tagText}</span>
                    </div>
                    <div className="relative group/btn p-[2px] rounded-full overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-moving-border bg-[length:200%_100%] opacity-70" />
                        <a
                            href={`https://wa.me/966596440340?text=${encodeURIComponent(product.whatsappMessage)}`}
                            onClick={() => {
                                logEvent('click_order', { product: product.name, location: 'menu_page' });
                                onWhatsAppClick();
                            }}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`relative flex items-center gap-2 text-white text-sm font-bold px-5 py-2.5 rounded-full shadow-lg shadow-gold-main/20 transition-all duration-200 active:scale-95
                            ${product.isSpecial
                                    ? 'bg-gradient-to-r from-gold-main to-gold-dark hover:from-gold-dark hover:to-gold-main'
                                    : 'bg-[#25D366] hover:bg-[#20BD5A]'}`}
                        >
                            <span>اطلب</span>
                            <Send size={18} className="animate-pulse" />
                        </a>
                    </div>
                </div>
            </div>
        </article>
    );
};

const MenuPage = () => {
    const [ratingModal, setRatingModal] = useState({ isOpen: false, product: null });
    const [commentModal, setCommentModal] = useState({ isOpen: false, product: null });
    const [selectionCounts, setSelectionCounts] = useState({
        1: 28, 2: 19, 3: 15, 4: 22
    });
    const [ratings, setRatings] = useState({
        1: { average: 4.8, count: 14 },
        2: { average: 4.7, count: 11 },
        3: { average: 4.6, count: 9 },
        4: { average: 4.8, count: 12 }
    });
    const [commentCounts, setCommentCounts] = useState({
        1: { count: 8 }, 2: { count: 5 }, 3: { count: 4 }, 4: { count: 6 }
    });

    useEffect(() => {
        // Start tracking
        startTimeTracking();
        resetProductViews();
        const cleanupScroll = initScrollTracking('menu');

        // Subscribe to real-time data from Firestore
        const unsubscribeSelections = subscribeToSelectionCounts((counts) => {
            setSelectionCounts(counts);
        });
        const unsubscribeRatings = subscribeToRatings((data) => {
            setRatings(data);
        });
        const unsubscribeComments = subscribeToComments((data) => {
            setCommentCounts(data);
        });

        // Cleanup on unmount
        return () => {
            endTimeTracking('menu');
            cleanupScroll();
            unsubscribeSelections();
            unsubscribeRatings();
            unsubscribeComments();
        };
    }, []);

    const openRatingModal = (product) => {
        setRatingModal({ isOpen: true, product });
        logEvent('open_rating_modal', { product: product.name });
    };

    const closeRatingModal = () => {
        setRatingModal({ isOpen: false, product: null });
    };

    const openCommentModal = (product) => {
        setCommentModal({ isOpen: true, product });
        logEvent('open_comment_modal', { product: product.name });
    };

    const closeCommentModal = () => {
        setCommentModal({ isOpen: false, product: null });
    };

    const handleRatingSubmit = async (productId, productName, rating) => {
        await submitProductRating(productId, productName, rating);
    };

    const handleCommentSubmit = async (productId, productName, comment) => {
        await submitProductComment(productId, productName, comment);
    };

    const handleWhatsAppClick = async (product) => {
        // Optimistic update
        setSelectionCounts(prev => ({
            ...prev,
            [product.id]: (prev[product.id] || 0) + 1
        }));
        await incrementProductSelection(product.id, product.name);
    };

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
                        <ProductCard
                            key={product.id}
                            product={product}
                            selectionCount={selectionCounts[product.id] || product.selectionCount}
                            ratingData={ratings[product.id]}
                            commentCount={commentCounts[product.id]?.count || 0}
                            onRatingClick={() => openRatingModal(product)}
                            onCommentClick={() => openCommentModal(product)}
                            onWhatsAppClick={() => handleWhatsAppClick(product)}
                        />
                    ))}

                    {/* Info Note */}
                    <div className="bg-cream-dark/50 rounded-xl p-4 text-center border border-gold-pale/30">
                        <p className="text-sm text-brown-text/70 flex items-center justify-center gap-1">
                            <Info size={16} className="text-gold-main" />
                            التوصيل متاح داخل المنطقة الشرقية
                        </p>
                    </div>

                    {/* Events Showcase Section */}
                    <EventsShowcase />
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

            {/* Rating Modal */}
            {ratingModal.product && (
                <RatingModal
                    product={ratingModal.product}
                    isOpen={ratingModal.isOpen}
                    onClose={closeRatingModal}
                    onSubmit={handleRatingSubmit}
                    onCommentSubmit={handleCommentSubmit}
                />
            )}

            {/* Comments Modal (Read-only) */}
            {commentModal.product && (
                <CommentsModal
                    product={commentModal.product}
                    isOpen={commentModal.isOpen}
                    onClose={closeCommentModal}
                />
            )}
        </div>
    );
};

export default MenuPage;

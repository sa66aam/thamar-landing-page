import React from 'react';
import { Phone, Instagram } from 'lucide-react';

const BusinessCard = () => {
    return (
        <div className="card w-[2in] h-[3.5in] relative overflow-hidden bg-cream shadow-2xl rounded-[3px] flex flex-col items-center pt-[18px] pb-[18px] px-[15px] select-none print:shadow-none print:mx-auto">

            {/* Watermark Background */}
            <div className="absolute inset-0 bg-[url('/logo.jpg')] bg-[length:250%] bg-[center_25%] bg-no-repeat opacity-10 mix-blend-multiply z-0 pointer-events-none" />

            {/* Inner Border */}
            <div className="absolute inset-[8px] border-[1.5px] border-gold-main z-10 pointer-events-none" />

            {/* Decorative Corners */}
            <div className="absolute top-[6px] left-[6px] w-[10px] h-[10px] border-2 border-gold-dark border-r-0 border-b-0 z-20" />
            <div className="absolute top-[6px] right-[6px] w-[10px] h-[10px] border-2 border-gold-dark border-l-0 border-b-0 z-20" />
            <div className="absolute bottom-[6px] left-[6px] w-[10px] h-[10px] border-2 border-gold-dark border-r-0 border-t-0 z-20" />
            <div className="absolute bottom-[6px] right-[6px] w-[10px] h-[10px] border-2 border-gold-dark border-l-0 border-t-0 z-20" />

            {/* Content */}
            <div className="relative z-30 w-full flex flex-col items-center h-full">

                {/* Header */}
                <div className="text-center mb-3">
                    <h1 className="font-reem text-[19pt] text-brown-dark font-bold leading-[1.2] mb-1">
                        ثَمَرْ النَّخِيلْ
                    </h1>
                    <div className="font-amiri text-[9pt] text-gold-dark tracking-wide mb-1 flex items-center justify-center gap-2">
                        <span className="text-gold-main">•</span>
                        <span>لضيافة تستحق التميز</span>
                        <span className="text-gold-main">•</span>
                    </div>
                    <div className="font-amiri text-[9pt] text-gold-dark font-bold mt-1">
                        من بيتنا لبيتكم بكل حب 🤎
                    </div>
                </div>

                {/* Divider */}
                <div className="w-[70%] h-[1.5px] bg-gradient-to-r from-transparent via-gold-main to-transparent mb-3 opacity-90" />

                {/* Contact Info */}
                <div className="w-full flex flex-col gap-2 px-1 mb-2">

                    {/* WhatsApp / Phone */}
                    <div className="flex items-center gap-2 text-brown-text text-[8.5pt] font-medium justify-end">
                        <span dir="ltr">059 644 0340</span>
                        <Phone size={14} className="text-gold-main flex-shrink-0" />
                    </div>

                    {/* Instagram */}
                    <div className="flex items-center gap-2 text-brown-text text-[8.5pt] font-medium justify-end">
                        <span dir="ltr">@thamar.alnakheel</span>
                        <Instagram size={14} className="text-gold-main flex-shrink-0" />
                    </div>

                    {/* TikTok */}
                    <div className="flex items-center gap-2 text-brown-text text-[8.5pt] font-medium justify-end">
                        <span dir="ltr">@thamar.alnakheel</span>
                        {/* Custom TikTok Icon since Lucide might typically not have it, or use generic. 
                Using SVG path from original for accuracy if Lucide doesn't suffice. 
                Original used a custom path. Let's use an SVG here. */}
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-[14px] h-[14px] text-gold-main flex-shrink-0">
                            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                        </svg>
                    </div>

                </div>

                {/* QR Section - Pushed to bottom */}
                <div className="mt-auto flex flex-col items-center gap-[3px] mb-1">
                    <div className="bg-white p-[4px] border-[1.5px] border-gold-dark rounded-[3px]">
                        <img
                            src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://thamar-alnakheel.web.app&color=4A3728&bgcolor=FFFFFF"
                            className="w-[48px] h-[48px] block"
                            alt="QR Code"
                        />
                    </div>
                    <span className="text-[6.5pt] text-gold-dark font-semibold">تفضل بزيارتنا</span>
                </div>

            </div>
        </div>
    );
};

export default BusinessCard;

import React, { useState } from 'react';
import contentData from '../../data/contentData.json';
import {
  Smartphone,
  Apple,
  Play,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Zap,
  ArrowRight,
  Download,
} from 'lucide-react';

interface DownloadAppModuleProps {
  onBackToMenu: () => void;
}

export const DownloadAppModule: React.FC<DownloadAppModuleProps> = ({ onBackToMenu }) => {
  const { downloadApp, brand } = contentData;
  const [activePlatform, setActivePlatform] = useState<'ios' | 'android'>('ios');

  // Generate SVG QR Code URL using standard Google Chart / QR API, with high quality inline visual fallback
  const currentUrl =
    activePlatform === 'ios' ? downloadApp.ios.url : downloadApp.android.url;
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
    currentUrl
  )}&color=005baa`;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-[#005baa] mb-3">
          <Smartphone className="w-4 h-4" />
          <span>Ngân hàng số toàn năng VietinBank iPay Mobile</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {downloadApp.title}
        </h2>
        <p className="mt-2 text-sm text-slate-500 leading-relaxed">
          {downloadApp.subtitle}
        </p>
      </div>

      {/* Main Download Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-10 items-center">
          {/* Left Column: QR Code & Platform Switch */}
          <div className="lg:col-span-5 flex flex-col items-center text-center p-6 bg-slate-50 rounded-2xl border border-slate-200/70">
            {/* Segmented selector */}
            <div className="flex items-center gap-1 p-1 bg-white rounded-xl border border-slate-200 shadow-2xs mb-6 w-full max-w-xs">
              <button
                onClick={() => setActivePlatform('ios')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activePlatform === 'ios'
                    ? 'bg-[#005baa] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Apple className="w-4 h-4" />
                <span>iPhone / iPad</span>
              </button>

              <button
                onClick={() => setActivePlatform('android')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activePlatform === 'android'
                    ? 'bg-[#005baa] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Android</span>
              </button>
            </div>

            {/* QR Code Container */}
            <div className="relative p-4 bg-white rounded-2xl border-2 border-dashed border-blue-200 shadow-sm group">
              <img
                src={qrApiUrl}
                alt={`Mã QR tải ứng dụng ${activePlatform === 'ios' ? 'iOS' : 'Android'}`}
                className="w-48 h-48 sm:w-56 sm:h-56 object-contain rounded-xl"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = 'none';
                  const fallback = target.parentElement?.querySelector('.qr-fallback') as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />

              {/* Offline fallback graphic */}
              <div className="qr-fallback hidden w-48 h-48 sm:w-56 sm:h-56 flex-col items-center justify-center bg-blue-50/50 rounded-xl text-center p-4">
                <QrCode className="w-16 h-16 text-[#005baa] mb-2" />
                <span className="text-xs font-bold text-[#005baa]">
                  {activePlatform === 'ios' ? 'Mã QR App Store' : 'Mã QR Google Play'}
                </span>
                <span className="text-[10px] text-slate-500 mt-1">
                  Bấm nút bên dưới để mở liên kết
                </span>
              </div>
            </div>

            <div className="mt-4 space-y-1">
              <p className="text-xs font-bold text-slate-800">
                {activePlatform === 'ios'
                  ? downloadApp.ios.qrLabel
                  : downloadApp.android.qrLabel}
              </p>
              <p className="text-[11px] text-slate-400">
                Mở camera điện thoại và hướng vào mã QR để cài đặt ngay tại quầy
              </p>
            </div>

            {/* Direct Open Link */}
            <a
              href={currentUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-5 w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#ed1c24] hover:bg-[#c41219] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>
                {activePlatform === 'ios'
                  ? 'Mở VietinBank iPay trên App Store'
                  : 'Mở VietinBank iPay trên Google Play'}
              </span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Right Column: App Value Proposition & Features */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#005baa]">
                Hệ sinh thái số tiên phong
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                Tại sao hàng triệu khách hàng chọn VietinBank iPay?
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Ứng dụng ngân hàng số thông minh, an toàn tối đa với công nghệ nhận diện sinh trắc học và hàng trăm tiện ích đời sống.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {downloadApp.benefits.map((benefit, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-blue-200 transition-colors space-y-1.5"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <h4 className="text-xs font-bold text-slate-900">
                      {benefit.title}
                    </h4>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed pl-6">
                    {benefit.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200/70 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#005baa] text-white flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-900">
                    Cán bộ tại quầy hỗ trợ cài đặt & kích hoạt
                  </h5>
                  <p className="text-[11px] text-slate-600">
                    Gặp khó khăn khi quét khuôn mặt hoặc đọc chip CCCD? Chuyên viên luôn sẵn sàng hỗ trợ Quý khách.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

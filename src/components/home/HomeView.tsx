import React from 'react';
import contentData from '../../data/contentData.json';
import { ModuleId } from '../../types';
import {
  HelpCircle,
  Smartphone,
  Gamepad2,
  PiggyBank,
  Calculator,
  Sparkles,
  MapPin,
  ChevronRight,
  Gift,
  ShieldCheck,
  PhoneCall,
  Clock,
  ArrowRight,
  TrendingUp,
  Award,
} from 'lucide-react';

interface HomeViewProps {
  onSelectModule: (module: ModuleId) => void;
  onOpenConsultant: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onSelectModule,
  onOpenConsultant,
}) => {
  const { brand, modules, branchesData } = contentData;

  const getModuleIcon = (id: string) => {
    switch (id) {
      case 'faq':
        return HelpCircle;
      case 'download-app':
        return Smartphone;
      case 'game':
        return Gamepad2;
      case 'savings':
        return PiggyBank;
      case 'loan':
        return Calculator;
      case 'featured':
        return Sparkles;
      case 'branches':
      default:
        return MapPin;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-in fade-in duration-300">
      {/* Hero Welcome Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#005baa] via-[#004b87] to-[#002e5b] text-white shadow-xl">
        {/* Background decorative geometry */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-red-600/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 p-6 sm:p-10 lg:p-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-white/15 backdrop-blur-md text-blue-100 border border-white/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Kiosk tương tác khách hàng thông minh tại quầy</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Chào mừng Quý khách đến với <br className="hidden sm:inline" />
              <span className="text-amber-300">Quầy Giao Dịch VietinBank</span>
            </h1>

            <p className="text-xs sm:text-sm text-blue-100 leading-relaxed max-w-xl">
              Hệ thống hỗ trợ tra cứu thông tin nhanh chóng, giải đáp thắc mắc dịch vụ thẻ & iPay, tính lãi tiền gửi & vay vốn, cùng cơ hội tham gia mini game trúng quà ngay trong lúc chờ đợi.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onSelectModule('faq')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#ed1c24] hover:bg-[#c41219] text-white text-xs font-bold shadow-md transition-all hover:scale-105 cursor-pointer"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Giải đáp thắc mắc</span>
              </button>

              <button
                onClick={() => onSelectModule('game')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold shadow-md transition-all hover:scale-105 cursor-pointer"
              >
                <Gift className="w-4 h-4 text-slate-950" />
                <span>Chơi game nhận Voucher xăng</span>
              </button>
            </div>
          </div>

          {/* Quick Consultant Card on Hero */}
          <div className="w-full lg:w-80 bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 space-y-3 shrink-0">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-200">
                Tư vấn viên trực quầy
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-400/30">
                Đang trực quầy
              </span>
            </div>

            <div className="space-y-1">
              <div className="text-base font-bold text-white">
                {brand.consultant.name}
              </div>
              <div className="text-xs text-blue-200">
                {brand.consultant.title}
              </div>
              <div className="text-[11px] text-blue-200/80">
                {brand.consultant.branch}
              </div>
            </div>

            <div className="pt-2 border-t border-white/15 flex items-center justify-between">
              <a
                href={`tel:${brand.consultant.phone.replace(/\./g, '')}`}
                className="inline-flex items-center gap-1.5 text-xs font-extrabold text-amber-300 hover:text-amber-200"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>{brand.consultant.phone}</span>
              </a>
              <button
                onClick={onOpenConsultant}
                className="text-[11px] text-blue-200 underline hover:text-white cursor-pointer"
              >
                Hỗ trợ trực tiếp
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 7 Interactive Feature Cards Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              7 Tiện ích hỗ trợ khách hàng tại quầy
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Chạm vào tiện ích Quý khách quan tâm để bắt đầu trải nghiệm
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((mod) => {
            const Icon = getModuleIcon(mod.id);
            const isFeatured = mod.id === 'featured';
            const isGame = mod.id === 'game';

            return (
              <div
                key={mod.id}
                onClick={() => onSelectModule(mod.id as ModuleId)}
                className={`group relative rounded-3xl p-6 sm:p-7 border transition-all cursor-pointer flex flex-col justify-between ${
                  isFeatured
                    ? 'bg-gradient-to-br from-blue-50/70 via-white to-red-50/40 border-red-300/80 shadow-md hover:shadow-xl hover:border-[#ed1c24] ring-1 ring-red-100'
                    : isGame
                    ? 'bg-gradient-to-br from-amber-50/50 via-white to-orange-50/30 border-amber-300 shadow-sm hover:shadow-lg hover:border-amber-400'
                    : 'bg-white border-slate-200/90 shadow-2xs hover:shadow-md hover:border-[#005baa]'
                }`}
              >
                {/* Header of Card */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                        isFeatured
                          ? 'bg-gradient-to-tr from-[#ed1c24] to-[#c41219] text-white shadow-xs'
                          : isGame
                          ? 'bg-amber-400 text-slate-950 shadow-xs'
                          : 'bg-blue-50 text-[#005baa] group-hover:bg-[#005baa] group-hover:text-white'
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>

                    {/* Badge */}
                    {isFeatured && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-[#ed1c24] text-white shadow-xs animate-pulse">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Nổi bật</span>
                      </span>
                    )}

                    {isGame && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                        <Gift className="w-3.5 h-3.5 text-amber-700" />
                        <span>Voucher 2L Xăng</span>
                      </span>
                    )}

                    {!isFeatured && !isGame && (
                      <span className="text-xs font-bold text-slate-400 group-hover:text-[#005baa]">
                        {mod.tag}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <h3
                      className={`text-lg font-bold transition-colors ${
                        isFeatured
                          ? 'text-slate-900 group-hover:text-[#ed1c24]'
                          : 'text-slate-900 group-hover:text-[#005baa]'
                      }`}
                    >
                      {mod.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {mod.shortDesc}
                    </p>
                  </div>
                </div>

                {/* Bottom Link Action */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                  <span
                    className={
                      isFeatured
                        ? 'text-[#ed1c24]'
                        : isGame
                        ? 'text-amber-700'
                        : 'text-[#005baa]'
                    }
                  >
                    {isFeatured ? 'Xem ngay' : 'Khám phá'}
                  </span>
                  <ChevronRight
                    className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${
                      isFeatured
                        ? 'text-[#ed1c24]'
                        : isGame
                        ? 'text-amber-700'
                        : 'text-[#005baa]'
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Trust & Network Indicator Strip */}
      <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200/80 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
        <div className="space-y-1">
          <div className="text-2xl font-extrabold text-[#005baa] font-mono">
            155+
          </div>
          <div className="text-xs font-bold text-slate-800">
            Chi nhánh toàn quốc
          </div>
          <div className="text-[11px] text-slate-500">
            Mạng lưới phòng giao dịch phủ khắp 63 tỉnh thành
          </div>
        </div>

        <div className="space-y-1 sm:border-x border-slate-200 px-4">
          <div className="text-2xl font-extrabold text-[#ed1c24] font-mono">
            100% Miễn Phí
          </div>
          <div className="text-xs font-bold text-slate-800">
            Chuyển tiền iPay 24/7
          </div>
          <div className="text-[11px] text-slate-500">
            Không phí duy trì, không phí chuyển khoản
          </div>
        </div>

        <div className="space-y-1">
          <div className="text-2xl font-extrabold text-emerald-600 font-mono">
            2345/QĐ-NHNN
          </div>
          <div className="text-xs font-bold text-slate-800">
            Bảo mật sinh trắc học
          </div>
          <div className="text-[11px] text-slate-500">
            Chuẩn bảo vệ thông tin an toàn cao nhất của NHNN
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import contentData from '../../data/contentData.json';
import { Phone, MapPin, Clock, ShieldCheck, HeartHandshake } from 'lucide-react';
import { ModuleId } from '../../types';

interface FooterProps {
  onSelectModule: (module: ModuleId) => void;
  onOpenConsultant: () => void;
  onOpenEndConversation: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectModule,
  onOpenConsultant,
  onOpenEndConversation,
}) => {
  const { brand, branchesData } = contentData;

  return (
    <footer className="bg-slate-900 text-slate-300 mt-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-xl font-bold text-white tracking-wide">
                VIETINBANK
              </span>
              <span className="text-xs bg-blue-900/60 text-blue-300 px-2 py-0.5 rounded border border-blue-700/50">
                Kiosk Hỗ Trợ
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {brand.tradeName}. Điểm tựa tài chính tin cậy, nâng tầm chuẩn mực phục vụ khách hàng trên toàn quốc.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Hệ thống bảo mật sinh trắc học chuẩn NHNN</span>
            </div>
          </div>

          {/* Direct Support Contact */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
              Tư vấn viên tại quầy
            </h4>
            <div className="bg-slate-800/80 rounded-xl p-3.5 border border-slate-700/60 space-y-2">
              <div className="text-sm font-bold text-white">
                {brand.consultant.name}
              </div>
              <div className="text-xs text-slate-400">
                {brand.consultant.title}
              </div>
              <a
                href={`tel:${brand.consultant.phone.replace(/\./g, '')}`}
                className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Hotline: {brand.consultant.phone}</span>
              </a>
            </div>
            <button
              onClick={onOpenConsultant}
              className="text-xs text-blue-400 hover:text-blue-300 underline underline-offset-4 cursor-pointer"
            >
              Xem chi tiết hồ sơ tư vấn viên &rarr;
            </button>
          </div>

          {/* Working Hours */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
              Thời gian giao dịch
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <div>
                  <span className="text-white block font-medium">Thứ 2 – Thứ 6:</span>
                  <span>Sáng: 07:30 – 11:30</span>
                  <br />
                  <span>Chiều: 13:30 – 16:30</span>
                </div>
              </div>
              <div className="text-slate-500 pl-6">
                Thứ 7 & Chủ nhật: Nghỉ giao dịch (iPay hoạt động 24/7)
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
              Tiện ích nhanh
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onSelectModule('faq')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Giải đáp thắc mắc iPay & Thẻ
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectModule('savings')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Tính lãi tiết kiệm thông thường
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectModule('loan')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Bảng tính lịch trả nợ khoản vay
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectModule('branches')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Mạng lưới phòng giao dịch VietinBank
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenEndConversation}
                  className="text-rose-400 hover:text-rose-300 transition-colors font-medium cursor-pointer"
                >
                  Kết thúc phiên & gửi lời cảm ơn
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} Ngân hàng TMCP Công Thương Việt Nam (VietinBank). All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>Tổng đài CSKH: 1900 558 868</span>
            <span>·</span>
            <span>Ứng dụng Kiosk quầy giao dịch</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

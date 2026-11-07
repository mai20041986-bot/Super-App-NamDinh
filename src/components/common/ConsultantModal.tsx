import React from 'react';
import contentData from '../../data/contentData.json';
import { Phone, User, Building2, MapPin, X, MessageSquare, CheckCircle2 } from 'lucide-react';

interface ConsultantModalProps {
  isOpen: boolean;
  onClose: () => void;
  customMessage?: string;
}

export const ConsultantModal: React.FC<ConsultantModalProps> = ({
  isOpen,
  onClose,
  customMessage,
}) => {
  if (!isOpen) return null;

  const { brand } = contentData;
  const { consultant } = brand;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden p-6 sm:p-7">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          title="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-blue-50 text-[#005baa] flex items-center justify-center mb-4 ring-4 ring-blue-100">
            <User className="w-8 h-8" />
          </div>

          <h3 className="text-lg font-bold text-slate-900">
            Chuyên viên tư vấn trực tiếp
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Hỗ trợ khách hàng tại quầy giao dịch VietinBank
          </p>
        </div>

        {customMessage ? (
          <div className="mt-4 p-3.5 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs sm:text-sm leading-relaxed">
            {customMessage}
          </div>
        ) : (
          <div className="mt-4 p-3.5 rounded-xl bg-blue-50/70 border border-blue-200/60 text-slate-700 text-xs sm:text-sm leading-relaxed">
            {brand.feedbackMessages.notOk}
          </div>
        )}

        <div className="mt-5 bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">Chuyên viên tư vấn:</span>
            <span className="text-sm font-bold text-slate-900">{consultant.name}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">Chức vụ:</span>
            <span className="text-xs font-medium text-slate-700">{consultant.title}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">Đơn vị:</span>
            <span className="text-xs font-medium text-[#005baa]">{consultant.branch}</span>
          </div>

          <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-600">Số điện thoại:</span>
            <a
              href={`tel:${consultant.phone.replace(/\./g, '')}`}
              className="text-base font-extrabold text-[#ed1c24] hover:underline"
            >
              {consultant.phone}
            </a>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-2.5">
          <a
            href={`tel:${consultant.phone.replace(/\./g, '')}`}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold text-white bg-[#ed1c24] hover:bg-[#c41219] rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Phone className="w-4 h-4" />
            <span>Gọi trực tiếp ({consultant.phone})</span>
          </a>

          <button
            onClick={onClose}
            className="w-full px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            Đã hiểu, quay lại màn hình
          </button>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import contentData from '../../data/contentData.json';
import { Sparkles, HeartHandshake, CheckCircle2, RotateCcw, X } from 'lucide-react';

interface EndConversationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRestartSession: () => void;
}

export const EndConversationModal: React.FC<EndConversationModalProps> = ({
  isOpen,
  onClose,
  onRestartSession,
}) => {
  if (!isOpen) return null;

  const { brand } = contentData;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden text-center p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          title="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon & Brand badge */}
        <div className="mx-auto w-16 h-16 rounded-full bg-red-50 text-[#ed1c24] flex items-center justify-center mb-5 ring-8 ring-red-50/50">
          <HeartHandshake className="w-8 h-8" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-[#005baa] mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>VietinBank đồng hành cùng Quý khách</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Cảm ơn Quý khách!
        </h3>

        <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200/70 text-slate-800 text-base sm:text-lg font-medium leading-relaxed">
          “{brand.feedbackMessages.thankYouEnd}”
        </div>

        <p className="mt-4 text-xs text-slate-500 leading-relaxed">
          Nếu cần thêm thông tin hoặc giao dịch tiếp theo, Quý khách luôn có thể liên hệ Chuyên viên tư vấn{' '}
          <strong className="text-slate-700">{brand.consultant.name}</strong> qua số hotline:{' '}
          <a
            href={`tel:${brand.consultant.phone.replace(/\./g, '')}`}
            className="font-bold text-[#ed1c24] hover:underline"
          >
            {brand.consultant.phone}
          </a>
        </p>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onRestartSession}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-[#005baa] hover:bg-[#004b87] rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Bắt đầu phiên mới</span>
          </button>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 text-sm font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            Đóng thông báo
          </button>
        </div>
      </div>
    </div>
  );
};

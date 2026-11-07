import React, { useState } from 'react';
import contentData from '../../data/contentData.json';
import { FaqItem, ModuleId } from '../../types';
import {
  KeyRound,
  CreditCard,
  ShieldCheck,
  Fingerprint,
  ChevronRight,
  ChevronLeft,
  Youtube,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  LogOut,
  ExternalLink,
  HelpCircle,
  Sparkles,
  Maximize2,
  X,
  Phone,
} from 'lucide-react';

interface FaqModuleProps {
  onBackToMenu: () => void;
  onOpenEndConversation: () => void;
  onOpenConsultantWithMessage: (msg: string) => void;
}

export const FaqModule: React.FC<FaqModuleProps> = ({
  onBackToMenu,
  onOpenEndConversation,
  onOpenConsultantWithMessage,
}) => {
  const { faq, brand } = contentData;
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [feedbackGiven, setFeedbackGiven] = useState<'ok' | 'not-ok' | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const selectedTopic = faq.categories.find((c) => c.id === selectedTopicId);

  const handleSelectTopic = (topicId: string) => {
    setSelectedTopicId(topicId);
    setCurrentStepIndex(0);
    setFeedbackGiven(null);
  };

  const handleFeedback = (status: 'ok' | 'not-ok') => {
    setFeedbackGiven(status);
    if (status === 'not-ok') {
      onOpenConsultantWithMessage(brand.feedbackMessages.notOk);
    }
  };

  const getTopicIcon = (id: string) => {
    switch (id) {
      case 'forgot-password':
        return KeyRound;
      case 'close-card':
        return CreditCard;
      case 'verify-cccd':
        return ShieldCheck;
      case 'biometric-update':
      default:
        return Fingerprint;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Lightbox Modal */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm cursor-zoom-out"
          onClick={() => setLightboxImage(null)}
        >
          <div className="relative max-w-3xl max-h-[90vh] overflow-hidden rounded-2xl bg-white p-2">
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-slate-900/70 text-white rounded-full hover:bg-slate-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={lightboxImage}
              alt="Ảnh phóng to"
              className="w-full h-auto max-h-[85vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}

      {/* Main Container */}
      {!selectedTopic ? (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Header prompt */}
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-[#005baa] mb-3">
              <HelpCircle className="w-4 h-4" />
              <span>Giải đáp thắc mắc dịch vụ trực tuyến</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {faq.question}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Chọn nội dung Quý khách cần hỗ trợ để xem hướng dẫn từng bước chi tiết kèm hình ảnh minh họa
            </p>
          </div>

          {/* 4 Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {faq.categories.map((cat, idx) => {
              const Icon = getTopicIcon(cat.id);
              return (
                <div
                  key={cat.id}
                  onClick={() => handleSelectTopic(cat.id)}
                  className="group relative bg-white rounded-2xl p-6 border border-slate-200/90 hover:border-[#005baa] shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#005baa] group-hover:bg-[#005baa] group-hover:text-white flex items-center justify-center transition-colors">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-bold text-slate-400 group-hover:text-[#005baa]">
                        Mục 0{idx + 1}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#005baa] transition-colors">
                        {cat.title}
                      </h3>
                      <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                        {cat.desc}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#005baa]">
                    <span>{cat.steps.length} bước hướng dẫn có ảnh</span>
                    <span className="inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Xem ngay <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Consultation Callout */}
          <div className="bg-gradient-to-r from-blue-50 via-slate-50 to-red-50 rounded-2xl p-6 border border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#005baa] text-white flex items-center justify-center shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Cần chuyên viên giải đáp trực tiếp tại quầy?
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Chuyên viên {brand.consultant.name} luôn sẵn sàng hỗ trợ Quý khách
                </p>
              </div>
            </div>
            <a
              href={`tel:${brand.consultant.phone.replace(/\./g, '')}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#ed1c24] hover:bg-[#c41219] text-white text-xs font-bold shadow-xs transition-colors whitespace-nowrap cursor-pointer"
            >
              <Phone className="w-4 h-4" />
              <span>Gọi hotline: {brand.consultant.phone}</span>
            </a>
          </div>
        </div>
      ) : (
        /* Step-by-Step Guide View */
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Top Bar with Back action */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200">
            <button
              onClick={() => setSelectedTopicId(null)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Trở về danh sách câu hỏi</span>
            </button>

            <div className="text-right">
              <span className="text-xs font-bold text-[#005baa] uppercase tracking-wider">
                {selectedTopic.title}
              </span>
              <div className="text-xs text-slate-500">
                Bước {currentStepIndex + 1} trên tổng số {selectedTopic.steps.length} bước
              </div>
            </div>
          </div>

          {/* Step Progress Indicators */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="text-xs font-semibold text-slate-500">
                Tiến trình thực hiện:
              </div>
              <div className="text-xs font-bold text-[#005baa]">
                {Math.round(((currentStepIndex + 1) / selectedTopic.steps.length) * 100)}%
              </div>
            </div>

            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-5">
              <div
                className="bg-[#005baa] h-full transition-all duration-300"
                style={{
                  width: `${((currentStepIndex + 1) / selectedTopic.steps.length) * 100}%`,
                }}
              />
            </div>

            {/* Quick Step Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar">
              {selectedTopic.steps.map((st, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentStepIndex(i)}
                  className={`px-3 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    i === currentStepIndex
                      ? 'bg-[#005baa] text-white shadow-xs'
                      : i < currentStepIndex
                      ? 'bg-blue-50 text-[#005baa] hover:bg-blue-100'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  Bước {i + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Current Step Content Box */}
          {(() => {
            const step = selectedTopic.steps[currentStepIndex];
            return (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="p-6 sm:p-8 space-y-6">
                  {/* Step Title & Instruction Text */}
                  <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-100/70 text-[#005baa]">
                      <span>BƯỚC {step.step}</span>
                      <span>·</span>
                      <span>{step.title}</span>
                    </div>

                    <p className="text-base sm:text-lg font-medium text-slate-800 leading-relaxed whitespace-pre-line">
                      {step.text}
                    </p>
                  </div>

                  {/* Step Illustrative Image */}
                  <div className="relative group rounded-xl border border-slate-200 bg-slate-50 p-2 overflow-hidden flex flex-col items-center justify-center">
                    <img
                      src={step.image}
                      alt={`Minh họa bước ${step.step}`}
                      className="max-h-[360px] sm:max-h-[420px] w-auto object-contain rounded-lg shadow-xs transition-transform group-hover:scale-[1.01]"
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.style.display = 'none';
                        const fallback = target.parentElement?.querySelector('.step-img-fallback') as HTMLElement;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />

                    <div className="step-img-fallback hidden flex-col items-center justify-center py-12 px-6 text-center">
                      <HelpCircle className="w-12 h-12 text-slate-300 mb-2" />
                      <span className="text-xs font-medium text-slate-500">
                        Hình ảnh minh họa bước {step.step} ({selectedTopic.title})
                      </span>
                    </div>

                    {/* Magnify button */}
                    <button
                      onClick={() => setLightboxImage(step.image)}
                      className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/70 hover:bg-slate-900 text-white text-xs font-medium backdrop-blur-xs transition-opacity cursor-pointer"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>Xem ảnh lớn</span>
                    </button>
                  </div>

                  {/* Next / Prev Controls */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <button
                      onClick={() => setCurrentStepIndex((prev) => Math.max(0, prev - 1))}
                      disabled={currentStepIndex === 0}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Bước trước</span>
                    </button>

                    <span className="text-xs text-slate-400 font-medium">
                      {currentStepIndex + 1} / {selectedTopic.steps.length}
                    </span>

                    <button
                      onClick={() =>
                        setCurrentStepIndex((prev) =>
                          Math.min(selectedTopic.steps.length - 1, prev + 1)
                        )
                      }
                      disabled={currentStepIndex === selectedTopic.steps.length - 1}
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold rounded-xl text-white bg-[#005baa] hover:bg-[#004b87] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer shadow-xs"
                    >
                      <span>Bước tiếp theo</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Video Guide Link Section */}
                <div className="bg-slate-50 px-6 sm:px-8 py-5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-100 text-[#ed1c24] flex items-center justify-center shrink-0">
                      <Youtube className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-900">
                        Video hướng dẫn trực quan trên YouTube
                      </h5>
                      <p className="text-[11px] text-slate-500">
                        Xem video thao tác thực tế từng giây trên ứng dụng iPay
                      </p>
                    </div>
                  </div>

                  <a
                    href={selectedTopic.videoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#ed1c24] hover:bg-[#c41219] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                  >
                    <Youtube className="w-4 h-4" />
                    <span>Xem video YouTube</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })()}

          {/* Feedback & Decision Section: "Anh/chị đang thực hiện ổn hay chưa?" */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4">
            <div className="text-center">
              <h4 className="text-base font-bold text-slate-900">
                Anh/chị đang thực hiện ổn hay chưa?
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Phản hồi của Quý khách giúp chúng tôi nâng cao chất lượng hướng dẫn
              </p>
            </div>

            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => handleFeedback('ok')}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  feedbackGiven === 'ok'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                }`}
              >
                <ThumbsUp className="w-4 h-4" />
                <span>Đã ổn rồi</span>
              </button>

              <button
                onClick={() => handleFeedback('not-ok')}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  feedbackGiven === 'not-ok'
                    ? 'bg-[#ed1c24] text-white shadow-xs'
                    : 'bg-red-50 text-[#ed1c24] hover:bg-red-100 border border-red-200'
                }`}
              >
                <ThumbsDown className="w-4 h-4" />
                <span>Chưa ổn, cần hỗ trợ</span>
              </button>
            </div>

            {/* If feedback was OK */}
            {feedbackGiven === 'ok' && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center animate-in fade-in duration-200">
                <p className="text-xs font-semibold text-emerald-800">
                  Tuyệt vời! Quý khách có thể quay lại menu chính để khám phá thêm dịch vụ hoặc kết thúc cuộc trò chuyện.
                </p>
              </div>
            )}

            {/* Bottom Actions: Quay lại menu chính & Kết thúc cuộc trò chuyện */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={onBackToMenu}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-slate-600" />
                <span>Quay lại menu chính</span>
              </button>

              <button
                onClick={onOpenEndConversation}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-[#ed1c24] border border-red-200 text-xs font-bold transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-[#ed1c24]" />
                <span>Kết thúc cuộc trò chuyện</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

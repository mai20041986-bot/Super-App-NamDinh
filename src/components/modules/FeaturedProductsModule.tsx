import React, { useState } from 'react';
import contentData from '../../data/contentData.json';
import { FeaturedProduct } from '../../types';
import {
  Sparkles,
  Heart,
  ChevronLeft,
  ChevronRight,
  Phone,
  LayoutGrid,
  Maximize2,
  X,
  CheckCircle2,
  Tag,
} from 'lucide-react';

interface FeaturedProductsModuleProps {
  onBackToMenu: () => void;
  onOpenConsultantWithMessage: (msg: string) => void;
}

export const FeaturedProductsModule: React.FC<FeaturedProductsModuleProps> = ({
  onBackToMenu,
  onOpenConsultantWithMessage,
}) => {
  const { featured, brand } = contentData;
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('carousel');
  const [activeCarouselIndex, setActiveCarouselIndex] = useState<number>(0);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [interestedModalProduct, setInterestedModalProduct] = useState<FeaturedProduct | null>(null);

  // Filter items
  const filteredItems = (featured.items as FeaturedProduct[]).filter((item) => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  const handleInterestClick = (item: FeaturedProduct) => {
    setInterestedModalProduct(item);
  };

  const handlePrevCarousel = () => {
    setActiveCarouselIndex((prev) =>
      prev === 0 ? filteredItems.length - 1 : prev - 1
    );
  };

  const handleNextCarousel = () => {
    setActiveCarouselIndex((prev) =>
      prev === filteredItems.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Lightbox */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm cursor-zoom-out"
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
              alt="Poster lớn"
              className="w-full h-auto max-h-[85vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}

      {/* Interested Modal */}
      {interestedModalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden p-6 sm:p-7 text-center space-y-4">
            <button
              onClick={() => setInterestedModalProduct(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mx-auto w-14 h-14 rounded-full bg-red-50 text-[#ed1c24] flex items-center justify-center ring-4 ring-red-100">
              <Heart className="w-7 h-7 fill-current" />
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#005baa]">
                Ghi nhận quan tâm sản phẩm
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                {interestedModalProduct.title}
              </h3>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/60 text-slate-700 text-xs sm:text-sm leading-relaxed text-left whitespace-pre-line font-medium">
              {brand.feedbackMessages.productInterested}
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <a
                href={`tel:${brand.consultant.phone.replace(/\./g, '')}`}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-[#ed1c24] hover:bg-[#c41219] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>Gọi chuyên viên tư vấn: {brand.consultant.phone}</span>
              </a>

              <button
                onClick={() => setInterestedModalProduct(null)}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                Đóng thông báo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-[#ed1c24] border border-red-200/60 mb-3">
          <Sparkles className="w-4 h-4" />
          <span>Sản phẩm & Dịch vụ Nổi Bật Tại Chi Nhánh</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {featured.title}
        </h2>
        <p className="mt-2 text-sm text-slate-500 leading-relaxed">
          {featured.description}
        </p>
      </div>

      {/* Filter Chips Bar (As instructed: Tất cả | Cá nhân | Hộ kinh doanh | Doanh nghiệp | Ưu đãi | Đấu giá) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 no-scrollbar">
          {featured.categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setActiveCarouselIndex(0);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#005baa] text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* View Mode Toggle: Carousel vs Grid */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl shrink-0 self-end sm:self-auto">
          <button
            onClick={() => setViewMode('carousel')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'carousel'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Dạng Carousel
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Dạng Lưới ({filteredItems.length})
          </button>
        </div>
      </div>

      {/* Display Content */}
      {filteredItems.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 space-y-2">
          <Tag className="w-8 h-8 mx-auto text-slate-400" />
          <p className="text-sm font-medium">Chưa có sản phẩm nào trong nhóm này.</p>
        </div>
      ) : viewMode === 'carousel' ? (
        /* Poster Dạng Carousel (Theo đúng gợi ý trải nghiệm ngân hàng hiện đại trong PDF) */
        <div className="relative max-w-3xl mx-auto">
          {(() => {
            const currentItem = filteredItems[activeCarouselIndex] || filteredItems[0];
            return (
              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md overflow-hidden flex flex-col items-center">
                {/* Poster Image Area */}
                <div className="relative w-full bg-slate-900/5 min-h-[380px] sm:min-h-[460px] flex items-center justify-center p-4">
                  <img
                    src={currentItem.image}
                    alt={currentItem.title}
                    className="max-h-[460px] w-auto max-w-full object-contain rounded-2xl shadow-sm transition-transform hover:scale-[1.01]"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.style.display = 'none';
                      const fallback = target.parentElement?.querySelector('.poster-fallback') as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />

                  {/* Fallback frame */}
                  <div className="poster-fallback hidden flex-col items-center justify-center p-10 text-center bg-blue-50/50 rounded-2xl w-full max-w-md">
                    <Sparkles className="w-12 h-12 text-[#005baa] mb-2" />
                    <h4 className="text-sm font-bold text-slate-800">
                      {currentItem.title}
                    </h4>
                    <span className="text-xs text-slate-500 mt-1">
                      {currentItem.shortSummary}
                    </span>
                  </div>

                  {/* Magnify button */}
                  <button
                    onClick={() => setLightboxImage(currentItem.image)}
                    className="absolute top-6 right-6 p-2 rounded-xl bg-slate-900/60 hover:bg-slate-900 text-white backdrop-blur-xs transition-colors cursor-pointer"
                    title="Phóng to poster"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>

                  {/* Category Pill */}
                  <div className="absolute top-6 left-6 px-3 py-1 rounded-full text-xs font-bold bg-[#005baa] text-white shadow-xs">
                    {currentItem.tag}
                  </div>
                </div>

                {/* Card Details & Action */}
                <div className="w-full p-6 sm:p-8 bg-white border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-1 text-center sm:text-left">
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                      {currentItem.title}
                    </h3>
                    <p className="text-xs text-slate-500 max-w-md">
                      {currentItem.shortSummary}
                    </p>
                  </div>

                  <button
                    onClick={() => handleInterestClick(currentItem)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[#ed1c24] hover:bg-[#c41219] text-white text-xs font-bold shadow-xs transition-all hover:scale-105 cursor-pointer whitespace-nowrap"
                  >
                    <Heart className="w-4 h-4 fill-white" />
                    <span>Tôi quan tâm</span>
                  </button>
                </div>
              </div>
            );
          })()}

          {/* Carousel Arrows */}
          {filteredItems.length > 1 && (
            <div className="flex items-center justify-between mt-4">
              <button
                onClick={handlePrevCarousel}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 shadow-2xs transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Poster trước</span>
              </button>

              <div className="flex items-center gap-1.5">
                {filteredItems.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveCarouselIndex(idx)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      activeCarouselIndex === idx
                        ? 'w-6 bg-[#005baa]'
                        : 'w-2 bg-slate-300 hover:bg-slate-400'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={handleNextCarousel}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 shadow-2xs transition-colors cursor-pointer"
              >
                <span>Poster sau</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Poster Dạng Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
            >
              <div className="relative bg-slate-50 p-3 min-h-[260px] flex items-center justify-center">
                <img
                  src={item.image}
                  alt={item.title}
                  className="max-h-[240px] w-auto max-w-full object-contain rounded-xl"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.style.display = 'none';
                    const fallback = target.parentElement?.querySelector('.grid-fallback') as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
                <div className="grid-fallback hidden flex-col items-center justify-center p-6 text-center">
                  <Sparkles className="w-8 h-8 text-[#005baa] mb-1" />
                  <span className="text-xs font-bold text-slate-800">{item.title}</span>
                </div>

                <div className="absolute top-4 left-4 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#005baa] text-white">
                  {item.tag}
                </div>
              </div>

              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                  <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                    {item.shortSummary}
                  </p>
                </div>

                <button
                  onClick={() => handleInterestClick(item)}
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-red-50 hover:bg-[#ed1c24] text-[#ed1c24] hover:text-white border border-red-200 text-xs font-bold transition-colors cursor-pointer"
                >
                  <Heart className="w-3.5 h-3.5" />
                  <span>Tôi quan tâm</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

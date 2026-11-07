import React, { useState } from 'react';
import contentData from '../../data/contentData.json';
import { BranchOffice } from '../../types';
import {
  MapPin,
  Phone,
  Clock,
  ExternalLink,
  Search,
  Building2,
  Navigation,
  Maximize2,
  X,
  Compass,
} from 'lucide-react';

interface BranchesModuleProps {
  onBackToMenu: () => void;
}

export const BranchesModule: React.FC<BranchesModuleProps> = ({ onBackToMenu }) => {
  const { branchesData } = contentData;
  const [selectedProvinceId, setSelectedProvinceId] = useState<string>('nam-dinh');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Current branch list
  const branchList: BranchOffice[] =
    (branchesData.branches as Record<string, BranchOffice[]>)[selectedProvinceId] || [];

  // Filtered by search query
  const filteredOffices = branchList.filter((office) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      office.name.toLowerCase().includes(q) ||
      office.address.toLowerCase().includes(q) ||
      office.phone.includes(q)
    );
  });

  const selectedProvinceName =
    branchesData.availableProvinces.find((p) => p.id === selectedProvinceId)?.name ||
    'Nam Định';

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
              alt="Ảnh trụ sở phòng giao dịch"
              className="w-full h-auto max-h-[85vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-[#005baa] mb-3">
          <MapPin className="w-4 h-4" />
          <span>Mạng lưới 155 Chi nhánh VietinBank toàn quốc</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Tra cứu Điểm giao dịch & Phòng giao dịch
        </h2>
        <p className="mt-2 text-sm text-slate-500 leading-relaxed">
          Tìm kiếm địa chỉ, gọi hotline trực tiếp và nhận chỉ đường nhanh qua Google Maps
        </p>
      </div>

      {/* Working Hours Card (Highlighted Banner) */}
      <div className="bg-gradient-to-r from-blue-900 to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/10 text-amber-300 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-300">
              Khung giờ phục vụ tại quầy
            </span>
            <h4 className="text-base sm:text-lg font-bold text-white mt-0.5">
              Thời gian giao dịch tiêu chuẩn
            </h4>
            <div className="text-xs text-slate-300 mt-1 space-y-0.5">
              <div>• {branchesData.workingHours.weekdays}</div>
              <div className="text-amber-300">• {branchesData.workingHours.weekend}</div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right hidden sm:block">
            <span className="text-[11px] text-slate-400 block">Tổng đài CSKH 24/7</span>
            <a
              href="tel:1900558868"
              className="text-base font-extrabold text-amber-400 hover:underline"
            >
              1900 558 868
            </a>
          </div>
        </div>
      </div>

      {/* Province Selectors & Search Controls */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Chọn tỉnh / Thành phố
            </h3>
            <p className="text-xs text-slate-500">
              Danh sách các chi nhánh trọng điểm của VietinBank
            </p>
          </div>

          {/* Quick Search */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo tên PGD hoặc đường..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:border-[#005baa] focus:ring-2 focus:ring-blue-100 focus:outline-hidden"
            />
          </div>
        </div>

        {/* Available Provinces Buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
          {branchesData.availableProvinces.map((prov) => {
            const isSelected = selectedProvinceId === prov.id;
            return (
              <button
                key={prov.id}
                onClick={() => {
                  setSelectedProvinceId(prov.id);
                  setSearchQuery('');
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#005baa] text-white shadow-xs'
                    : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>{prov.name}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {prov.branchCount}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Branch List (Grid of Offices) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800">
            Danh sách điểm giao dịch tại {selectedProvinceName} ({filteredOffices.length} địa điểm)
          </h3>
          <span className="text-xs text-slate-400">
            Bấm vào số điện thoại để gọi ngay hoặc icon bản đồ để chỉ đường
          </span>
        </div>

        {filteredOffices.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500">
            Không tìm thấy phòng giao dịch phù hợp với từ khóa "{searchQuery}".
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOffices.map((office) => (
              <div
                key={office.stt}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
              >
                {/* Office Image */}
                <div className="relative bg-slate-100 h-48 w-full overflow-hidden flex items-center justify-center">
                  <img
                    src={office.image}
                    alt={office.name}
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.style.display = 'none';
                      const fallback = target.parentElement?.querySelector('.office-img-fallback') as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />

                  {/* Fallback frame */}
                  <div className="office-img-fallback hidden w-full h-full flex-col items-center justify-center bg-blue-50/70 p-4 text-center">
                    <Building2 className="w-10 h-10 text-[#005baa] mb-1" />
                    <span className="text-xs font-bold text-slate-800">{office.name}</span>
                  </div>

                  {/* Office Type Tag */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-900/80 text-white backdrop-blur-xs">
                    {office.type}
                  </div>

                  {/* STT badge */}
                  <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[#005baa] text-white text-[11px] font-bold flex items-center justify-center shadow-xs">
                    {office.stt}
                  </div>

                  {/* Magnify button */}
                  <button
                    onClick={() => setLightboxImage(office.image)}
                    className="absolute bottom-3 right-3 p-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white backdrop-blur-xs transition-colors cursor-pointer"
                    title="Xem ảnh lớn"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Office Details */}
                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h4 className="text-base font-bold text-slate-900">
                      {office.name}
                    </h4>

                    {/* Address with Google Maps link */}
                    <div className="flex items-start gap-2 text-xs text-slate-600 leading-relaxed">
                      <MapPin className="w-4 h-4 text-[#ed1c24] shrink-0 mt-0.5" />
                      <span>{office.address}</span>
                    </div>

                    {/* Hotline clickable link */}
                    <div className="flex items-center gap-2 text-xs pt-1">
                      <Phone className="w-3.5 h-3.5 text-[#005baa] shrink-0" />
                      <span className="text-slate-500 font-medium">Hotline:</span>
                      <a
                        href={`tel:${office.phone.replace(/\./g, '')}`}
                        className="font-bold text-[#ed1c24] hover:underline"
                        title="Bấm để gọi ngay"
                      >
                        {office.phone}
                      </a>
                    </div>
                  </div>

                  {/* Action: Google Maps & Call */}
                  <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                    <a
                      href={office.googleMapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#005baa] text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Google Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>

                    <a
                      href={`tel:${office.phone.replace(/\./g, '')}`}
                      className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#ed1c24] hover:bg-[#c41219] text-white text-xs font-bold transition-colors cursor-pointer"
                      title="Gọi điện trực tiếp"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Gọi</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

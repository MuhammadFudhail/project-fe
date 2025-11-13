import React from 'react';

const InfoCard = ({ icon, label, value, color }) => {
  return (
    <div className="bg-white shadow-sm rounded-lg p-4 flex items-center gap-4">
      {/* Icon atau indikator warna */}
      <div className={`w-4 h-4 md:w-5 md:h-5 ${color} rounded-full flex-shrink-0`} />

      {/* Konten utama */}
      <div>
        <p className="text-sm md:text-base font-semibold text-black">{value}</p>
        <p className="text-xs md:text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
};

export default InfoCard;
//kode untuk bagian dashboard atas
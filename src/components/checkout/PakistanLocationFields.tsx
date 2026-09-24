'use client';

import React from 'react';
import { Globe2 } from 'lucide-react';
import {
  getProvinces,
  getDistricts,
  getTehsils,
  findProvinceByName,
  findDistrictByName,
  findTehsilByName,
  postalCodeFor,
} from '@/lib/data/pakLocations';

export interface LocationSelection {
  province: string;
  district: string;
  tehsil: string;
  postalCode: string;
}

interface Props {
  value: LocationSelection;
  onChange: (selection: LocationSelection) => void;
}

const selectClass =
  'w-full px-3.5 py-2.5 rounded-xl border border-[#d6e2d3] text-xs font-semibold text-[#38b000] bg-white focus:ring-2 focus:ring-[#38b000] focus:outline-none';
const labelClass = 'block text-xs font-bold text-[#172b21] mb-1';
const hintClass = 'text-[10px] text-[#9fb3a5] mt-1';

export default function PakistanLocationFields({ value, onChange }: Props) {
  const province = findProvinceByName(value.province);
  const district = province ? findDistrictByName(value.district, province.id) : undefined;
  const tehsil = district ? findTehsilByName(value.tehsil, district.id) : undefined;

  const districts = province ? getDistricts(province.id) : [];
  const tehsils = district ? getTehsils(district.id) : [];

  const handleProvince = (en: string) => {
    const next = findProvinceByName(en);
    if (!next) return;
    onChange({ province: next.name.en, district: '', tehsil: '', postalCode: '' });
  };

  const handleDistrict = (en: string) => {
    if (!province) return;
    const next = findDistrictByName(en, province.id);
    if (!next) return;
    onChange({
      ...value,
      district: next.name.en,
      tehsil: '',
      postalCode: postalCodeFor(next),
    });
  };

  const handleTehsil = (en: string) => {
    if (!district) return;
    const next = findTehsilByName(en, district.id);
    if (!next) return;
    onChange({
      ...value,
      tehsil: next.name.en,
      postalCode: postalCodeFor(next) || postalCodeFor(district) || value.postalCode,
    });
  };

  return (
    <div>
      <div className="flex items-center gap-1.5 text-[10px] font-semibold text-[#52685a] bg-[#f4f7f2] rounded-xl px-3 py-2 mb-4">
        <Globe2 className="w-3.5 h-3.5 text-[#38b000]" />
        <span>Locations powered by Pakistan Admin Data (Open Admin Data API)</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Province *</label>
          <select
            required
            value={value.province}
            onChange={(e) => handleProvince(e.target.value)}
            className={selectClass}
          >
            <option value="" disabled>
              Select your Province
            </option>
            {getProvinces().map((p) => (
              <option key={p.id} value={p.name.en}>
                {p.name.en}
              </option>
            ))}
          </select>
          <p className={hintClass}>e.g. Punjab, Sindh, Khyber Pakhtunkhwa</p>
        </div>

        <div>
          <label className={labelClass}>District / City *</label>
          <select
            required
            value={value.district}
            onChange={(e) => handleDistrict(e.target.value)}
            disabled={!province}
            className={selectClass}
          >
            <option value="" disabled>
              {province ? 'Select your District' : 'Select Province first'}
            </option>
            {districts.map((d) => (
              <option key={d.id} value={d.name.en}>
                {d.name.en}
              </option>
            ))}
          </select>
          <p className={hintClass}>
            {province ? `${districts.length} districts in ${province.name.en}` : 'Province unlocks the district list'}
          </p>
        </div>

        <div>
          <label className={labelClass}>Tehsil / Area *</label>
          <select
            required
            value={value.tehsil}
            onChange={(e) => handleTehsil(e.target.value)}
            disabled={!district}
            className={selectClass}
          >
            <option value="" disabled>
              {district ? 'Select your Tehsil' : 'Select District first'}
            </option>
            {tehsils.map((t) => (
              <option key={t.id} value={t.name.en}>
                {t.name.en}
              </option>
            ))}
          </select>
          <p className={hintClass}>
            {district ? `${tehsils.length} tehsils in ${district.name.en}` : 'District unlocks the tehsil list'}
          </p>
        </div>

        <div>
          <label className={labelClass}>Postal / Zip Code</label>
          <input
            type="text"
            inputMode="numeric"
            value={value.postalCode}
            onChange={(e) => onChange({ ...value, postalCode: e.target.value.replace(/[^\d]/g, '') })}
            placeholder="Auto-filled from Tehsil"
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#d6e2d3] text-xs focus:ring-2 focus:ring-[#38b000] focus:outline-none"
          />
          <p className={hintClass}>{tehsil ? `Zip for ${tehsil.name.en}: ${value.postalCode || postalCodeFor(tehsil)}` : 'Auto-filled once Tehsil is selected'}</p>
        </div>
      </div>
    </div>
  );
}
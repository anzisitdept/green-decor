import provincesJSON from '@/data/pak/provinces.json';
import districtsJSON from '@/data/pak/districts.json';
import tehsilsJSON from '@/data/pak/tehsils.json';

export interface PakRegionName {
  local: string;
  en: string;
  slug?: string;
}

export interface PakRegionRef {
  id: string;
  level: number;
  name: PakRegionName;
}

export interface PakRegion {
  id: string;
  level: number;
  level_name: {
    local: string;
    en: string;
  };
  name: PakRegionName;
  code?: {
    id: string;
    iso: string | null;
  };
  parent?: PakRegionRef | null;
  ancestors?: PakRegionRef[];
  children_count?: Record<string, number>;
  zip_codes: string[];
  geo?: {
    lat: string;
    lon: string;
  };
}

const provinces: PakRegion[] = provincesJSON as PakRegion[];
const districts: PakRegion[] = districtsJSON as PakRegion[];
const tehsils: PakRegion[] = tehsilsJSON as PakRegion[];

export function getProvinces(): PakRegion[] {
  return provinces;
}

export function getDistricts(provinceId?: string | null): PakRegion[] {
  if (!provinceId) return [];
  return districts.filter((d) => d.parent?.id === provinceId);
}

export function getTehsils(districtId?: string | null): PakRegion[] {
  if (!districtId) return [];
  return tehsils.filter((t) => t.parent?.id === districtId);
}

export function findProvinceByName(name?: string | null): PakRegion | undefined {
  if (!name) return undefined;
  const key = name.trim().toLowerCase();
  return provinces.find((p) => p.name.en.toLowerCase() === key);
}

export function findDistrictByName(name?: string | null, provinceId?: string | null): PakRegion | undefined {
  if (!name) return undefined;
  const key = name.trim().toLowerCase();
  return getDistricts(provinceId).find((d) => d.name.en.toLowerCase() === key);
}

export function findTehsilByName(name?: string | null, districtId?: string | null): PakRegion | undefined {
  if (!name) return undefined;
  const key = name.trim().toLowerCase();
  return getTehsils(districtId).find((t) => t.name.en.toLowerCase() === key);
}

export function postalCodeFor(region?: PakRegion | null): string {
  return region?.zip_codes?.[0] ?? '';
}
// Geometry type
export interface Geometry {
  type: string;
  coordinates: number[][][];
}

// Properties type (assuming SIG_KOR_NM is for name and SIG_CD is a code)
export interface Properties {
  EMD_CD: string; // 코드
  EMD_ENG_NM: string; // 영문 이름
  EMD_KOR_NM: string; // 한글 이름
}

// Feature type
export interface Feature {
  type: string;
  geometry: Geometry;
  properties: Properties;
}

// The main structure of the Sido data
export interface SidoData {
  type: string;
  bbox: number[];
  features: Feature[];
}

export interface Pollutants {
  [key: string]: number;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  pollutants: Pollutants;
}

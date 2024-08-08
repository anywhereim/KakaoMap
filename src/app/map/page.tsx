"use client";

import Map from "@/components/Map";
import Script from "next/script";

/* global kakao */

declare global {
  interface Window {
    kakao: any;
  }
}

export default function MapPage() {
  return <Map />;
}

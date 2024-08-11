"use client";

import Map from "@/components/Map";
import TestMap from "@/components/Map/TestMap";
import Script from "next/script";

/* global kakao */

declare global {
  interface Window {
    kakao: any;
  }
}

export default function MapPage() {
  return <TestMap />;
}

"use client";

import Script from "next/script";

/* global kakao */

declare global {
  interface Window {
    kakao: any;
  }
}

export default function MiniMap() {
  // @see - https://apis.map.kakao.com/web/documentation/#load
  const loadKakaoMap = () => {
    window.kakao.maps.load(() => {
      const mapContainer = document.getElementById("minimap");
      //지도를 생성할 때 필요한 기본 옵션
      const mapOption = {
        //지도의 중심좌표.
        center: new window.kakao.maps.LatLng(33.450701, 126.570667),
        //지도의 레벨(확대, 축소 정도)
        level: 7,
        // 지도의 최소 레벨 (옵션)
        minLevel: 7,
        // 지도의 최대 레벨 (옵션)
        maxLevel: 13,
      };
      new window.kakao.maps.Map(mapContainer, mapOption);
    });
  };

  return (
    <>
      <Script
        strategy="afterInteractive"
        type="text/javascript"
        src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_CLIENT}&autoload=false`}
        onReady={loadKakaoMap}
      />
      <div className="w-96 h-96 whitespace-nowrap">
        <div id="minimap" className="w-full h-full" />
      </div>
    </>
  );
}

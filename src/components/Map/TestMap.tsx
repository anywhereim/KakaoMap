"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import emdData from "../../../public/data/emd.json";
import airData from "../../../public/data/korean_pollutant_data.json";
import {
  Feature,
  LocationData,
  SidoData,
} from "@/types/location/useLocationType";

/* global kakao */

declare global {
  interface Window {
    kakao: any;
  }
}

export default function TestMap() {
  const [selectedPollutant, setSelectedPollutant] = useState<string>("PM_10"); // 초기값을 PM_10으로 설정

  // 오염물질에 따른 클래스 설정
  const pollutantClassMap: { [key: string]: string } = {
    "SO₂": "bg-red-300",
    CO: "bg-orange-300",
    "O₃": "bg-yellow-300",
    "N₂O₃": "bg-green-300",
    PM_10: "bg-blue-300",
    "PM_2.5": "bg-purple-300",
  };

  useEffect(() => {
    const loadKakaoMap = (): void => {
      window.kakao.maps.load((): void => {
        const mapContainer = document.getElementById("testMap") as HTMLElement;

        // 지도 생성 옵션 설정
        const mapOption = {
          center: new window.kakao.maps.LatLng(33.450701, 126.570667),
          level: 12,
          minLevel: 7,
          maxLevel: 13,
        };

        // 지도 생성
        const map = new window.kakao.maps.Map(mapContainer, mapOption);

        // 오염물질 데이터를 지도에 표시하는 함수
        const displayPollutantData = (pollutantKey: string) => {
          // 지도 위의 기존 오버레이를 모두 제거
          mapOverlayList.forEach((overlay) => overlay.setMap(null));
          mapOverlayList = [];

          airData.forEach((locationData: LocationData) => {
            const { latitude, longitude, pollutants } = locationData;
            const value = pollutants[pollutantKey]; // TypeScript가 number로 인식하도록 함

            // key값 없이 오염물질 값만 표시하고, 배경색을 동적으로 설정
            const content = `<div class="rounded-md text-[10px] p-1 border border-black ${pollutantClassMap[pollutantKey]}">${value}</div>`;
            const customOverlay = new window.kakao.maps.CustomOverlay({
              content: content,
              map: map,
              position: new window.kakao.maps.LatLng(latitude, longitude),
              xAnchor: 0.5,
              yAnchor: 1.0,
              zIndex: 3,
            });

            customOverlay.setMap(map);
            mapOverlayList.push(customOverlay);
          });
        };

        let mapOverlayList: any[] = [];

        // 다각형 그리기 함수
        const drawPolygon = (feature: Feature) => {
          const coordinates = feature.geometry.coordinates;
          if (!coordinates || coordinates.length === 0) return;

          coordinates.forEach((polygonCoords) => {
            const polygonPath = polygonCoords.map(
              (coord) => new window.kakao.maps.LatLng(coord[1], coord[0])
            );

            // 폴리곤 객체 생성 (초기에는 투명한 상태)
            const polygon = new window.kakao.maps.Polygon({
              path: polygonPath,
              strokeWeight: 1,
              strokeColor: "transparent",
              strokeStyle: "solid",
              fillColor: "transparent",
              fillOpacity: 0.0,
            });

            polygon.setMap(map);

            // 커스텀 오버레이 생성
            const content = `<div class="bg-white rounded-md text-[10px] p-1 border border-black">${feature.properties.EMD_KOR_NM}</div>`;
            const customOverlay = new window.kakao.maps.CustomOverlay({
              content: content,
              map: map,
              position: new window.kakao.maps.LatLng(
                polygonPath[0].getLat(),
                polygonPath[0].getLng()
              ),
              xAnchor: 0.5,
              yAnchor: 1.0,
              zIndex: 3,
            });

            customOverlay.setMap(null); // 초기에는 숨김

            // 마우스 오버 이벤트 추가
            window.kakao.maps.event.addListener(
              polygon,
              "mouseover",
              function () {
                polygon.setOptions({
                  strokeColor: "#000000",
                  fillColor: "#000000",
                  fillOpacity: 0.2,
                });
                customOverlay.setMap(map); // 오버레이 표시
              }
            );

            // 마우스 아웃 이벤트 추가
            window.kakao.maps.event.addListener(
              polygon,
              "mouseout",
              function () {
                polygon.setOptions({
                  strokeColor: "transparent",
                  fillColor: "transparent",
                  fillOpacity: 0.0,
                });
                customOverlay.setMap(null); // 오버레이 숨김
              }
            );
          });
        };

        // emdData의 모든 Feature에 대해 다각형을 그린다
        const data: SidoData = emdData as SidoData;

        data.features.forEach((feature: Feature): void => {
          if (feature.geometry && feature.geometry.coordinates) {
            drawPolygon(feature);
          }
        });

        // 오염물질 선택에 따라 데이터를 표시
        if (selectedPollutant) {
          displayPollutantData(selectedPollutant);
        }
      });
    };

    loadKakaoMap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // selectedPollutant가 변경될 때마다 지도 업데이트

  return (
    <>
      <Script
        strategy="afterInteractive"
        type="text/javascript"
        src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_CLIENT}&autoload=false`}
      />
      <div className="w-full h-screen relative">
        <div id="testMap" className="w-full h-screen z-10" />
        <div className="absolute flex flex-col top-10 right-10 w-20 z-20">
          <button
            type="button"
            className="flex items-center justify-center bg-red-300 px-4 py-1 rounded-md border"
            onClick={() => setSelectedPollutant("SO₂")}
          >
            SO₂
          </button>
          <button
            type="button"
            className="flex items-center justify-center bg-orange-300 px-4 py-1 rounded-md border mt-1"
            onClick={() => setSelectedPollutant("CO")}
          >
            CO
          </button>
          <button
            type="button"
            className="flex items-center justify-center bg-yellow-300 px-4 py-1 rounded-md border mt-1"
            onClick={() => setSelectedPollutant("O₃")}
          >
            O₃
          </button>
          <button
            type="button"
            className="flex items-center justify-center bg-green-300 px-4 py-1 rounded-md border mt-1"
            onClick={() => setSelectedPollutant("N₂O₃")}
          >
            N₂O₃
          </button>
          <button
            type="button"
            className="flex items-center justify-center bg-blue-300 px-4 py-1 rounded-md border mt-1"
            onClick={() => setSelectedPollutant("PM_10")}
          >
            PM_10
          </button>
          <button
            type="button"
            className="flex items-center justify-center bg-purple-300 px-4 py-1 rounded-md border mt-1"
            onClick={() => setSelectedPollutant("PM_2.5")}
          >
            PM_2.5
          </button>
        </div>
      </div>
    </>
  );
}

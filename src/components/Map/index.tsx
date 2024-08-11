"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";

/* global kakao */

declare global {
  interface Window {
    kakao: any;
  }
}

export default function Map() {
  const mapRef = useRef<any>(null);
  const polygonsRef = useRef<any[]>([]);
  const initialAreasRef = useRef<any[]>([]);
  const detailModeRef = useRef(false);

  const loadData = async (path: string) => {
    const response = await fetch(path);
    const data = await response.json();
    const units = data.features;
    return units.map((unit: any) => {
      const coordinates = unit.geometry.coordinates[0];
      const path = coordinates.map(
        (coordinate: any) =>
          new window.kakao.maps.LatLng(coordinate[1], coordinate[0])
      );

      return {
        name: unit.properties.SIG_KOR_NM,
        location: unit.properties.SIG_CD,
        path,
      };
    });
  };

  useEffect(() => {
    const initializeMap = async () => {
      const initialAreas = await loadData("/data/sido.json");
      initialAreasRef.current = initialAreas;

      window.kakao.maps.load(() => {
        const mapContainer = document.getElementById("map");
        const mapOption = {
          center: new window.kakao.maps.LatLng(37.566826, 126.9786567),
          level: 12,
        };
        const map = new window.kakao.maps.Map(mapContainer, mapOption);
        mapRef.current = map;

        const customOverlay = new window.kakao.maps.CustomOverlay({});
        polygonsRef.current = initialAreas.map((area) =>
          createPolygon(area, map, customOverlay)
        );

        window.kakao.maps.event.addListener(
          map,
          "zoom_changed",
          async function () {
            const level = map.getLevel();
            if (!detailModeRef.current && level <= 10) {
              detailModeRef.current = true;
              updatePolygons("/data/sig.json", map, customOverlay);
            } else if (detailModeRef.current && level > 10) {
              detailModeRef.current = false;
              updatePolygons("/data/sido.json", map, customOverlay);
            }
          }
        );
      });
    };

    const updatePolygons = async (
      dataPath: string,
      map: any,
      customOverlay: any
    ) => {
      removePolygons();
      const newAreas = await loadData(dataPath);
      polygonsRef.current = newAreas.map((area) =>
        createPolygon(area, map, customOverlay)
      );
    };

    initializeMap();
  }, []);

  const createPolygon = (area: any, map: any, customOverlay: any) => {
    const polygon = new window.kakao.maps.Polygon({
      map,
      path: area.path,
      strokeWeight: 1,
      strokeColor: "#000000",
      strokeOpacity: 0.8,
      fillColor: "#97979751",
      fillOpacity: 0.3,
    });

    window.kakao.maps.event.addListener(
      polygon,
      "mouseover",
      function (mouseEvent: any) {
        polygon.setOptions({ fillColor: "#09f" });
        customOverlay.setContent('<div class="area">' + area.name + "</div>");
        customOverlay.setPosition(mouseEvent.latLng);
        customOverlay.setMap(map);
      }
    );

    window.kakao.maps.event.addListener(
      polygon,
      "mousemove",
      function (mouseEvent: any) {
        customOverlay.setPosition(mouseEvent.latLng);
      }
    );

    window.kakao.maps.event.addListener(polygon, "mouseout", function () {
      polygon.setOptions({ fillColor: "#fff" });
      customOverlay.setMap(null);
    });

    window.kakao.maps.event.addListener(
      polygon,
      "click",
      function (mouseEvent: any) {
        if (!detailModeRef.current) {
          map.setLevel(10);
          const latlng = mouseEvent.latLng;
          map.panTo(latlng);
        } else {
          console.log("Clicked area:", area.location);
        }
      }
    );

    return polygon;
  };

  const removePolygons = () => {
    polygonsRef.current.forEach((polygon) => {
      polygon.setMap(null);
    });
    polygonsRef.current = [];
  };

  return (
    <>
      <Script
        strategy="afterInteractive"
        type="text/javascript"
        src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_CLIENT}&autoload=false`}
      />
      <div id="map" className="w-full h-screen" />
    </>
  );
}

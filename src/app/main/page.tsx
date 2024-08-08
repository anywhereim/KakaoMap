"use client";
import MiniMap from "@/components/Map/MiniMap";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function MainPage() {
  const router = useRouter();
  return (
    <>
      <button className="flex gap-2" onClick={() => router.push("/map")}>
        지도
      </button>
      <Link href="/map">링크지도</Link>
      <MiniMap />
      <button>로그인</button>
      <button>회원가입</button>
    </>
  );
}

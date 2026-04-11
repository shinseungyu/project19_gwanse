"use client";

import Link from "next/link";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/", label: "관세 계산기" },
  { href: "/combined-tax", label: "합산과세 체크" },
  { href: "/guide", label: "이용 가이드" },
  { href: "/qna", label: "자주 묻는 질문" },
  { href: "/board", label: "게시판" },
];

export default function NavBar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-[1200px] mx-auto px-4 flex items-center justify-between h-14">
        {/* 로고 */}
        <Link href="/" className="flex items-center gap-2 mr-4 shrink-0" onClick={() => setOpen(false)}>
          <span className="font-extrabold text-sm text-gray-900">관세계산기</span>
        </Link>

        {/* 데스크톱 메뉴 */}
        <div className="hidden md:flex items-center gap-0.5 overflow-x-auto no-scrollbar">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="px-3 py-1.5 rounded-md text-sm font-medium text-gray-600 hover:text-blue-700 hover:bg-blue-50 transition-colors whitespace-nowrap"
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* 햄버거 버튼 (모바일) */}
        <button
          className="ml-auto md:hidden flex flex-col justify-center items-center w-9 h-9 gap-1.5 rounded-md hover:bg-gray-100 transition-colors"
          onClick={() => setOpen((v) => !v)}
          aria-label="메뉴 열기"
        >
          <span
            className="block w-5 h-0.5 bg-gray-700 transition-all duration-200"
            style={open ? { transform: "translateY(8px) rotate(45deg)" } : {}}
          />
          <span
            className="block w-5 h-0.5 bg-gray-700 transition-all duration-200"
            style={open ? { opacity: 0 } : {}}
          />
          <span
            className="block w-5 h-0.5 bg-gray-700 transition-all duration-200"
            style={open ? { transform: "translateY(-8px) rotate(-45deg)" } : {}}
          />
        </button>
      </div>

      {/* 모바일 드롭다운 메뉴 */}
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block px-5 py-3.5 text-sm font-medium text-gray-700 hover:text-blue-700 hover:bg-blue-50 transition-colors border-b border-gray-50 last:border-b-0"
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}

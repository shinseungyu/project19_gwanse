import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import Link from "next/link";
import NavBar from "./components/NavBar";

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-noto-sans-kr",
});

export const metadata: Metadata = {
  title: {
    default: "관세계산기 - 해외직구 관세 즉시 계산",
    template: "%s | 관세계산기",
  },
  description:
    "관세계산기로 일본·미국·중국 해외직구 관세를 실시간 환율로 즉시 계산하세요. 면세점 관세계산, 합산과세 체크, 품목별 관세율 자동 적용. 관세란 무엇인지부터 절세 방법까지 한눈에.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://gwanse.kr"),
  alternates: { canonical: "/" },
  keywords: [
    "관세계산기",
    "일본 관세계산",
    "면세점 관세계산",
    "해외직구 관세",
    "해외직구 관세계산",
    "일본 직구 관세",
    "관세 계산기",
    "관세 얼마나 나오나",
    "합산과세 계산",
    "해외직구 세금 계산",
    "직구 면세 한도",
    "관부가세 계산기",
    "수입 관세율",
    "일본 면세 한도",
    "해외직구 부가세",
    "관세청 계산",
    "직구 세금 계산기",
    "아마존 관세",
    "쇼피파이 관세",
    "면세 기준",
  ],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://gwanse.kr",
    siteName: "관세계산기",
    title: "관세계산기 - 해외직구 관세 즉시 계산",
    description:
      "일본·미국·중국 해외직구 관세를 실시간 환율로 즉시 계산. 면세점 관세, 합산과세 체크, 품목별 세율 자동 적용.",
    images: [
      {
        url: "https://gwanse.kr/thumb.webp",
        width: 1200,
        height: 630,
        alt: "관세계산기 썸네일",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "관세계산기 - 해외직구 관세 즉시 계산",
    description: "일본·미국·중국 해외직구 관세를 실시간 환율로 즉시 계산. 면세점 관세, 합산과세 체크.",
    images: ["https://gwanse.kr/thumb.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
  },
  authors: [{ name: "관세계산기" }],
  publisher: "관세계산기",
  formatDetection: {
    telephone: false,
    date: false,
    address: false,
    email: false,
  },
  verification: {
    // google: '여기에_구글_인증코드_입력',
    other: {
      "naver-site-verification": "c09b161549d9aa41f1dbb38852ef5298de7868b0",
      "google-adsense-account": "ca-pub-5378247298190063",
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "관세계산기",
  description: "일본·미국·중국 해외직구 관세 및 부가세 즉시 계산 서비스",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://gwanse.kr",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
  inLanguage: "ko",
  featureList: [
    "관세 자동 계산",
    "부가세 계산",
    "국가별 면세 한도 안내",
    "실시간 환율 반영",
    "면세점 관세 계산",
    "합산과세 체크",
  ],
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "관세계산기",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://gwanse.kr",
  logo: {
    "@type": "ImageObject",
    url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://gwanse.kr"}/thumb.webp`,
    width: 1200,
    height: 630,
  },
};

const siteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "관세계산기",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://gwanse.kr",
  inLanguage: "ko",
  publisher: {
    "@type": "Organization",
    name: "관세계산기",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://gwanse.kr",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={notoSansKR.variable}>
      <body className="min-h-screen bg-[#f8faf9] text-[#111827] font-sans antialiased">
        {/*
          JSON-LD 는 next/script 가 아니라 일반 <script> 로 넣는다.
          next/script 로 넣으면 서버 HTML 에는 self.__next_s.push(...) 형태로만 나가고
          실제 ld+json 태그는 하이드레이션 이후에 주입돼서,
          JS 를 거의 렌더하지 않는 크롤러(네이버 등)와 스키마 검증 도구가 이를 못 본다.

          FAQPage 는 여기(전역)에서 제거했다. 화면에 보이지 않는 Q&A 5개가
          모든 페이지에 붙어 있었고, 홈·QnA 페이지의 실제 내용과도 달랐다.
          지금은 각 페이지가 자기 화면에 실제로 보이는 Q&A 로 FAQPage 를 만든다.
        */}
        {[jsonLd, orgJsonLd, siteJsonLd].map((schema, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
        {/*
          google-adsense-account 메타태그와 ads.txt 는 있었지만 정작 광고 로더 스크립트가 없었다.
          (외부 스크립트는 next/script 를 쓰는 게 맞다 — JSON-LD 와 달리 실제로 로드돼야 하는 자원)
        */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5378247298190063"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <NavBar />
        <main>{children}</main>
        <footer className="mt-16 border-t border-gray-100 bg-white py-8">
          <div className="max-w-[1200px] mx-auto px-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-gray-400">
                © 2026 gwanse.kr · 문의: contact@gwanse.kr
              </p>
              <nav className="flex flex-wrap gap-4">
                <Link href="/about" className="text-xs text-gray-400 hover:text-gray-600">사이트 소개</Link>
                <Link href="/contact" className="text-xs text-gray-400 hover:text-gray-600">연락처</Link>
                <Link href="/privacy-policy" className="text-xs text-gray-400 hover:text-gray-600">개인정보 처리방침</Link>
                <Link href="/terms-of-service" className="text-xs text-gray-400 hover:text-gray-600">이용약관</Link>
                <Link href="/cookie-policy" className="text-xs text-gray-400 hover:text-gray-600">쿠키 정책</Link>
              </nav>
            </div>
            <p className="mt-3 text-[11px] text-gray-300 text-center leading-relaxed">
              본 서비스는 참고용이며 실제 관세액은 한국 세관의 최종 판단에 따릅니다. 정확한 관세 산출은 관세청 또는 관세사에 문의하세요.
            </p>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}

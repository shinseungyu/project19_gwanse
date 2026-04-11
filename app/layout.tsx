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
  featureList: "관세 자동 계산, 부가세 계산, 국가별 면세 한도 안내, 실시간 환율 반영, 면세점 관세 계산, 합산과세 체크",
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "일본 직구 관세 면세 한도는 얼마인가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "일본을 포함한 미국 외 국가에서의 해외직구는 물건값 기준 $150 이하면 관세가 면제됩니다. $150를 초과하면 품목에 따라 관세(8~13%)와 부가세(10%)가 부과됩니다. 단, 미국 직구 목록통관 품목은 $200까지 면세입니다.",
      },
    },
    {
      "@type": "Question",
      name: "면세점에서 구입한 물건도 관세가 부과되나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "해외 면세점에서 구입하더라도 귀국 시 면세 한도($800)를 초과하면 국내 세관에서 관세가 부과됩니다. 면세점 구매 금액과 기타 해외 구매 금액을 합산해 $800을 초과하는 부분에 세금이 매겨집니다.",
      },
    },
    {
      "@type": "Question",
      name: "합산과세란 무엇인가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "합산과세는 동일인이 같은 날 여러 해외 주문이 동시에 입항할 경우 금액을 합산해 면세 한도 초과 여부를 판단하는 제도입니다. 각각은 면세 금액 이하라도 합산 시 $150를 초과하면 전체에 관세가 부과될 수 있습니다.",
      },
    },
    {
      "@type": "Question",
      name: "알리익스프레스·테무에서 구매하면 관세가 붙나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "알리익스프레스, 테무 등 중국 플랫폼은 $150 이하일 경우 면세입니다. $150 초과 시 품목에 따라 관세(8~13%)와 부가세(10%)가 부과됩니다. 여러 건을 같은 날 주문해 동시에 입항하면 합산과세 대상이 될 수 있어 주의가 필요합니다.",
      },
    },
    {
      "@type": "Question",
      name: "목록통관과 일반통관의 차이가 무엇인가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "목록통관은 의류, 신발 등 위험성이 낮은 물품을 서류만으로 빠르게 통관시키는 제도입니다(미국 $200 면세). 일반통관은 영양제, 의약품, 식품 등 세관의 직접 확인이 필요한 품목으로, 전 세계 어디서 오든 무조건 $150가 면세 한도입니다. 일반통관 품목이 하나라도 섞여 있다면 전체 택배가 일반통관($150 한도)으로 취급됩니다.",
      },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={notoSansKR.variable}>
      <head>
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Script
          id="faq-json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-[#f8faf9] text-[#111827] font-sans antialiased">
        <NavBar />
        <main>{children}</main>
        <footer className="mt-16 border-t border-gray-100 bg-white py-8">
          <div className="max-w-[1200px] mx-auto px-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-gray-400">
                © 2026 gwanse.kr · 문의: contact@gwanse.kr
              </p>
              <nav className="flex gap-4">
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

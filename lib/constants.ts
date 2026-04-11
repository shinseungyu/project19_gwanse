export const EXCHANGE_RATE_API = "https://open.er-api.com/v6/latest/USD";

export const DUTY_FREE_LIMIT_US = 200;
export const DUTY_FREE_LIMIT_OTHER = 150;

export const VAT_RATE = 0.1;

export const VITAMIN_BOTTLE_LIMIT = 6;

export const PRODUCT_CATEGORIES = [
  { id: "clothing",    label: "의류·신발·가방",     dutyRate: { us: 0.13, jp: 0.13, cn: 0.13, eu: 0.13 }, description: "의류, 신발, 핸드백, 지갑 등" },
  { id: "electronics", label: "전자제품",            dutyRate: { us: 0,    jp: 0,    cn: 0,    eu: 0    }, description: "스마트폰, 노트북, 태블릿, 카메라 등" },
  { id: "cosmetics",   label: "화장품·스킨케어",     dutyRate: { us: 0.065,jp: 0.065,cn: 0.065,eu: 0.065}, description: "스킨케어, 메이크업, 선크림 등" },
  { id: "food",        label: "식품·간식",           dutyRate: { us: 0.08, jp: 0.08, cn: 0.08, eu: 0.08 }, description: "과자, 건강식품, 음료 등" },
  { id: "vitamins",    label: "영양제·건강보조제",   dutyRate: { us: 0.08, jp: 0.08, cn: 0.08, eu: 0.08 }, description: "비타민, 영양제, 단백질 보충제 등 (6병 초과 시 일반통관)" },
  { id: "perfume",     label: "향수·디퓨저",         dutyRate: { us: 0.07, jp: 0.07, cn: 0.07, eu: 0.07 }, description: "향수, 룸스프레이, 디퓨저 등" },
  { id: "toys",        label: "완구·피규어·취미",    dutyRate: { us: 0.08, jp: 0.08, cn: 0.08, eu: 0.08 }, description: "장난감, 피규어, 보드게임 등" },
  { id: "books",       label: "서적·교재",           dutyRate: { us: 0,    jp: 0,    cn: 0,    eu: 0    }, description: "책, 잡지, 어학교재 등" },
  { id: "sports",      label: "스포츠·아웃도어",     dutyRate: { us: 0.08, jp: 0.08, cn: 0.08, eu: 0.08 }, description: "운동기구, 스포츠웨어, 캠핑용품 등" },
  { id: "jewelry",     label: "주얼리·액세서리",     dutyRate: { us: 0.08, jp: 0.08, cn: 0.08, eu: 0.08 }, description: "귀걸이, 반지, 목걸이, 시계 등" },
  { id: "other",       label: "기타",                dutyRate: { us: 0.08, jp: 0.08, cn: 0.08, eu: 0.08 }, description: "기타 품목" },
] as const;

export const ORIGIN_COUNTRIES = [
  { id: "us", label: "미국",   flag: "🇺🇸", currency: "USD", symbol: "$",  dutyFreeLimit: DUTY_FREE_LIMIT_US    },
  { id: "jp", label: "일본",   flag: "🇯🇵", currency: "JPY", symbol: "¥",  dutyFreeLimit: DUTY_FREE_LIMIT_OTHER },
  { id: "cn", label: "중국",   flag: "🇨🇳", currency: "CNY", symbol: "¥",  dutyFreeLimit: DUTY_FREE_LIMIT_OTHER },
  { id: "eu", label: "유럽",   flag: "🇪🇺", currency: "EUR", symbol: "€",  dutyFreeLimit: DUTY_FREE_LIMIT_OTHER },
] as const;

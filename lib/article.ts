/**
 * 게시글 본문(plain text) 파서.
 *
 * data/posts.json 의 content 는 아래 마커 규칙으로 작성되어 있다.
 *   "■ 소제목"        -> 섹션 제목 (h2)
 *   "- 항목" / "· 항목" -> 불릿 목록
 *   "1. 항목"          -> 번호 목록
 *   "□ 항목"           -> 체크리스트
 *   "Q. 질문" + "A. 답변" -> FAQ 쌍
 *   그 외              -> 문단
 *
 * 이 마커들을 실제 시맨틱 태그로 렌더하기 위한 블록 배열로 변환한다.
 * (기존에는 전부 <p> 또는 통짜 텍스트로 렌더돼 h2/목록 구조가 없었다)
 */

export interface Post {
  id: number
  title: string
  date: string
  updated?: string
  category: string
  summary: string
  content: string
  tags: string[]
}

export interface FaqItem {
  q: string
  a: string
}

export type Block =
  | { kind: 'h2'; id: string; text: string }
  | { kind: 'p'; text: string }
  | { kind: 'ul'; items: string[] }
  | { kind: 'ol'; items: string[] }
  | { kind: 'check'; items: string[] }
  | { kind: 'faq'; items: FaqItem[] }

const H2 = /^■\s*(.+)$/
const BULLET = /^[-·▪]\s+(.+)$/
const ORDERED = /^(\d+)\.\s+(.+)$/
const CHECK = /^□\s*(.+)$/
const QUESTION = /^Q\d*\.\s*(.+)$/
const ANSWER = /^A\d*\.\s*(.+)$/

/** 본문 텍스트를 시맨틱 블록 배열로 변환한다. */
export function parseArticle(content: string): Block[] {
  const blocks: Block[] = []
  const lines = content.split('\n')

  let headingIndex = 0
  let pendingQuestion: string | null = null

  // 같은 종류의 연속된 목록 줄을 하나의 블록으로 합치기 위한 버퍼
  let listKind: 'ul' | 'ol' | 'check' | null = null
  let listItems: string[] = []

  const flushList = () => {
    if (listKind && listItems.length > 0) {
      blocks.push({ kind: listKind, items: listItems } as Block)
    }
    listKind = null
    listItems = []
  }

  const pushListItem = (kind: 'ul' | 'ol' | 'check', text: string) => {
    if (listKind !== kind) {
      flushList()
      listKind = kind
    }
    listItems.push(text)
  }

  const pushFaq = (item: FaqItem) => {
    const last = blocks[blocks.length - 1]
    if (last && last.kind === 'faq') {
      last.items.push(item)
    } else {
      blocks.push({ kind: 'faq', items: [item] })
    }
  }

  for (const raw of lines) {
    const line = raw.trim()

    if (line === '') {
      flushList()
      continue
    }

    const heading = line.match(H2)
    if (heading) {
      flushList()
      pendingQuestion = null
      headingIndex += 1
      blocks.push({ kind: 'h2', id: `sec-${headingIndex}`, text: heading[1].trim() })
      continue
    }

    const question = line.match(QUESTION)
    if (question) {
      flushList()
      pendingQuestion = question[1].trim()
      continue
    }

    const answer = line.match(ANSWER)
    if (answer) {
      flushList()
      if (pendingQuestion) {
        pushFaq({ q: pendingQuestion, a: answer[1].trim() })
        pendingQuestion = null
      } else {
        blocks.push({ kind: 'p', text: answer[1].trim() })
      }
      continue
    }

    const check = line.match(CHECK)
    if (check) {
      // "□ A  □ B  □ C" 처럼 한 줄에 여러 항목이 붙어 있는 경우도 분리한다.
      const items = line
        .split('□')
        .map((s) => s.trim())
        .filter(Boolean)
      items.forEach((item) => pushListItem('check', item))
      continue
    }

    const ordered = line.match(ORDERED)
    if (ordered) {
      pushListItem('ol', ordered[2].trim())
      continue
    }

    const bullet = line.match(BULLET)
    if (bullet) {
      pushListItem('ul', bullet[1].trim())
      continue
    }

    flushList()

    // 답변이 없는 채로 다음 문단이 오면 질문도 일반 문단으로 되돌린다.
    if (pendingQuestion) {
      blocks.push({ kind: 'p', text: pendingQuestion })
      pendingQuestion = null
    }

    blocks.push({ kind: 'p', text: line })
  }

  flushList()
  if (pendingQuestion) blocks.push({ kind: 'p', text: pendingQuestion })

  return blocks
}

/** 목차 렌더링용 소제목 목록. */
export function extractHeadings(blocks: Block[]): { id: string; text: string }[] {
  return blocks.flatMap((b) => (b.kind === 'h2' ? [{ id: b.id, text: b.text }] : []))
}

/** 본문에 들어 있는 Q&A 를 FAQPage 스키마용으로 뽑아낸다. */
export function extractFaqs(blocks: Block[]): FaqItem[] {
  return blocks.flatMap((b) => (b.kind === 'faq' ? b.items : []))
}

/** 스키마의 wordCount 용. 한국어는 공백 기준 어절 수로 센다. */
export function countWords(content: string): number {
  return content.split(/\s+/).filter(Boolean).length
}

/** 글의 최종 수정일 (updated 가 있으면 우선). */
export function lastModifiedOf(post: Pick<Post, 'date' | 'updated'>): string {
  return post.updated || post.date
}

/**
 * 같은 카테고리 > 태그 겹침 > 최신순으로 관련 글을 고른다.
 * (기존에는 단순 최신순이라 토픽 클러스터가 형성되지 않았다)
 */
export function relatedPosts(all: Post[], current: Post, limit = 6): Post[] {
  const currentTags = new Set(current.tags || [])

  return all
    .filter((p) => p.id !== current.id)
    .map((p) => {
      const sharedTags = (p.tags || []).filter((t) => currentTags.has(t)).length
      const sameCategory = p.category === current.category ? 1 : 0
      return { post: p, score: sameCategory * 10 + sharedTags }
    })
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      return b.post.date.localeCompare(a.post.date)
    })
    .slice(0, limit)
    .map((x) => x.post)
}

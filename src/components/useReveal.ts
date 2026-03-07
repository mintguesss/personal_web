'use client'
// src/components/useReveal.ts
// 監聽元素進入視窗，加上 in-view class 觸發 CSS 動畫
import { useEffect, useRef } from 'react'

export function useReveal(delay = 0) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    el.style.animationDelay = `${delay}ms`
    el.classList.add('reveal')

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('in-view')
          obs.disconnect()
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [delay])

  return ref
}

'use client'
import Giscus from '@giscus/react'
import { useInView } from 'react-intersection-observer'

export function CommentSection() {

  const { ref, inView, entry } = useInView({
    triggerOnce: true
  });

  return (
    <div className="w-full px-[2px] mt-24">
      <Giscus
        repo="alfonsusac/nextjs-notes"
        repoId="R_kgDOJu7Msg"
        category="Blog Comments"
        categoryId="DIC_kwDOJu7Mss4CYxEm"
        mapping="pathname"
        term="Welcome to @giscus/react component!"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme="transparent_dark"
        lang="en"
        loading="lazy"
        id="comment"
      />
    </div>
  )
}
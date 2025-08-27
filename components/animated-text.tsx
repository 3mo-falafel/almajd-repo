"use client"

import { motion } from "framer-motion"

interface AnimatedTextProps {
  text: string
  delay?: number
  /** Force per-character animation (legacy). Defaults to false (per-word) for non-Arabic. */
  perCharacter?: boolean
}

export function AnimatedText({ text, delay = 0, perCharacter = false }: AnimatedTextProps) {
  const isArabic = /[\u0600-\u06FF]/.test(text)

  // For Arabic we must keep the text in a single DOM run (or at least per word) to preserve glyph shaping.
  if (isArabic) {
    return (
      <motion.span
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
        style={{ display: "inline" }}
      >
        {text}
      </motion.span>
    )
  }

  // Non-Arabic: animate per word (prevents vertical stacking of letters on small screens)
  if (!perCharacter) {
    const tokens = text.split(/(\s+)/) // keep the spaces as separate tokens
    let wordIndex = 0
    return (
      <span>
        {tokens.map((token, i) => {
          const isSpace = /^\s+$/.test(token)
          if (isSpace) {
            return <span key={i}>{token}</span>
          }
          const thisWord = wordIndex++
            return (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: delay + thisWord * 0.12,
                  ease: [0.21, 0.47, 0.32, 0.98],
                }}
                style={{ display: "inline-block", whiteSpace: "nowrap" }}
              >
                {token}
              </motion.span>
            )
        })}
      </span>
    )
  }

  // Optional legacy per-character mode
  return (
    <span>
      {text.split("").map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: delay + index * 0.03,
            ease: [0.21, 0.47, 0.32, 0.98],
          }}
          style={{ display: char === " " ? "inline" : "inline-block" }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  )
}

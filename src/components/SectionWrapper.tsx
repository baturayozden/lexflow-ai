'use client'
import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface SectionWrapperProps {
  children: ReactNode
  className?: string
  id?: string
  delay?: number
}

export default function SectionWrapper({
  children,
  className = '',
  id,
  delay = 0,
}: SectionWrapperProps) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number,number,number,number], delay }}
      className={className}
    >
      {children}
    </motion.section>
  )
}

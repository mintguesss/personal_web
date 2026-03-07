// src/components/SectionWrapper.tsx
// 每個 section 共用的外框 + label + title
interface Props {
  id: string
  label: string
  title: string
  children: React.ReactNode
  className?: string
}

export default function SectionWrapper({ id, label, title, children, className = '' }: Props) {
  return (
    <section id={id} className={`py-32 ${className}`}>
      <div className="max-w-5xl mx-auto px-6">
        <p
          className="text-xs uppercase tracking-widest mb-3"
          style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}
        >
          _{label}
        </p>
        <h2
          className="text-3xl md:text-4xl font-bold mb-12"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          {title}
        </h2>
        {children}
      </div>
    </section>
  )
}

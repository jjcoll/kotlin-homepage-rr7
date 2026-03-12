import './index.scss';


interface SectionProps {
  children: React.ReactNode
  className?: string
}

interface ContainerProps {
  children: React.ReactNode
}

export function Section({ children, className }: SectionProps) {
  return <section className={'kto-layout-section' + ' ' + className}>
    {children}
  </section>
}

export function Container({ children }: ContainerProps) {
  return <div className="kto-layout-container">
    {children}
  </div>
}

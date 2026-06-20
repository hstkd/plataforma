export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string
  title: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h1 className="mt-2 font-heading text-3xl font-extrabold text-bone sm:text-4xl">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-bone-muted">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}

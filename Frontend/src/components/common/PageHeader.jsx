export default function PageHeader({ title, subtitle, action }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start',
      justifyContent: 'space-between', flexWrap: 'wrap',
      gap: 12, marginBottom: 28,
    }}>
      <div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 600, color: 'var(--gray-900)' }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontSize: 14, color: 'var(--gray-500)', marginTop: 4 }}>{subtitle}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}

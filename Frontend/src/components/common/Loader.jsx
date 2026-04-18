export default function Loader({ fullPage = false }) {
  return (
    <div className="loader-center" style={fullPage ? { minHeight: '100vh' } : {}}>
      <div className="spinner" />
    </div>
  )
}

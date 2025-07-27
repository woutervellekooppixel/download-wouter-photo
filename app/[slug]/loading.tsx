await new Promise((resolve) => setTimeout(resolve, 2000)) // 2 seconden vertraging

export default function Loading() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-black text-white">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-white/50 border-opacity-50 mb-4" />
      <p className="text-white/70">Downloadpagina wordt geladen...</p>
    </div>
  )
}

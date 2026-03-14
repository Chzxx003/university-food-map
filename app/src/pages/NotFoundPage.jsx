import { useNavigate } from 'react-router-dom'
import { MapPinOff, Home, ArrowLeft } from 'lucide-react'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
        <MapPinOff className="w-12 h-12 text-primary" />
      </div>
      <h1 className="text-3xl font-bold text-text mb-2">页面走丢了</h1>
      <p className="text-text-secondary mb-8 max-w-sm">
        找不到你要的页面，可能它去觅食了...
      </p>
      <div className="flex gap-3">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-border text-text-secondary font-medium hover:bg-stone-50 cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> 返回上页
        </button>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-medium hover:bg-primary-dark cursor-pointer transition-colors"
        >
          <Home className="w-4 h-4" /> 回到首页
        </button>
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import api from '../utils/api'

const FALLBACK_BANNERS = [
  { title: 'Learn In-Demand Tech Skills', subtitle: 'Join our expert-led courses and kickstart your career', image: '' },
  { title: 'Get Certified', subtitle: 'Earn a certificate recognized by top companies', image: '' },
  { title: '100% Placement Support', subtitle: 'We help you land your first tech job', image: '' },
]

export default function BannerCarousel() {
  const [banners, setBanners] = useState(FALLBACK_BANNERS)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    api.get('/banners').then((res) => {
      if (res.data && res.data.length) setBanners(res.data)
    }).catch(() => {})
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % banners.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [banners.length])

  const banner = banners[index]

  return (
    <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden bg-gradient-to-r from-brand-purple to-brand-indigo flex items-center justify-center text-center text-white mb-10">
      {banner.image && (
        <img src={banner.image} alt={banner.title} className="absolute inset-0 w-full h-full object-cover opacity-30" />
      )}
      <div className="relative z-10 px-6">
        <h2 className="text-2xl md:text-4xl font-bold mb-2">{banner.title}</h2>
        <p className="text-sm md:text-lg opacity-90">{banner.subtitle}</p>
      </div>

      <div className="absolute bottom-4 flex gap-2">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-2.5 h-2.5 rounded-full ${i === index ? 'bg-white' : 'bg-white/40'}`}
          />
        ))}
      </div>
    </div>
  )
}

import { useEffect, useState } from "react";
import api from "../utils/api";
import "./BannerCarousel.css";

const FALLBACK_BANNERS = [
  {
    title: "Invest in Knowledge, Achieve Success",
    subtitle: "Corporates Guide — Your Guide to Success",
    image: "/images/banner-woman.png",
  },
  {
    title: "Get Certified",
    subtitle: "Earn an Industry-Recognized Certificate",
    image: "/images/banner-certificate.png",
  },
  {
    title: "100% Placement Support",
    subtitle: "We help you land your first tech job",
    image: "/images/banner-placement.jpg",
  },
];

const TYPE_SPEED_MS = 40;
const PAUSE_AFTER_TYPING_MS = 1800;

export default function BannerCarousel() {
  const [banners, setBanners] = useState(FALLBACK_BANNERS);
  const [index, setIndex] = useState(0);
  const [typedText, setTypedText] = useState("");

  useEffect(() => {
    api
      .get("/banners")
      .then((res) => {
        if (Array.isArray(res.data) && res.data.length > 0) {
         const updated = res.data.map((item, i) => ({
  title: item.title || FALLBACK_BANNERS[i]?.title,
  subtitle: item.subtitle || FALLBACK_BANNERS[i]?.subtitle,
  image:
    item.image && item.image.trim() !== ""
      ? item.image
      : FALLBACK_BANNERS[i]?.image,
}));

          setBanners(updated);
        } else {
          setBanners(FALLBACK_BANNERS);
        }
      })
      .catch(() => {
        setBanners(FALLBACK_BANNERS);
      });
  }, []);

  const banner = banners[index];

  useEffect(() => {
    setTypedText("");

    let charIndex = 0;
    let typingTimer;
    let switchTimer;

    const type = () => {
      charIndex++;
      setTypedText(banner.title.slice(0, charIndex));

      if (charIndex < banner.title.length) {
        typingTimer = setTimeout(type, TYPE_SPEED_MS);
      } else {
        switchTimer = setTimeout(() => {
          setIndex((prev) => (prev + 1) % banners.length);
        }, PAUSE_AFTER_TYPING_MS);
      }
    };

    typingTimer = setTimeout(type, TYPE_SPEED_MS);

    return () => {
      clearTimeout(typingTimer);
      clearTimeout(switchTimer);
    };
  }, [banner.title, banners.length]);

  return (
    <div className="relative w-full h-[230px] sm:h-[320px] md:h-[500px] rounded-2xl overflow-hidden shadow-xl">
      {/* Background Image */}
      <img
        src={banner.image}
        alt={banner.title}
        className="absolute inset-0 w-full h-full object-cover object-center banner-image"
        onError={(e) => {
          e.target.src = "/images/banner-woman.png";
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/10"></div>

    {/* Content */}
<div
  className={`absolute inset-0 z-10 flex px-4 sm:px-8 md:px-16 ${
    index === 2
      ? "items-center justify-center"
      : "items-center justify-end"
  }`}
>
  <div
    className={`${
      index === 2
        ? "w-full text-center"
        : "w-[65%] sm:w-[60%] md:max-w-xl text-right"
    }`}
  >
    <h1
      className={`text-base sm:text-2xl md:text-5xl font-bold leading-tight break-words ${
        index === 2 ? "text-white" : "text-[#440D70]"
      }`}
    >
      {typedText}
      <span className="animate-pulse">|</span>
    </h1>

    <p
      className={`mt-2 text-xs sm:text-base md:text-xl leading-relaxed ${
        index === 2 ? "text-white" : "text-[#440D70]"
      }`}
    >
      {banner.subtitle}
    </p>
  </div>
</div>

      {/* Slider Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-3 w-3 rounded-full transition-all duration-300 ${
              i === index
                ? "bg-white scale-125"
                : "bg-white/50 hover:bg-white"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
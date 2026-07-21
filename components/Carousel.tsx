"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Slide = {
  src: string;
  alt: string;
  title: string;
  meta: string;
};

const SLIDES: Slide[] = [
  {
    src: "/images/carousel-1.svg",
    alt: "Afterwork mensuel entre membres de la communauté",
    title: "Afterwork mensuel",
    meta: "Cocody, Abidjan — Mars 2026",
  },
  {
    src: "/images/carousel-2.svg",
    alt: "Match de foot amical entre alumni",
    title: "Match de foot entre alumni",
    meta: "Riviera, Abidjan — Février 2026",
  },
  {
    src: "/images/carousel-3.svg",
    alt: "Soirée de networking professionnel",
    title: "Soirée networking",
    meta: "Plateau, Abidjan — Janvier 2026",
  },
  {
    src: "/images/carousel-4.svg",
    alt: "Déjeuner communautaire entre membres",
    title: "Déjeuner du dimanche",
    meta: "Marcory, Abidjan — Décembre 2025",
  },
  {
    src: "/images/carousel-5.svg",
    alt: "Rencontre informelle entre anciens étudiants",
    title: "Retrouvailles de promo",
    meta: "Zone 4, Abidjan — Novembre 2025",
  },
  {
    src: "/images/carousel-6.svg",
    alt: "Session de discussion et de partage entre membres",
    title: "Café du samedi",
    meta: "Bonapriso — Octobre 2025",
  },
];

const AUTOPLAY_DELAY = 5000;

export default function Carousel() {
  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(true);
  const [dragging, setDragging] = useState(false);

  const viewportRef = useRef<HTMLDivElement>(null);
  const autoplayTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const dragStartX = useRef(0);
  const dragOffset = useRef(0);
  const pointerId = useRef<number | null>(null);
  const reducedMotion = useRef(false);

  const count = SLIDES.length;

  const goTo = useCallback(
    (newIndex: number) => {
      setAnimate(true);
      setIndex(((newIndex % count) + count) % count);
    },
    [count]
  );

  const stopAutoplay = useCallback(() => {
    if (autoplayTimer.current) {
      clearInterval(autoplayTimer.current);
      autoplayTimer.current = null;
    }
  }, []);

  const startAutoplay = useCallback(() => {
    if (reducedMotion.current) return;
    stopAutoplay();
    autoplayTimer.current = setInterval(() => {
      setAnimate(true);
      setIndex((i) => (i + 1) % count);
    }, AUTOPLAY_DELAY);
  }, [count, stopAutoplay]);

  useEffect(() => {
    reducedMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    startAutoplay();
    return stopAutoplay;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    setDragging(true);
    setAnimate(false);
    dragStartX.current = e.clientX;
    dragOffset.current = 0;
    pointerId.current = e.pointerId;
    stopAutoplay();
    viewportRef.current?.setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragging || !viewportRef.current) return;
    dragOffset.current = e.clientX - dragStartX.current;
    const base = -index * viewportRef.current.clientWidth;
    viewportRef.current.style.setProperty(
      "--drag-x",
      `${base + dragOffset.current}px`
    );
  }

  function endDrag() {
    if (!dragging || !viewportRef.current) return;
    setDragging(false);
    viewportRef.current.style.removeProperty("--drag-x");

    const threshold = viewportRef.current.clientWidth * 0.18;
    if (dragOffset.current < -threshold) {
      goTo(index + 1);
    } else if (dragOffset.current > threshold) {
      goTo(index - 1);
    } else {
      setAnimate(true);
    }
    startAutoplay();
  }

  return (
    <section
      className="carousel-section"
      id="communaute"
      aria-label="Photos de la communauté"
      onMouseEnter={stopAutoplay}
      onMouseLeave={startAutoplay}
      onFocus={stopAutoplay}
      onBlur={startAutoplay}
    >
      <div className="carousel-section__head">
        <h2>Des rencontres, pas des discours</h2>
        <p>Un aperçu de nos derniers moments ensemble.</p>
      </div>

      <div className="carousel">
        <button
          className="carousel__arrow carousel__arrow--prev"
          aria-label="Photo précédente"
          onClick={() => goTo(index - 1)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M15 18L9 12L15 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div
          className={`carousel__viewport${dragging ? " is-dragging" : ""}`}
          ref={viewportRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onPointerLeave={() => dragging && endDrag()}
          onDragStart={(e) => e.preventDefault()}
        >
          <ul
            className={`carousel__track${animate ? " is-animating" : ""}`}
            style={{
              transform: dragging
                ? "translateX(var(--drag-x))"
                : `translateX(-${index * 100}%)`,
            }}
          >
            {SLIDES.map((slide) => (
              <li className="carousel__slide" key={slide.src}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={slide.src} alt={slide.alt} draggable={false} />
                <div className="carousel__caption">
                  <span className="carousel__caption-title">
                    {slide.title}
                  </span>
                  <span className="carousel__caption-meta">{slide.meta}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <button
          className="carousel__arrow carousel__arrow--next"
          aria-label="Photo suivante"
          onClick={() => goTo(index + 1)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M9 18L15 12L9 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <div
        className="carousel__dots"
        role="tablist"
        aria-label="Sélection de la photo"
      >
        {SLIDES.map((slide, i) => (
          <button
            key={slide.src}
            className={`carousel__dot${i === index ? " is-active" : ""}`}
            role="tab"
            aria-label={`Aller à la photo ${i + 1}`}
            aria-selected={i === index}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </section>
  );
}

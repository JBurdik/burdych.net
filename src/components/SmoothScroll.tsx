import { useEffect, useRef } from "react";
import Lenis from "lenis";

// Detect iOS/Safari mobile
function isIOSorSafariMobile(): boolean {
  if (typeof window === "undefined") return false;
  const ua = navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(ua);
  const isSafari = /^((?!chrome|android).)*safari/i.test(ua);
  const isTouchDevice =
    "ontouchstart" in window || navigator.maxTouchPoints > 0;
  return isIOS || (isSafari && isTouchDevice);
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const isMobile = isIOSorSafariMobile();

    // Skip Lenis on iOS/Safari mobile - use native scroll for better performance
    if (isMobile) {
      // Handle anchor links with native smooth scroll
      const handleAnchorClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const anchor = target.closest('a[href^="#"]');
        if (anchor) {
          e.preventDefault();
          const href = anchor.getAttribute("href");
          if (href) {
            const targetElement = document.querySelector(href);
            if (targetElement) {
              const offsetTop =
                targetElement.getBoundingClientRect().top + window.scrollY - 80;
              window.scrollTo({ top: offsetTop, behavior: "smooth" });
            }
          }
        }
      };

      document.addEventListener("click", handleAnchorClick);
      return () => document.removeEventListener("click", handleAnchorClick);
    }

    // Use Lenis on desktop/non-Safari browsers
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Handle anchor links for smooth scrolling
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]');
      if (anchor) {
        e.preventDefault();
        const href = anchor.getAttribute("href");
        if (href) {
          const targetElement = document.querySelector(href);
          if (targetElement) {
            lenis.scrollTo(targetElement as HTMLElement, {
              offset: -80,
              duration: 1.5,
            });
          }
        }
      }
    };

    document.addEventListener("click", handleAnchorClick);

    return () => {
      lenis.destroy();
      document.removeEventListener("click", handleAnchorClick);
    };
  }, []);

  return <>{children}</>;
}

// Export a hook to access Lenis instance if needed
export function useLenis() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Access global Lenis instance if available
    const lenis = (window as any).__lenis;
    if (lenis) {
      lenisRef.current = lenis;
    }
  }, []);

  return lenisRef.current;
}

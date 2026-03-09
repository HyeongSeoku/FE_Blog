"use client";

import { useEffect, useRef, useCallback } from "react";

interface Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  baseLength: number;
  currentLength: number;
  rotation: number;
  rotationSpeed: number;
}

interface ParticleCanvasProps {
  className?: string;
  contained?: boolean; // true면 부모 요소 내에서만 동작
}

// 크기 설정
const MIN_LENGTH = 1;
const MAX_LENGTH = 8;

// 반응형 설정
const getEffectRadius = () => {
  if (typeof window === "undefined") return 350;
  return window.innerWidth < 768 ? 200 : 350;
};

// HSL to RGB 변환
const hslToRgb = (h: number, s: number, l: number): string => {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r = 0,
    g = 0,
    b = 0;
  if (h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (h < 300) {
    r = x;
    g = 0;
    b = c;
  } else {
    r = c;
    g = 0;
    b = x;
  }

  const toHex = (n: number) =>
    Math.round((n + m) * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

const ParticleCanvas = ({
  className = "",
  contained = false,
}: ParticleCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetMouseRef = useRef({ x: 0, y: 0 });
  const prevMouseRef = useRef({ x: 0, y: 0 });
  const mouseVelocityRef = useRef({ x: 0, y: 0 });
  const globalOffsetRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number>(0);
  const effectRadiusRef = useRef(getEffectRadius());
  const timeRef = useRef(0);
  const initializedRef = useRef(false);
  const canvasRectRef = useRef<DOMRect | null>(null);

  const createParticleAt = useCallback(
    (x: number, y: number, jitter: number): Particle => {
      // 그리드 위치에 약간의 랜덤 오프셋 추가
      const jitterX = (Math.random() - 0.5) * jitter;
      const jitterY = (Math.random() - 0.5) * jitter;
      const finalX = x + jitterX;
      const finalY = y + jitterY;

      return {
        x: finalX,
        y: finalY,
        originX: finalX,
        originY: finalY,
        baseLength: Math.random() * (MAX_LENGTH - 4) + 4, // 4~8px
        currentLength: MIN_LENGTH,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.015,
      };
    },
    [],
  );

  const initParticles = useCallback(
    (width: number, height: number) => {
      const particles: Particle[] = [];

      // 그리드 간격 계산 (반응형)
      const isMobile = width < 768;
      const spacing = isMobile ? 35 : 30; // 간격
      const jitter = spacing * 0.4; // 위치 흔들림 (간격의 40%)

      // 여백 추가
      const margin = spacing;

      // 그리드로 파티클 배치
      for (let y = margin; y < height - margin; y += spacing) {
        for (let x = margin; x < width - margin; x += spacing) {
          particles.push(createParticleAt(x, y, jitter));
        }
      }

      particlesRef.current = particles;
      effectRadiusRef.current = getEffectRadius();

      // 초기 마우스 위치를 화면 중앙으로
      if (!initializedRef.current) {
        const centerX = width / 2;
        const centerY = height / 2;
        mouseRef.current = { x: centerX, y: centerY };
        targetMouseRef.current = { x: centerX, y: centerY };
        prevMouseRef.current = { x: centerX, y: centerY };
        initializedRef.current = true;
      }
    },
    [createParticleAt],
  );

  const drawParticle = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      particle: Particle,
      alpha: number,
      color: string,
    ) => {
      if (particle.currentLength < 1.5) return;

      ctx.save();
      ctx.translate(particle.x, particle.y);
      ctx.rotate(particle.rotation);
      ctx.strokeStyle = color;
      ctx.lineCap = "round";
      ctx.lineWidth = 2.5;
      ctx.globalAlpha = alpha;

      // 짧은 대시(dash) 형태의 선
      const halfLength = particle.currentLength / 2;
      ctx.beginPath();
      ctx.moveTo(-halfLength, 0);
      ctx.lineTo(halfLength, 0);
      ctx.stroke();

      ctx.restore();
    },
    [],
  );

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    timeRef.current += 0.016;

    // 마우스 위치 부드럽게 따라가기
    const lerpFactor = 0.1;
    mouseRef.current.x +=
      (targetMouseRef.current.x - mouseRef.current.x) * lerpFactor;
    mouseRef.current.y +=
      (targetMouseRef.current.y - mouseRef.current.y) * lerpFactor;

    // 마우스 속도 계산
    mouseVelocityRef.current.x = mouseRef.current.x - prevMouseRef.current.x;
    mouseVelocityRef.current.y = mouseRef.current.y - prevMouseRef.current.y;
    prevMouseRef.current.x = mouseRef.current.x;
    prevMouseRef.current.y = mouseRef.current.y;

    const velocityMagnitude = Math.sqrt(
      mouseVelocityRef.current.x ** 2 + mouseVelocityRef.current.y ** 2,
    );

    // 마우스 속도에 따른 전체 오프셋 (무리 이동 효과)
    if (velocityMagnitude > 0.5) {
      globalOffsetRef.current.x += mouseVelocityRef.current.x * 0.25;
      globalOffsetRef.current.y += mouseVelocityRef.current.y * 0.25;
    }

    // 전체 오프셋 감쇠
    globalOffsetRef.current.x *= 0.94;
    globalOffsetRef.current.y *= 0.94;

    const mouse = mouseRef.current;
    const globalOffset = globalOffsetRef.current;
    const effectRadius = effectRadiusRef.current;
    const time = timeRef.current;

    // 중심부 데드존 (마우스 커서 주변 빈 공간)
    const deadZone = effectRadius * 0.35; // 효과 범위의 35%는 빈 공간

    particlesRef.current.forEach((particle) => {
      // 현재 위치와 마우스 사이의 거리 및 각도
      const dx = particle.x - mouse.x;
      const dy = particle.y - mouse.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const angleToMouse = Math.atan2(dy, dx);

      // 거리에 따른 영향력 계산 (데드존 적용)
      let influence = 0;
      let targetLength = MIN_LENGTH;

      if (distance > deadZone && distance < effectRadius) {
        // 데드존 이후부터 effectRadius까지의 범위에서 영향력 계산
        const activeRange = effectRadius - deadZone;
        const normalizedDist = (distance - deadZone) / activeRange;
        // 링 형태로 중간이 가장 강하게
        influence =
          Math.sin(normalizedDist * Math.PI) * 0.85 +
          (1 - normalizedDist) * 0.15;
        influence = Math.max(0, influence);

        // 물결 효과: 시간 + 거리 기반 웨이브 (크기 변동) - 더 극적으로
        const wavePhase = distance * 0.045 + time * 3.5;
        const waveMultiplier = 0.5 + Math.sin(wavePhase) * 0.5; // 0.0 ~ 1.0 범위

        // 타겟 길이 계산 (물결에 따라 크기 변동)
        targetLength =
          MIN_LENGTH +
          (particle.baseLength - MIN_LENGTH) * influence * waveMultiplier;
        targetLength = Math.max(MIN_LENGTH, Math.min(MAX_LENGTH, targetLength));
      } else if (distance <= deadZone) {
        // 데드존 안에서는 매우 작게
        targetLength = MIN_LENGTH;
      }

      // 길이 부드럽게 변화
      particle.currentLength += (targetLength - particle.currentLength) * 0.12;

      // 자석처럼 마우스 방향으로 정렬 (더 넓은 범위, 데드존 적용)
      const alignRadius = effectRadius * 1.5;
      let alignInfluence = 0;
      if (distance > deadZone && distance < alignRadius) {
        const alignRange = alignRadius - deadZone;
        alignInfluence = Math.pow(1 - (distance - deadZone) / alignRange, 0.4);
      }

      // 물결 효과로 각도 흔들림 - 더 극적으로
      const waveAngleOffset =
        Math.sin(distance * 0.02 + time * 2.5) * alignInfluence * 0.4;
      const targetRotation = angleToMouse + waveAngleOffset;

      // 회전 부드럽게 전환
      let rotationDiff = targetRotation - particle.rotation;
      while (rotationDiff > Math.PI) rotationDiff -= Math.PI * 2;
      while (rotationDiff < -Math.PI) rotationDiff += Math.PI * 2;
      particle.rotation +=
        rotationDiff * 0.06 * alignInfluence +
        particle.rotationSpeed * (1 - alignInfluence);

      // 위치 계산: 전체 무리 이동 + 물결 효과
      let offsetX = globalOffset.x * (0.3 + influence * 0.7);
      let offsetY = globalOffset.y * (0.3 + influence * 0.7);

      // 물결 위치 효과 (방사형으로 안팎으로 움직임) - 더 극적으로
      if (distance < effectRadius) {
        const wavePhase = distance * 0.035 + time * 3;
        const waveStrength = Math.sin(wavePhase) * influence * 7;
        offsetX += Math.cos(angleToMouse) * waveStrength;
        offsetY += Math.sin(angleToMouse) * waveStrength;
      }

      const targetX = particle.originX + offsetX;
      const targetY = particle.originY + offsetY;

      // 부드럽게 이동
      particle.x += (targetX - particle.x) * 0.08;
      particle.y += (targetY - particle.y) * 0.08;

      // 알파값: 길이에 비례
      const lengthRatio =
        (particle.currentLength - MIN_LENGTH) / (MAX_LENGTH - MIN_LENGTH);
      const alpha = 0.35 + lengthRatio * 0.45;

      // RGB 색상: 시간 기반 + 거리에 따른 위상 차이
      const baseHue = (time * 25) % 360;
      const distancePhase = distance * 0.25;
      const hue = (baseHue + distancePhase) % 360;
      const saturation = 0.65 + influence * 0.25;
      const lightness = 0.5 + influence * 0.1;
      const color = hslToRgb(hue, saturation, lightness);

      drawParticle(ctx, particle, alpha, color);
    });

    animationRef.current = requestAnimationFrame(animate);
  }, [drawParticle]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      if (contained && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        canvasRectRef.current = rect;
      } else {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
      initParticles(canvas.width, canvas.height);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (contained && canvasRectRef.current) {
        // contained 모드: 컨테이너 기준 좌표로 변환
        const rect = canvasRectRef.current;
        targetMouseRef.current = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        };
      } else {
        targetMouseRef.current = { x: e.clientX, y: e.clientY };
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        if (contained && canvasRectRef.current) {
          const rect = canvasRectRef.current;
          targetMouseRef.current = {
            x: e.touches[0].clientX - rect.left,
            y: e.touches[0].clientY - rect.top,
          };
        } else {
          targetMouseRef.current = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY,
          };
        }
      }
    };

    // contained 모드에서 스크롤 시 rect 업데이트
    const handleScroll = () => {
      if (contained && containerRef.current) {
        canvasRectRef.current = containerRef.current.getBoundingClientRect();
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    // ResizeObserver로 컨테이너 크기 변화 감지
    let resizeObserver: ResizeObserver | null = null;
    if (contained && containerRef.current) {
      resizeObserver = new ResizeObserver(() => {
        handleResize();
      });
      resizeObserver.observe(containerRef.current);
      window.addEventListener("scroll", handleScroll, { passive: true });
    }

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      if (contained) {
        window.removeEventListener("scroll", handleScroll);
      }
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      cancelAnimationFrame(animationRef.current);
    };
  }, [initParticles, animate, contained]);

  if (contained) {
    return (
      <div
        ref={containerRef}
        className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
        style={{ zIndex: 15 }}
      >
        <canvas ref={canvasRef} className="absolute inset-0" />
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none ${className}`}
      style={{ zIndex: 15 }}
    />
  );
};

export default ParticleCanvas;

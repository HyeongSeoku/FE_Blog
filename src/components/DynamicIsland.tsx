"use client";

import classNames from "classnames";
import * as React from "react";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useControllableState } from "@/hooks/useControllableState";
import { useMergedRef } from "@/hooks/useMergedRef";
import ArrowIcon from "@/icon/arrow_right.svg";

export interface DynamicIslandItem {
  id: string;
  label: string;
  active?: boolean;
}

export interface DynamicIslandProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title" | "children"> {
  /** Label shown in the collapsed pill and as the expanded header */
  title: string;
  /** Progress ring value, 0-100. Omit to hide the ring. */
  progress?: number;
  /** Entries revealed once expanded (e.g. TOC headings) */
  items?: DynamicIslandItem[];
  expanded?: boolean;
  defaultExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  onItemSelect?: (item: DynamicIslandItem, index: number) => void;
}

const RING_SIZE = 20;
const RING_RADIUS = 8;
const RING_STROKE = 4;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

// iOS Dynamic Island 특유의 "탄성 있는 팽창" 느낌을 위한 easeOutBack 커브.
const HEIGHT_TRANSITION =
  "grid-template-rows 450ms cubic-bezier(0.34, 1.56, 0.64, 1)";

// grid-template-rows 트랜지션은 오버슈트를 지원하지 않아, 눌림 바운스는
// transform: scale()로 별도 처리한다 (누르는 순간 살짝 눌렸다가 스프링백).
const BUMP_SCALE = 1.06;
const BUMP_IN_TRANSITION = "transform 120ms ease-out";
const BUMP_OUT_TRANSITION = "transform 380ms cubic-bezier(0.34, 1.56, 0.64, 1)";

function ProgressRing({ progress }: { progress: number }) {
  const clamped = Math.min(100, Math.max(0, progress));
  const offset = RING_CIRCUMFERENCE * (1 - clamped / 100);

  return (
    <svg
      width={RING_SIZE}
      height={RING_SIZE}
      viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
      className="-rotate-90 shrink-0"
      aria-hidden="true"
    >
      <circle
        cx={RING_SIZE / 2}
        cy={RING_SIZE / 2}
        r={RING_RADIUS}
        fill="none"
        stroke="currentColor"
        strokeWidth={RING_STROKE}
        className="text-white/25"
      />
      <circle
        cx={RING_SIZE / 2}
        cy={RING_SIZE / 2}
        r={RING_RADIUS}
        fill="none"
        stroke="currentColor"
        strokeWidth={RING_STROKE}
        strokeLinecap="round"
        strokeDasharray={RING_CIRCUMFERENCE}
        strokeDashoffset={offset}
        className="text-white"
      />
    </svg>
  );
}

/**
 * iOS Dynamic Island 스타일 플로팅 pill — 제목 + 진행률 링을 보여주다가
 * 클릭하면 TOC 항목 목록으로 펼쳐진다. 위치는 강제하지 않는다: 루트가
 * ref/props를 그대로 전달하므로 소비 측이 style/className으로 배치한다.
 */
const DynamicIsland = React.forwardRef<HTMLDivElement, DynamicIslandProps>(
  (
    {
      title,
      progress,
      items = [],
      expanded: expandedProp,
      defaultExpanded = false,
      onExpandedChange,
      onItemSelect,
      className,
      onKeyDown,
      style,
      ...props
    },
    ref,
  ) => {
    const [expanded, setExpanded] = useControllableState({
      value: expandedProp,
      defaultValue: defaultExpanded,
      onChange: onExpandedChange,
    });

    const listId = React.useId();
    const containerRef = React.useRef<HTMLDivElement>(null);
    const triggerRef = React.useRef<HTMLButtonElement>(null);
    const mergedRef = useMergedRef(ref, containerRef);
    const hasItems = items.length > 0;

    const [isBumping, setIsBumping] = React.useState(false);
    const bumpTimeoutRef = React.useRef<ReturnType<typeof setTimeout>>();

    React.useEffect(
      () => () => {
        clearTimeout(bumpTimeoutRef.current);
      },
      [],
    );

    const triggerBump = () => {
      clearTimeout(bumpTimeoutRef.current);
      setIsBumping(true);
      bumpTimeoutRef.current = setTimeout(() => setIsBumping(false), 120);
    };

    useClickOutside(containerRef, () => {
      if (expanded) setExpanded(false);
    });

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Escape" && expanded) {
        event.preventDefault();
        setExpanded(false);
        triggerRef.current?.focus();
      }
      onKeyDown?.(event);
    };

    const handleItemSelect = (item: DynamicIslandItem, index: number) => {
      triggerBump();
      onItemSelect?.(item, index);
      setExpanded(false);
    };

    const bumpScale = isBumping ? `scale(${BUMP_SCALE})` : "scale(1)";
    const composedTransform = style?.transform
      ? `${style.transform} ${bumpScale}`
      : bumpScale;

    return (
      // biome-ignore lint/a11y/noStaticElementInteractions: onKeyDown only handles Escape-to-close on this popover container; the actual interactive controls are the nested buttons
      <div
        ref={mergedRef}
        onKeyDown={handleKeyDown}
        style={{
          ...style,
          transform: composedTransform,
          transition: isBumping ? BUMP_IN_TRANSITION : BUMP_OUT_TRANSITION,
        }}
        className={classNames(
          "w-40 select-none overflow-hidden rounded-2xl bg-black shadow-xl",
          className,
        )}
        {...props}
      >
        <button
          ref={triggerRef}
          type="button"
          disabled={!hasItems}
          onClick={() => {
            triggerBump();
            setExpanded((prev) => !prev);
          }}
          aria-expanded={hasItems ? expanded : undefined}
          aria-controls={hasItems ? listId : undefined}
          className="flex h-8 w-full items-center gap-x-[7px] px-2 pr-4 text-left disabled:cursor-default"
        >
          {progress !== undefined && <ProgressRing progress={progress} />}
          <span className="min-w-0 flex-1 truncate text-[10.5px] font-medium text-white">
            {title}
          </span>
          {hasItems && (
            <ArrowIcon
              aria-hidden="true"
              className={classNames(
                "h-3 w-3 shrink-0 text-white transition-transform duration-200",
                expanded ? "-rotate-90" : "rotate-90",
              )}
            />
          )}
        </button>

        {hasItems && (
          <div
            style={{
              display: "grid",
              gridTemplateRows: expanded ? "1fr" : "0fr",
              transition: HEIGHT_TRANSITION,
            }}
          >
            <div className="overflow-hidden">
              <ul
                id={listId}
                inert={!expanded}
                className="flex flex-col gap-y-0.5 px-2 pb-2"
              >
                {items.map((item, index) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      aria-current={item.active ? "true" : undefined}
                      onClick={() => handleItemSelect(item, index)}
                      className={classNames(
                        "w-full truncate rounded-full px-3 py-1.5 text-left text-xs transition-colors",
                        item.active
                          ? "bg-white/10 font-medium text-white"
                          : "text-white/60 hover:text-white",
                      )}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    );
  },
);

DynamicIsland.displayName = "DynamicIsland";

export { DynamicIsland };

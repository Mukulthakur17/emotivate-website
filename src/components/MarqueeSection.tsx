"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useCallback, useEffect } from "react";

interface TagData {
  label: string;
  tooltip: string;
  color: string;
  iconId: string;
}

const row1Tags: TagData[] = [
  { iconId: "relationship", label: "relationship issues", tooltip: "Difficulties in romantic, family, or social connections that affect how you feel and relate to others.", color: "#5ba3d0" },
  { iconId: "depression", label: "depression", tooltip: "Persistent low mood, loss of interest, and fatigue that impact daily life and well-being.", color: "#9b7bc4" },
  { iconId: "anger", label: "anger management", tooltip: "Learning to recognise triggers and respond to anger in healthier, more constructive ways.", color: "#d87a94" },
  { iconId: "trauma", label: "trauma", tooltip: "Emotional and psychological impact of distressing experiences that affect how you feel and cope.", color: "#7c6bb8" },
  { iconId: "panic", label: "panic attacks", tooltip: "Sudden, intense fear or discomfort with physical symptoms like racing heart, breathlessness, or dizziness.", color: "#c97aa8" },
  { iconId: "eating", label: "eating disorders", tooltip: "Difficulties with eating, body image, or weight that affect physical and emotional health.", color: "#c98a5c" },
  { iconId: "body", label: "body issues", tooltip: "Distress or preoccupation with how you look, affecting self-esteem and daily life.", color: "#5ba8c4" },
  { iconId: "procrastination", label: "procrastination", tooltip: "Putting off tasks despite wanting to get them done, often linked to anxiety, perfectionism, or overwhelm.", color: "#9bb05c" },
  { iconId: "intrusive", label: "intrusive thoughts", tooltip: "Unwanted, repetitive thoughts or images that feel hard to control or dismiss.", color: "#5a9e9e" },
  { iconId: "stress", label: "stress", tooltip: "Physical and emotional tension from demands or pressure, affecting mood, sleep, and health.", color: "#c9a050" },
  { iconId: "fear", label: "irrational fear", tooltip: "Intense, disproportionate fear of specific situations, objects, or outcomes (phobias).", color: "#6b9bc4" },
  { iconId: "cognitive", label: "cognitive distortion", tooltip: "Unhelpful thinking patterns that skew how you see yourself, others, or situations.", color: "#5ab88a" },
  { iconId: "gaslighting", label: "gaslighting", tooltip: "When someone denies your reality or makes you doubt your perceptions, memories, or feelings.", color: "#5a8fc9" },
  { iconId: "narcissism", label: "narcissism", tooltip: "A pattern of needing admiration, lack of empathy, and difficulty in mutual relationships (in self or others).", color: "#a87bb8" },
  { iconId: "social", label: "social anxiety", tooltip: "Strong fear or avoidance of social situations due to worry about being judged or embarrassed.", color: "#8b7bb8" },
  { iconId: "ocd", label: "ocd", tooltip: "Recurring unwanted thoughts (obsessions) and urges to do certain actions (compulsions) to reduce anxiety.", color: "#5ab09a" },
  { iconId: "addiction", label: "addiction", tooltip: "Difficulty controlling use of a substance or behaviour despite negative effects on life and health.", color: "#c49a58" },
  { iconId: "burnout", label: "burnout", tooltip: "Physical and emotional exhaustion from prolonged stress, often from work or caregiving.", color: "#c9b050" },
  { iconId: "anxiety", label: "anxiety", tooltip: "Persistent worry, nervousness, or dread that can affect sleep, focus, and daily functioning.", color: "#4a9bb5" },
];

const row2Tags: TagData[] = [
  { iconId: "anxiety", label: "anxiety", tooltip: "Persistent worry, nervousness, or dread that can affect sleep, focus, and daily functioning.", color: "#4a9bb5" },
  { iconId: "burnout", label: "burnout", tooltip: "Physical and emotional exhaustion from prolonged stress, often from work or caregiving.", color: "#c9b050" },
  { iconId: "stress", label: "stress", tooltip: "Physical and emotional tension from demands or pressure, affecting mood, sleep, and health.", color: "#c9a050" },
  { iconId: "ocd", label: "ocd", tooltip: "Recurring unwanted thoughts (obsessions) and urges to do certain actions (compulsions) to reduce anxiety.", color: "#5ab09a" },
  { iconId: "trauma", label: "trauma", tooltip: "Emotional and psychological impact of distressing experiences that affect how you feel and cope.", color: "#7c6bb8" },
  { iconId: "social", label: "social anxiety", tooltip: "Strong fear or avoidance of social situations due to worry about being judged or embarrassed.", color: "#8b7bb8" },
  { iconId: "depression", label: "depression", tooltip: "Persistent low mood, loss of interest, and fatigue that impact daily life and well-being.", color: "#9b7bc4" },
  { iconId: "intrusive", label: "intrusive thoughts", tooltip: "Unwanted, repetitive thoughts or images that feel hard to control or dismiss.", color: "#5a9e9e" },
  { iconId: "eating", label: "eating disorders", tooltip: "Difficulties with eating, body image, or weight that affect physical and emotional health.", color: "#c98a5c" },
  { iconId: "fear", label: "irrational fear", tooltip: "Intense, disproportionate fear of specific situations, objects, or outcomes (phobias).", color: "#6b9bc4" },
  { iconId: "relationship", label: "relationship issues", tooltip: "Difficulties in romantic, family, or social connections that affect how you feel and relate to others.", color: "#5ba3d0" },
  { iconId: "cognitive", label: "cognitive distortion", tooltip: "Unhelpful thinking patterns that skew how you see yourself, others, or situations.", color: "#5ab88a" },
  { iconId: "anger", label: "anger management", tooltip: "Learning to recognise triggers and respond to anger in healthier, more constructive ways.", color: "#d87a94" },
  { iconId: "gaslighting", label: "gaslighting", tooltip: "When someone denies your reality or makes you doubt your perceptions, memories, or feelings.", color: "#5a8fc9" },
  { iconId: "narcissism", label: "narcissism", tooltip: "A pattern of needing admiration, lack of empathy, and difficulty in mutual relationships (in self or others).", color: "#a87bb8" },
  { iconId: "body", label: "body issues", tooltip: "Distress or preoccupation with how you look, affecting self-esteem and daily life.", color: "#5ba8c4" },
  { iconId: "panic", label: "panic attacks", tooltip: "Sudden, intense fear or discomfort with physical symptoms like racing heart, breathlessness, or dizziness.", color: "#c97aa8" },
  { iconId: "addiction", label: "addiction", tooltip: "Difficulty controlling use of a substance or behaviour despite negative effects on life and health.", color: "#c49a58" },
  { iconId: "procrastination", label: "procrastination", tooltip: "Putting off tasks despite wanting to get them done, often linked to anxiety, perfectionism, or overwhelm.", color: "#9bb05c" },
];

function IconSprite() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" style={{ position: "absolute", width: 0, height: 0 }} aria-hidden="true">
      <symbol id="icon-relationship" viewBox="0 0 24 24"><path fill="currentColor" d="M12 4c.5 0 1 .1 1.4.3l-.8 2.2-.6-1.8.4-1.6h.6zM9 6.5l1.2 3.6-1.5.5-1.2-3.6 1.5-.5zm6 0l1.5.5-1.2 3.6-1.5-.5 1.2-3.6zM6 10l2 1v2l-2 1-2-1v-2l2-1zm12 0l2 1v2l-2 1-2-1v-2l2-1zm-8 2.5l-1.5.5 1.2 3.6 1.5-.5-1.2-3.6zm4 0l-1.2-3.6 1.5-.5 1.2 3.6-1.5.5zM12 14c-1.5 0-2.8.5-3.9 1.3l.9 2.6c.8-.5 1.8-.9 3-.9s2.2.4 3 .9l.9-2.6C14.8 14.5 13.5 14 12 14z"/></symbol>
      <symbol id="icon-depression" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2c-.6 0-1.1.2-1.5.6C10.1 3 10 3.5 10 4v.2C7 5.5 5 8.1 5 11c0 3.9 3.1 7 7 7s7-3.1 7-7c0-2.9-2-5.5-4.8-6.8V4c0-.5-.1-1-.5-1.4C14.1 2.2 13.6 2 12 2zm0 2c.3 0 .5.1.7.3.2.2.3.4.3.7v1.2c2.2.8 3.5 2.8 3.5 5 0 2.8-2.2 5-5 5s-5-2.2-5-5c0-2.2 1.3-4.2 3.5-5V5c0-.3.1-.5.3-.7.2-.2.4-.3.7-.3z"/></symbol>
      <symbol id="icon-anger" viewBox="0 0 24 24"><circle fill="currentColor" cx="9" cy="10" r="4" opacity=".9"/><circle fill="currentColor" cx="15" cy="10" r="4" opacity=".9"/><path fill="currentColor" d="M8 16c-1.2 1.4-2 3.2-2 5h12c0-1.8-.8-3.6-2-5-1 .8-2.2 1.2-3.5 1.2S9 16.8 8 16z"/></symbol>
      <symbol id="icon-trauma" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2L3 6v4c0 4.5 2.9 8.7 7 10 4.1-1.3 7-5.5 7-10V6l-9-4zm0 2.2l6 2.7v3.1c0 3.2-1.8 6.2-4.5 7.6-2.7-1.4-4.5-4.4-4.5-7.6V6.9l3-1.3V4L12 4.2z"/></symbol>
      <symbol id="icon-panic" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2l2.5 5.5L20 8l-4 4 1.5 6.5L12 16l-5.5 2.5L8 12 4 8l5.5-.5L12 2z"/></symbol>
      <symbol id="icon-eating" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C9.2 2 7 4.2 7 7c0 1.5.8 2.8 2 3.5V20h2v-9.5c1.2-.7 2-2 2-3.5 0-2.8-2.2-5-5-5zm0 2c1.7 0 3 1.3 3 3s-1.3 3-3 3-3-1.3-3-3 1.3-3 3-3z"/><path fill="currentColor" d="M17 6c-.6 0-1 .4-1 1v3c0 2.2 1.8 4 4 4v2h-8v2h10v-2h-2c-3.3 0-6-2.7-6-6V7c0-.6-.4-1-1-1z"/></symbol>
      <symbol id="icon-body" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2a2 2 0 0 1 2 2c0 .6-.3 1.1-.8 1.4V8h1.6c2.2 0 4 1.8 4 4h1.2v1H18v6.5c0 1-.8 1.8-1.8 1.8H7.8c-1 0-1.8-.8-1.8-1.8V13h-.4v-1h1.2c0-2.2 1.8-4 4-4h1.6V5.4c-.5-.3-.8-.8-.8-1.4a2 2 0 0 1 2-2zM9.2 14.5c-.5 0-.9.4-.9.9s.4.9.9.9.9-.4.9-.9-.4-.9-.9-.9zm5.6 0c-.5 0-.9.4-.9.9s.4.9.9.9.9-.4.9-.9-.4-.9-.9-.9z"/></symbol>
      <symbol id="icon-procrastination" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8zm.5-11H12v5l4 2.4-.8-1.2-3.2-1.9V9z"/></symbol>
      <symbol id="icon-intrusive" viewBox="0 0 24 24"><path fill="currentColor" d="M12 4c-3.3 0-6 2.7-6 6 0 1.2.4 2.3 1 3.2l-1.5 2.2 2-.8c.8.5 1.7.8 2.6.8 3.3 0 6-2.7 6-6s-2.7-6-6-6zm0 10c-1.5 0-2.8-.5-3.9-1.3l.3-1.8c.9.5 2 .8 3.1.8 2.2 0 4-1.8 4-4 0-2.2-1.8-4-4-4-1.1 0-2.2.3-3.1.8l-.3-1.8c1.1-.8 2.4-1.3 3.9-1.3 3.3 0 6 2.7 6 6s-2.7 6-6 6z"/><circle fill="currentColor" cx="9" cy="11" r="1"/><circle fill="currentColor" cx="12" cy="11" r="1"/><circle fill="currentColor" cx="15" cy="11" r="1"/></symbol>
      <symbol id="icon-stress" viewBox="0 0 24 24"><path fill="currentColor" d="M13 2L9 12h3l-2 8 8-10h-3l2-8z"/></symbol>
      <symbol id="icon-fear" viewBox="0 0 24 24"><path fill="currentColor" d="M12 4.5C7 4.5 2.7 7.6 1 12c1.7 4.4 6 7.5 11 7.5s9.3-3.1 11-7.5c-1.7-4.4-6-7.5-11-7.5zM12 17c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5zm0-8c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3z"/></symbol>
      <symbol id="icon-cognitive" viewBox="0 0 24 24"><path fill="currentColor" d="M12 3v4l-4 4 4 4v4l6-6-6-6v4l-2-2 2-2V3zm-4 8l-3 3 3 3v-2l-1-1 1-1h2v-2H8zm8 0v2h2l1 1-1 1v2l3-3-3-3z"/></symbol>
      <symbol id="icon-gaslighting" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8zm-1-12h2v6h-2V8zm0 8h2v2h-2v-2z"/></symbol>
      <symbol id="icon-narcissism" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7-6.3-4.5L5.7 21l2.3-7-6-4.6h7.6L12 2z"/></symbol>
      <symbol id="icon-social" viewBox="0 0 24 24"><path fill="currentColor" d="M16 11c1.7 0 3-1.3 3-3s-1.3-3-3-3-3 1.3-3 3 1.3 3 3 3zm-8 0c1.7 0 3-1.3 3-3s-1.3-3-3-3-3 1.3-3 3 1.3 3 3 3zm0 2c-2.3 0-7 1.2-7 3.5V19h14v-2.5c0-2.3-4.7-3.5-7-3.5zm8 0c-.3 0-.6 0-1 .1 1.2.8 2 2 2 3.4V19h6v-2.5c0-2.3-4.7-3.5-7-3.5z"/></symbol>
      <symbol id="icon-ocd" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2c4.4 0 8 3.6 8 8 0 2.2-.9 4.2-2.3 5.6l-2.8-2.8-1.4 1.4 2.8 2.8C15.2 18.1 13.7 18.6 12 18.6c-4.4 0-8-3.6-8-8s3.6-8 8-8c1.7 0 3.2.5 4.5 1.3l-1.4 1.4C14.2 4.2 13.2 4 12 4c-3.3 0-6 2.7-6 6s2.7 6 6 6c1.2 0 2.2-.2 3.2-.6l-1.4-1.4c-.6.3-1.3.5-2 .5-2.2 0-4-1.8-4-4s1.8-4 4-4c.7 0 1.4.2 2 .5l1.4-1.4C14.2 4.2 13.2 4 12 4z"/></symbol>
      <symbol id="icon-addiction" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2c-2 0-3.8.8-5.1 2.1L4.9 6.3C6.2 5 8 4.2 10 4.2s3.8.8 5.1 2.1l2-2.2C15.8 2.8 14 2 12 2zm-2 4.2L7.8 8.4C8.7 7.5 9.9 7 11.2 7s2.5.5 3.4 1.4l2.2-2.2c-1.2-1.2-2.8-1.8-4.4-1.8-1.6 0-3.2.6-4.4 1.8L10 6.2zM6 12l2 2-2 2-2-2 2-2zm12 0l2 2-2 2-2-2 2-2zm-7 3l2-2 2 2-2 2-2-2z"/></symbol>
      <symbol id="icon-burnout" viewBox="0 0 24 24"><path fill="currentColor" d="M12 23c-1.1 0-2-.9-2-2h4c0 1.1-.9 2-2 2zm5-6V11c0-3.1-1.6-5.6-4.5-6.3V4c0-.8-.7-1.5-1.5-1.5h-3c-.8 0-1.5.7-1.5 1.5v.7C7.6 5.4 6 7.9 6 11v6l-2 2v1h16v-1l-2-2zm-5-1c-1.1 0-2-.9-2-2h4c0 1.1-.9 2-2 2z"/></symbol>
      <symbol id="icon-anxiety" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4 0-7.5-2.2-9.3-5.5L16.9 6.7C15.5 5.2 13.8 4 12 4c-4.4 0-8 3.6-8 8 0 1.5.4 2.9 1.1 4.1l2.2-2.2C6.5 12.8 6 12 6 11.2c0-1.3 1-2.4 2.3-2.5l.5 2c-.6.1-1 .6-1 1.2 0 .7.5 1.2 1.2 1.2.4 0 .8-.2 1-.5l2 .9c-.5.8-1.4 1.3-2.4 1.3-2 0-3.6-1.6-3.6-3.6 0-.9.3-1.7.9-2.3L5.7 6.3C7.2 4.2 9.5 3 12 3c5 0 9 4 9 9s-4 9-9 9z"/></symbol>
    </svg>
  );
}

function Tag({ tag, rowPosition, isActive, onTap }: { tag: TagData; rowPosition: "row-top" | "row-bottom"; isActive: boolean; onTap: () => void }) {
  return (
    <span
      className={`tag-item ${rowPosition} ${isActive ? "tag-active" : ""} relative inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium text-[#55546A] cursor-default flex-shrink-0 transition-all duration-200 hover:-translate-y-0.5`}
      style={{
        background: "linear-gradient(145deg, rgba(255,255,255,0.55), rgba(0,0,0,0.05))",
        borderTop: "1px solid rgba(255,255,255,0.6)",
        border: "1px solid rgba(0,0,0,0.06)",
        boxShadow: "0 3px 6px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.5)",
      }}
      onClick={onTap}
    >
      <span className="w-[18px] h-[18px] flex-shrink-0 flex items-center justify-center" style={{ color: tag.color }}>
        <svg viewBox="0 0 24 24" className="w-[16px] h-[16px]">
          <use href={`#icon-${tag.iconId}`} />
        </svg>
      </span>
      {tag.label}
      <span className="tag-tooltip">{tag.tooltip}</span>
    </span>
  );
}

function MarqueeRow({ tags, direction, rowPosition, activeTagId, onTagTap }: { tags: TagData[]; direction: "left" | "right"; rowPosition: "row-top" | "row-bottom"; activeTagId: string | null; onTagTap: (id: string) => void }) {
  const doubled = [...tags, ...tags];
  const isPaused = activeTagId !== null;
  return (
    <div
      className={`marquee-row ${rowPosition} ${direction === "left" ? "animate-scroll-left" : "animate-scroll-right"}`}
      style={isPaused ? { animationPlayState: "paused" } : undefined}
    >
      {doubled.map((tag, i) => {
        const tagId = `${tag.label}-${i}`;
        return (
          <Tag
            key={tagId}
            tag={tag}
            rowPosition={rowPosition}
            isActive={activeTagId === tagId}
            onTap={() => onTagTap(tagId)}
          />
        );
      })}
    </div>
  );
}

export default function MarqueeSection() {
  const ref = useRef(null);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [activeTagId, setActiveTagId] = useState<string | null>(null);

  const handleTagTap = useCallback((tagId: string) => {
    setActiveTagId((prev) => (prev === tagId ? null : tagId));
  }, []);

  useEffect(() => {
    if (!activeTagId) return;
    const handleOutsideTap = (e: TouchEvent | MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".tag-item")) {
        setActiveTagId(null);
      }
    };
    document.addEventListener("touchstart", handleOutsideTap);
    document.addEventListener("mousedown", handleOutsideTap);
    return () => {
      document.removeEventListener("touchstart", handleOutsideTap);
      document.removeEventListener("mousedown", handleOutsideTap);
    };
  }, [activeTagId]);

  return (
    <section ref={sectionRef} className="py-14 md:py-18 relative bg-navy-800" aria-label="Topics we support">
      <IconSprite />
      <div className="absolute inset-0 bg-gradient-to-b from-navy-900 via-navy-900/20 to-navy-900" />

      <div className="relative" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 px-6"
        >
          <h2 className="text-2xl md:text-3xl font-light tracking-tight text-offwhite">
            However you feel right now —{" "}
            <span className="text-violet-muted">we&apos;re here</span>.
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.3 }}
          className="marquee-viewport"
        >
          <div className="space-y-3 py-4">
            <MarqueeRow tags={row1Tags} direction="left" rowPosition="row-top" activeTagId={activeTagId} onTagTap={handleTagTap} />
            <MarqueeRow tags={row2Tags} direction="right" rowPosition="row-bottom" activeTagId={activeTagId} onTagTap={handleTagTap} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

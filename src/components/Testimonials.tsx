"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const testimonials = [
  {
    name: "Jincy",
    role: "Client",
    text: "I'm glad and grateful that I found you at this dark phase in my life, where I stumbled really hard. Thanks for lending me your hand in restoring and healing myself. It hasn't been an easy journey for me at all. I used to get petrified when I get the panic attacks, but now, with the techniques that you taught me, I'm able to face it in a much bolder way and take care of my inner self, that has gone through a lot in the last couple of years. Thanks very much ♥️ You're a star!",
  },
  {
    name: "Pascal",
    role: "Client",
    text: "I started therapy with Sukhmani because of my anxiety, and she has helped me a lot. She is very understanding and has a lot of experience. She has taught me many helpful techniques, and my quality of life has improved since working with her. I truly appreciate her support and would highly recommend her to anyone looking for a kind and skilled therapist.",
  },
  {
    name: "Nitish",
    role: "Client",
    text: "I have been in therapy with Sukhmani for two years, and the sessions have been a deeply meaningful experience for me. The sessions have helped me reduce overthinking, identify my triggers, communicate effectively, understand my attachment style, and gain a better understanding of myself and my past. The sessions have further helped me form and nurture new friendships and helped me start caring for myself for the first time in my life. I feel more positive and have more clarity on what I want in life. Thank you, Sukhmani 😊",
  },
  {
    name: "Kingshuk Sen",
    role: "Client",
    text: "The first time I reached out to Sukhmani, my head was not in the right space. Years of emotional backlog and unaddressed issues had piled up to an extent that even performing daily chores had become impossible. But I finally took a leap, although I was highly sceptical of the outcome. It has been almost 6 months now that I have been taking therapy. And I wouldn't say that all my fears and insecurities have magically vanished but I feel far better than I did 6 months back. At least now I know that I have someone to speak to.",
  },
  {
    name: "Client",
    role: "Female, 26",
    text: "I started sessions with Emotivate at a point where I felt really stuck. What I liked the most was how practical the sessions were. It wasn't just talking but actually had tools to use in my daily life.",
  },
  {
    name: "Client",
    role: "Student, 21",
    text: "I've tried therapy before, but this felt very different. Sukhmani has a way of making you feel comfortable very quickly. I never felt pressured, and yet I could see changes in how I think and react.",
  },
  {
    name: "Client",
    role: "Working professional, 32",
    text: "What I appreciate about Emotivate is that it doesn't feel one-size-fits-all. The approach felt very personalised to me and my situation, which made a huge difference.",
  },
  {
    name: "Client",
    role: "Male, 40",
    text: "I was quite hesitant to start therapy, but I'm really glad I did. The sessions helped me become more aware of myself and also kinder to myself, which I didn't realise I needed so much.",
  },
  {
    name: "Client",
    role: "Female, 31",
    text: "I came into therapy at a time when I felt completely overwhelmed and honestly a little lost. I didn't expect things to change so much, but working with Sukhmani really helped me slow down and understand what I was feeling instead of constantly avoiding it. The space felt very safe and non-judgmental, which made it easier for me to open up at my own pace. Over time, I started noticing small but important shifts in how I respond to situations and how I treat myself. It's been a very grounding and reassuring experience overall.",
  },
  {
    name: "Client",
    role: "Male, 28",
    text: "I started therapy during a phase where I felt mentally exhausted and unsure about a lot of things in my life. What really helped was how safe and comfortable the sessions felt. I didn't feel rushed or judged at any point. The conversations were insightful but also very practical, which made it easier to actually implement things outside of sessions. Over time, I've noticed that I'm able to manage my thoughts and emotions better, and I feel more confident in handling situations that used to overwhelm me.",
  },
  {
    name: "Shraddha",
    role: "Client",
    text: "After starting therapy with you, my life and perspective have changed so much for the better. You understand me, guide me, appreciate my efforts, and help me grow into a better version of myself. It's been a year, and I'm truly grateful for everything. Thank you from the heart. ❤️",
  },
];

export default function Testimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const tripled = [...testimonials, ...testimonials, ...testimonials];

  return (
    <section
      id="testimonials"
      ref={ref}
      className="py-14 md:py-20 relative overflow-hidden"
    >
      <div className="absolute top-0 left-1/2 w-[600px] h-[400px] bg-teal-soft/[0.03] rounded-full blur-[180px] -translate-x-1/2" />

      <div className="relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-14 px-6"
        >
          <span className="text-teal-soft/80 text-xs tracking-[0.3em] uppercase">
            Testimonials
          </span>
          <h2 className="mt-4 text-3xl md:text-4xl font-light tracking-tight">
            Stories of{" "}
            <span className="text-teal-soft">growth</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="overflow-hidden"
          style={{ perspective: "1200px" }}
        >
          <div
            className="flex gap-8 py-4 animate-scroll-features hover:[animation-play-state:paused]"
            style={{ width: "max-content" }}
          >
            {tripled.map((t, i) => (
              <div
                key={`${t.name}-${t.role}-${i}`}
                className="glass-card glass-card-hover rounded-3xl p-6 md:p-9 w-[280px] md:w-[340px] flex-shrink-0 flex flex-col transition-all duration-500 cursor-default border border-black/[0.07]"
                style={{
                  transformStyle: "preserve-3d",
                  transition: "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), background 0.5s, border-color 0.5s, box-shadow 0.5s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "rotateY(-5deg) translateZ(20px) scale(1.03)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "rotateY(0) translateZ(0) scale(1)";
                }}
              >
                <p className="text-[#68677A] leading-relaxed text-sm flex-1 mb-6">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-soft/20 to-violet-muted/20 flex items-center justify-center text-sm font-medium text-offwhite">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-offwhite">
                      {t.name}
                    </p>
                    <p className="text-xs text-[#9B9AA6]">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

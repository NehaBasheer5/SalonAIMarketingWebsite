"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CmsImage from "@/components/ui/CmsImage";
import { defaultAboutContent, type AboutContent } from "@/lib/content";

type Props = {
  content?: AboutContent["team"];
};

export default function AboutTeam({ content = defaultAboutContent.team }: Props) {
  const [currentCenterIndex, setCurrentCenterIndex] = useState(Math.floor(content.members.length / 2));

  // Auto-rotate carousel every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCenterIndex((prev) => (prev + 1) % content.members.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [content.members.length]);
  // Calculate size and position for each card based on distance from current center
  const getCardProps = (index: number, total: number) => {
    // Calculate relative position to current center
    let relativePosition = index - currentCenterIndex;
    
    // Wrap around for circular positioning
    if (relativePosition > total / 2) {
      relativePosition -= total;
    } else if (relativePosition < -total / 2) {
      relativePosition += total;
    }
    
    const distanceFromCenter = Math.abs(relativePosition);
    
    // Size decreases as we move away from center
    const baseWidth = 260;
    const baseHeight = 320;
    const sizeReduction = distanceFromCenter * 30;
    
    const width = baseWidth - sizeReduction;
    const height = baseHeight - sizeReduction;
    
    // Y position - creates the arc curve
    // Cards further from center are positioned lower
    const yOffset = Math.pow(distanceFromCenter, 1.8) * 18;
    
    // Overlap - each card overlaps the previous one
    const overlapAmount = -50;
    
    // Calculate visual order (left to right)
    const visualOrder = relativePosition;
    
    return {
      width,
      height,
      yOffset,
      overlapAmount,
      scale: 1 - (distanceFromCenter * 0.08),
      distanceFromCenter,
      visualOrder,
    };
  };

  return (
    <section className="w-full overflow-hidden bg-gradient-to-b from-gray-50 to-white py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Header */}
        <div className="mb-10 flex flex-col items-center text-center">
          {content.eyebrow ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-4 text-sm font-medium text-gray-500"
            >
              {content.eyebrow}
            </motion.div>
          ) : null}

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-3xl font-medium tracking-tight text-gray-900 sm:text-4xl lg:text-5xl"
          >
            {content.heading}{" "}
            <span className="text-salon-accent">{content.heading_accent}</span>
          </motion.h2>

          {content.subheading ? (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-4 max-w-2xl text-base text-gray-600"
            >
              {content.subheading}
            </motion.p>
          ) : null}
        </div>

        {/* Team Cards - Arc Layout with Auto-Rotation */}
        <div className="relative flex justify-center overflow-visible pb-12">
          <div className="flex items-start justify-center">
            {content.members
              .map((member, index) => {
                const props = getCardProps(index, content.members.length);
                return { member, index, props, visualOrder: props.visualOrder };
              })
              .sort((a, b) => a.visualOrder - b.visualOrder)
              .map(({ member, index, props }) => {
                const initials = member.name
                  .split(" ")
                  .filter(Boolean)
                  .map((part) => part[0])
                  .join("");

                return (
                  <motion.div
                    key={member.name || `member-${index}`}
                    animate={{
                      y: props.yOffset,
                      scale: 1,
                      opacity: 1,
                    }}
                    transition={{
                      duration: 0.8,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="group relative transition-all duration-500 hover:z-30"
                    style={{
                      marginLeft: props.visualOrder === -Math.floor(content.members.length / 2) ? 0 : props.overlapAmount,
                      zIndex: 30 - Math.floor(props.distanceFromCenter * 5),
                    }}
                  >
                    <motion.div
                      animate={{
                        width: props.width,
                        height: props.height,
                      }}
                      transition={{
                        duration: 0.8,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      whileHover={{
                        scale: 1.08,
                        y: -15,
                        transition: { duration: 0.3 },
                      }}
                      className="relative"
                    >
                      {/* Card Shadow/Glow Effect */}
                      <div className="absolute -inset-2 rounded-[20px] bg-gradient-to-br from-salon-accent/10 to-salon-brand/5 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />

                      {/* Main Card */}
                      <div className="relative h-full w-full overflow-hidden rounded-[16px] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-shadow duration-500 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.25)]">
                        {/* Image Container */}
                        <div className="relative h-full w-full">
                          {member.image_url ? (
                            <CmsImage
                              value={member.image_url}
                              alt={member.name}
                              fill
                              className="object-cover transition-transform duration-700 group-hover:scale-110"
                              sizes="300px"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100">
                              <span
                                className="font-display text-gray-400"
                                style={{ fontSize: props.width * 0.2 }}
                              >
                                {initials}
                              </span>
                            </div>
                          )}

                          {/* Gradient Overlay - Always visible */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                          {/* Info Overlay - Always visible */}
                          <div
                            className="absolute bottom-0 left-0 right-0 text-white transition-all duration-300"
                            style={{ padding: `${props.width * 0.06}px` }}
                          >
                            <h3
                              className="mb-1 font-semibold leading-tight"
                              style={{ fontSize: `${props.width * 0.055}px` }}
                            >
                              {member.name}
                            </h3>
                            {member.role ? (
                              <p
                                className="font-medium opacity-90"
                                style={{ fontSize: `${props.width * 0.042}px` }}
                              >
                                {member.role}
                              </p>
                            ) : null}

                            {/* LinkedIn Icon */}
                            <div className="mt-2">
                              <button
                                className="flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-all hover:bg-white/30"
                                style={{
                                  width: `${props.width * 0.1}px`,
                                  height: `${props.width * 0.1}px`,
                                }}
                              >
                                <svg
                                  style={{
                                    width: `${props.width * 0.05}px`,
                                    height: `${props.width * 0.05}px`,
                                  }}
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                >
                                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                </svg>
                              </button>
                            </div>
                          </div>

                          {/* Hover Border Effect */}
                          <div className="pointer-events-none absolute inset-0 rounded-[16px] border-2 border-white/0 transition-all duration-300 group-hover:border-white/50" />
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}
          </div>
        </div>
      </div>
    </section>
  );
}

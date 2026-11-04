export const motionTokens = {
  duration: {
    instant: 0.1,
    fast: 0.16,
    normal: 0.25,
    moderate: 0.35,
    slow: 0.5,
  },
  distance: {
    small: 6,
    medium: 14,
    large: 22,
  },
  easing: {
    standard: [0.2, 0, 0, 1] as const,
    enter: [0, 0, 0.2, 1] as const,
    exit: [0.4, 0, 1, 1] as const,
    soft: [0.16, 1, 0.3, 1] as const,
  },
  scale: {
    pressed: 0.97,
    initial: 0.985,
  },
};

export const fadeUp = {
  hidden: {
    opacity: 0,
    y: motionTokens.distance.large,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: motionTokens.duration.moderate,
      ease: motionTokens.easing.soft,
    },
  },
};

export const fadeScale = {
  hidden: {
    opacity: 0,
    scale: motionTokens.scale.initial,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: motionTokens.duration.moderate,
      ease: motionTokens.easing.soft,
    },
  },
};

export const staggerChildren = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.04,
    },
  },
};

import { MotionConfig } from "framer-motion";
import { Chat } from "../landing/Chat";
import { Cta } from "../landing/Cta";
import { Devices } from "../landing/Devices";
import { Hero } from "../landing/Hero";
import { ThemeSection } from "../landing/ThemeSection";
import { Wall } from "../landing/Wall";

export function Landing() {
  return (
    <MotionConfig reducedMotion="user">
      <Hero />
      <Chat />
      <ThemeSection />
      <Wall />
      <Devices />
      <Cta />
    </MotionConfig>
  );
}

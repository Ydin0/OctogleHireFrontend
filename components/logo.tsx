"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

function Logo({ className, width = 120, height = 28 }: LogoProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Before hydration, show light logo (default) to avoid flash
  const src = mounted && resolvedTheme === "dark"
    ? "/Octogle Darkmode.svg"
    : "/Octogle Lightmode.svg";

  return (
    <Image
      src={src}
      alt="OctogleHire"
      width={width}
      height={height}
      className={className}
      priority
    />
  );
}

export { Logo };

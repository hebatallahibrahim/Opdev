"use client";

import { useEffect } from "react";
import { playIntro } from "@/lib/sceneStore";

// Inner pages have no preloader: release the header intro and scroll lock right away.
export default function PageIntro() {
  useEffect(() => {
    playIntro();
  }, []);
  return null;
}

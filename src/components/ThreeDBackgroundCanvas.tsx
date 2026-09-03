import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { ThreeDThemeType } from "../types";
import { createThreeScene } from "../utils/threeSceneEngine";

interface ThreeDBackgroundCanvasProps {
  theme?: ThreeDThemeType;
  speed?: number;
  colorPreset?: string;
  isInteractive?: boolean;
  className?: string;
}

export const ThreeDBackgroundCanvas: React.FC<ThreeDBackgroundCanvasProps> = ({
  theme = "liquid-waves",
  speed = 1.0,
  colorPreset = "indigo-violet",
  isInteractive = true,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 700;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
      preserveDrawingBuffer: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const { scene, camera, sceneGroup, update, resize, dispose } =
      createThreeScene(theme, colorPreset, speed, width, height);

    let animationId: number;
    const clock = new THREE.Clock();

    // Mouse parallax tracking
    const handleMouseMove = (e: MouseEvent) => {
      if (!isInteractive) return;
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseRef.current.targetX = x * 4;
      mouseRef.current.targetY = y * 4;
    };

    container.addEventListener("mousemove", handleMouseMove);

    // Resize observer
    const resizeObserver = new ResizeObserver(() => {
      if (!container) return;
      const w = container.clientWidth || 400;
      const h = container.clientHeight || 700;
      resize(w, h);
      renderer.setSize(w, h);
    });
    resizeObserver.observe(container);

    // Animation Loop
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Smooth mouse interpolation
      mouseRef.current.x +=
        (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y +=
        (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      sceneGroup.rotation.y = mouseRef.current.x * 0.1;
      sceneGroup.rotation.x = -mouseRef.current.y * 0.1;

      update(time, delta);
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
      container.removeEventListener("mousemove", handleMouseMove);
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      dispose();
      renderer.dispose();
    };
  }, [theme, speed, colorPreset, isInteractive]);

  return (
    <div
      ref={containerRef}
      id="three-d-canvas-container"
      className={`absolute inset-0 w-full h-full pointer-events-none overflow-hidden ${className}`}
      style={{ zIndex: 0 }}
    />
  );
};

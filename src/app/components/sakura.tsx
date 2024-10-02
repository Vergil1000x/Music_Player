"use client";
import { useEffect, useRef } from "react";

interface PetalCanvasProps {
  speed?: number;
  direction?: "left" | "right";
  className?: string;
  totalPetals?: number;
  petalSrc?: string;
}

const PetalCanvas: React.FC<PetalCanvasProps> = ({
  speed = 0.5,
  direction = "right",
  className = "",
  totalPetals = 100,
  petalSrc = "https://djjjk9bjm164h.cloudfront.net/petal.png",
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const petalArray = useRef<Petal[]>([]); // Use ref to persist the array without causing re-renders.
  const animationRef = useRef<number>(0); // For canceling animation frames.
  const petalImg = useRef<HTMLImageElement | null>(null); // Keep the image loaded only once.

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    // Load the image once
    petalImg.current = new Image();
    petalImg.current.src = petalSrc;

    petalImg.current.addEventListener("load", () => {
      petalArray.current = Array.from(
        { length: totalPetals },
        () => new Petal(canvas, petalImg.current as HTMLImageElement)
      );
      render();
    });

    const render = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      petalArray.current.forEach((petal) => petal.animate(direction, speed));
      animationRef.current = window.requestAnimationFrame(render); // Store the animation frame id
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    handleResize(); // Initial resize to fit the window.
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.cancelAnimationFrame(animationRef.current); // Clean up the animation frame.
    };
  }, [direction, speed, totalPetals, petalSrc]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      let clientX = 0;

      if (e instanceof MouseEvent) {
        clientX = e.clientX;
      } else if (e instanceof TouchEvent && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
      }

      const mouseX = clientX / window.innerWidth;
      Petal.updateMouseX(mouseX);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleMouseMove);
    };
  }, []);

  return <canvas ref={canvasRef} className={className}></canvas>;
};

// Petal class
class Petal {
  static mouseX = 0;

  x: number;
  y: number;
  w: number;
  h: number;
  opacity: number;
  flip: number;
  xSpeed: number;
  ySpeed: number;
  flipSpeed: number;
  canvas: HTMLCanvasElement;
  img: HTMLImageElement;

  constructor(canvas: HTMLCanvasElement, img: HTMLImageElement) {
    this.canvas = canvas;
    this.img = img;
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height * 2 - canvas.height;
    this.w = 25 + Math.random() * 15;
    this.h = 20 + Math.random() * 10;
    this.opacity = this.w / 40;
    this.flip = Math.random();
    this.xSpeed = 1.5 + Math.random() * 2;
    this.ySpeed = 1 + Math.random() * 1;
    this.flipSpeed = Math.random() * 0.03;
  }

  static updateMouseX(mouseX: number) {
    Petal.mouseX = mouseX;
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.y > this.canvas.height || this.x > this.canvas.width) {
      this.x = -this.img.width;
      this.y = Math.random() * this.canvas.height * 2 - this.canvas.height;
      this.xSpeed = 1.5 + Math.random() * 2;
      this.ySpeed = 1 + Math.random() * 1;
      this.flip = Math.random();
    }
    ctx.globalAlpha = this.opacity;
    ctx.drawImage(
      this.img,
      this.x,
      this.y,
      this.w * (0.6 + Math.abs(Math.cos(this.flip)) / 3),
      this.h * (0.8 + Math.abs(Math.sin(this.flip)) / 5)
    );
  }

  animate(direction: string, speed: number) {
    const directionMultiplier = direction === "left" ? -1 : 1;
    const ctx = this.canvas.getContext("2d");
    if (!ctx) return;

    this.x += (this.xSpeed + Petal.mouseX * 5) * directionMultiplier * speed;
    this.y += (this.ySpeed + Petal.mouseX * 2) * speed;
    this.flip += this.flipSpeed;
    this.draw(ctx);
  }
}

export default PetalCanvas;

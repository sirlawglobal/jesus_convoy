import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className = "", hover = false }: CardProps) {
  return (
    <div
      className={`glass rounded-2xl p-6 ${hover ? "card-hover cursor-pointer" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

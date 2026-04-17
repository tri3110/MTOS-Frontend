import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export function Card({ children, className = "" }: Props) {
  return (
    <div className={`bg-white rounded-2xl shadow ${className}`}>
      {children}
    </div>
  );
}

export function CardContent({ children, className = "" }: Props) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}
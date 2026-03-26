import { ReactNode } from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  loading?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  className,
  loading,
  ...props
}: ButtonProps) {
  const variants = {
    primary: 'bg-black text-white hover:bg-zinc-800 shadow-sm',
    secondary: 'bg-zinc-100 text-black hover:bg-zinc-200',
    outline: 'border border-black/10 bg-transparent hover:bg-zinc-50 text-black',
    ghost: 'bg-transparent hover:bg-zinc-100 text-zinc-600 hover:text-black',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  };

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      className={cn(
        'inline-flex items-center justify-center rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={loading}
      {...(props as any)}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      ) : null}
      {children}
    </motion.button>
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('bg-white border border-black/5 rounded-2xl p-6 shadow-sm', className)}>
      {children}
    </div>
  );
}

export function Section({
  children,
  className,
  title,
  subtitle,
}: {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
}) {
  return (
    <section className={cn('py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto', className)}>
      {title && (
        <div className="mb-16">
          <h2 className="text-3xl font-bold tracking-tight mb-4">{title}</h2>
          {subtitle && <p className="text-zinc-500 max-w-2xl text-lg">{subtitle}</p>}
        </div>
      )}
      {children}
    </section>
  );
}

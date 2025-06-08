import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'lg' | 'icon'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 disabled:pointer-events-none disabled:opacity-50",
          variant === 'default' && "bg-gray-900 text-white hover:bg-gray-800",
          variant === 'outline' && "border border-gray-200 bg-white hover:bg-gray-50",
          variant === 'ghost' && "hover:bg-gray-100 dark:hover:bg-gray-800",
          size === 'default' && "h-10 px-4 py-2",
          size === 'lg' && "h-12 px-6 py-3",
          size === 'icon' && "h-10 w-10",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button } 
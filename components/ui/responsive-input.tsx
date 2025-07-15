import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const ResponsiveInput = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-12 w-full rounded-xl border-2 border-input bg-background px-4 py-3 text-responsive-base ring-offset-background file:border-0 file:bg-transparent file:text-responsive-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 touch-target",
        className,
      )}
      ref={ref}
      {...props}
    />
  )
})
ResponsiveInput.displayName = "ResponsiveInput"

export { ResponsiveInput }

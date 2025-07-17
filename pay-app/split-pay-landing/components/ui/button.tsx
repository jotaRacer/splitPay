import * as React from "react"
import { cn } from "@/lib/utils"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant = "default", ...props }, ref) => {
  return (
    <button
      className={cn(
        "w-full py-3 px-4 rounded-lg font-medium transition-colors",
        variant === "default" && "bg-blue-600 text-white hover:bg-blue-700",
        variant === "outline" && "border border-gray-300 text-gray-700 hover:bg-gray-50",
        className,
      )}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button }

import { cn } from "@/lib/utils";

export function Panel({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("panel p-4 sm:p-5", className)} {...props}>
      {children}
    </div>
  );
}

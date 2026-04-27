import { NavLink } from "react-router-dom";
import { Calendar, Home, Info, Mail, Newspaper } from "lucide-react";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const items = [
  { to: "/", label: "Feed", icon: Home, end: true },
  { to: "/about", label: "About", icon: Info },
  { to: "/calendar", label: "Calendar", icon: Calendar },
  { to: "/news", label: "News", icon: Newspaper },
  { to: "/contact", label: "Contact", icon: Mail },
];

export const TopNav = () => {
  return (
    <header className="fixed inset-x-0 top-0 z-40 hidden border-b border-border/60 bg-background/80 backdrop-blur-md md:block">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <NavLink to="/" className="group flex items-center gap-2">
          <span
            aria-hidden
            className="inline-block h-3 w-3 rounded-full bg-secondary transition-transform group-hover:scale-125"
          />
          <span className="font-display text-lg font-extrabold tracking-tight">
            {siteConfig.name}
          </span>
        </NavLink>
        <ul className="flex items-center gap-1">
          {items.map(({ to, label, icon: Icon, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                    "text-muted-foreground hover:bg-muted hover:text-foreground",
                    isActive && "bg-primary text-primary-foreground hover:bg-primary"
                  )
                }
              >
                <Icon className="h-4 w-4" aria-hidden />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export const BottomNav = () => {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-background/90 backdrop-blur-md md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Primary"
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-between px-2">
        {items.map(({ to, label, icon: Icon, end }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center gap-1 px-2 py-2.5 text-[11px] font-medium transition-colors",
                  isActive ? "text-secondary" : "text-muted-foreground hover:text-foreground"
                )
              }
            >
              <Icon className="h-5 w-5" aria-hidden />
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

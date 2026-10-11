import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cx } from "../../lib/ui";

type Variant = "primary" | "secondary" | "nav" | "invert" | "glass";

const VARIANT: Record<Variant, string> = {
  primary: "bg-accent-strong text-white",
  secondary: "bg-card text-ink border border-outline",
  nav: "bg-ink text-white",
  invert: "bg-card text-ink",
  glass: "text-white border border-white/15",
};

const BASE =
  "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-pill px-7 py-4 text-base font-semibold leading-none transition-[transform,opacity,background-color] duration-200 ease-out hover:-translate-y-px hover:opacity-85";

interface CommonProps {
  variant?: Variant;
  className?: string;
  children: ReactNode;
}

interface LinkProps extends CommonProps {
  href: string;
  download?: boolean;
  /** Renders with target/rel when the href points off-site. */
  external?: boolean;
}

interface NativeButtonProps
  extends CommonProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> {
  href?: undefined;
}

type ButtonProps = LinkProps | NativeButtonProps;

export default function Button(props: ButtonProps) {
  const { variant = "primary", className, children } = props;
  const classes = cx(BASE, VARIANT[variant], className);

  if ("href" in props && props.href) {
    const { href, download, external } = props;
    const offsite = external ?? /^https?:\/\//.test(href);
    return (
      <a
        href={href}
        className={classes}
        {...(download ? { download: "" } : {})}
        {...(offsite ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </a>
    );
  }

  const { variant: _variant, className: _className, children: _children, ...rest } = props;
  void _variant;
  void _className;
  void _children;

  return (
    <button type="button" className={classes} {...rest}>
      {children}
    </button>
  );
}

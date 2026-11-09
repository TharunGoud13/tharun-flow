import "./ExcalidrawLogo.scss";

/**
 * tharun-flow brand mark.
 *
 * A minimal flow glyph (one source node branching into two) on a rounded
 * square. Designed to stay crisp from favicon size up to the welcome screen.
 */
export const TharunFlowMark = ({
  size,
  className,
  style,
}: {
  size?: number | string;
  className?: string;
  style?: React.CSSProperties;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    style={style}
    role="img"
    aria-label="tharun-flow"
  >
    <rect
      width="24"
      height="24"
      rx="6.5"
      fill="var(--tf-brand, var(--color-primary, #0071e3))"
    />
    <path
      d="M7.2 12h3.1c1.7 0 3.1-1.4 3.1-3.1V7.4c0-1.2 1-2.2 2.2-2.2h1.6"
      stroke="#fff"
      strokeWidth="1.7"
      strokeLinecap="round"
    />
    <path
      d="M7.2 12h3.1c1.7 0 3.1 1.4 3.1 3.1v1.5c0 1.2 1 2.2 2.2 2.2h1.6"
      stroke="#fff"
      strokeWidth="1.7"
      strokeLinecap="round"
    />
    <circle cx="6.4" cy="12" r="1.55" fill="#fff" />
    <circle cx="18.4" cy="5.2" r="1.55" fill="#fff" />
    <circle cx="18.4" cy="18.8" r="1.55" fill="#fff" />
  </svg>
);

const LogoText = () => (
  <span
    className="ExcalidrawLogo-text"
    style={{
      fontFamily: "var(--ui-font, sans-serif)",
      fontWeight: 650,
      fontSize: "1.35em",
      letterSpacing: "-0.035em",
      color: "var(--color-logo-text)",
      marginLeft: "0.6em",
      display: "inline-block",
    }}
  >
    tharun-flow
  </span>
);

type LogoSize = "xs" | "small" | "normal" | "large" | "custom" | "mobile";

interface LogoProps {
  size?: LogoSize;
  withText?: boolean;
  style?: React.CSSProperties;
  /**
   * If true, the logo will not be wrapped in a Link component.
   * The link prop will be ignored as well.
   * It will merely be a plain div.
   */
  isNotLink?: boolean;
}

export const ExcalidrawLogo = ({
  style,
  size = "small",
  withText,
}: LogoProps) => {
  return (
    <div className={`ExcalidrawLogo is-${size}`} style={style}>
      <TharunFlowMark className="ExcalidrawLogo-icon" />
      {withText && <LogoText />}
    </div>
  );
};

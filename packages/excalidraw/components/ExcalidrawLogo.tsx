import "./ExcalidrawLogo.scss";

const LogoIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="ExcalidrawLogo-icon"
    style={{ width: "1.75em", height: "1.75em", color: "var(--color-primary)" }}
  >
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </svg>
);

const LogoText = () => (
  <span
    className="ExcalidrawLogo-text"
    style={{
      fontFamily: "var(--ui-font, sans-serif)",
      fontWeight: 800,
      fontSize: "1.35em",
      letterSpacing: "-0.5px",
      color: "var(--color-primary)",
      marginLeft: "6px",
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
      <LogoIcon />
      {withText && <LogoText />}
    </div>
  );
};

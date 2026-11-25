import type { Project } from "@/data/site";

export function ProjectVisual({ variant }: { variant: Project["variant"] }) {
  if (variant === "skin") {
    return (
      <svg viewBox="0 0 380 190" className="project-art" aria-hidden="true">
        <rect x="31" y="28" width="318" height="134" rx="14" className="art-skin-window" />
        <circle cx="111" cy="94" r="42" className="art-skin-orb" />
        <circle cx="111" cy="94" r="29" className="art-skin-ring" />
        <path d="M91 95c10-13 20-13 30 0s20 13 30 0" className="art-skin-wave" />
        <rect x="180" y="54" width="119" height="9" rx="4.5" className="art-skin-line" />
        <rect x="180" y="76" width="137" height="6" rx="3" className="art-skin-muted" />
        <rect x="180" y="92" width="114" height="6" rx="3" className="art-skin-muted" />
        <rect x="180" y="117" width="73" height="23" rx="11.5" className="art-skin-action" />
        <circle cx="314" cy="126" r="5" className="art-skin-dot" />
      </svg>
    );
  }
  if (variant === "rag") {
    return (
      <svg viewBox="0 0 380 190" className="project-art" aria-hidden="true">
        <rect x="34" y="30" width="195" height="128" rx="12" className="art-window" />
        <rect x="49" y="47" width="80" height="8" rx="4" className="art-muted" />
        <rect x="49" y="66" width="146" height="5" rx="2.5" className="art-line" />
        <rect x="49" y="80" width="127" height="5" rx="2.5" className="art-line" />
        <rect x="49" y="94" width="154" height="5" rx="2.5" className="art-line" />
        <rect x="49" y="116" width="110" height="24" rx="6" className="art-highlight" />
        <circle cx="279" cy="84" r="33" className="art-orb" />
        <circle cx="307" cy="133" r="18" className="art-orb art-orb--small" />
        <path d="M229 91h17m33 28 17 10" className="art-connector" />
        <path d="M268 79l8 5-8 5" className="art-arrow" />
      </svg>
    );
  }
  if (variant === "fullstack") {
    return (
      <svg viewBox="0 0 380 190" className="project-art" aria-hidden="true">
        <rect x="29" y="31" width="322" height="128" rx="12" className="art-dark-window" />
        <rect x="44" y="46" width="81" height="98" rx="7" className="art-sidebar" />
        <circle cx="63" cy="66" r="9" className="art-orb" />
        <rect x="53" y="84" width="51" height="5" rx="2.5" className="art-code-muted" />
        <rect x="53" y="97" width="43" height="5" rx="2.5" className="art-code-muted" />
        <rect x="53" y="110" width="55" height="5" rx="2.5" className="art-code-muted" />
        <rect x="140" y="47" width="194" height="36" rx="6" className="art-panel" />
        <rect x="140" y="92" width="194" height="52" rx="6" className="art-sidebar" />
        <path d="m157 127 29-16 25 10 29-25 25 15 27-18 34 8" className="art-chart" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 380 190" className="project-art" aria-hidden="true">
      <rect x="29" y="30" width="322" height="130" rx="12" className="art-paper" />
      <text x="49" y="57" className="art-mono">RESUME / ROLE MATCH</text>
      <circle cx="54" cy="82" r="5" className="art-check" /><rect x="68" y="78" width="126" height="6" rx="3" className="art-line" />
      <circle cx="54" cy="105" r="5" className="art-check" /><rect x="68" y="101" width="105" height="6" rx="3" className="art-line" />
      <circle cx="54" cy="128" r="5" className="art-pending" /><rect x="68" y="124" width="147" height="6" rx="3" className="art-line" />
      <rect x="253" y="68" width="72" height="65" rx="10" className="art-dark-window" />
      <path d="m276 98 8 8 17-20" className="art-check-mark" />
      <text x="289" y="122" textAnchor="middle" className="art-mono art-mono--light">SCORE</text>
    </svg>
  );
}

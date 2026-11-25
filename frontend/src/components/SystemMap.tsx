export function SystemMap() {
  return (
    <div className="system-card" aria-label="Illustration of an AI workflow from input to evaluation and delivery">
      <div className="system-card__topline">
        <span>AI SYSTEM FLOW</span>
        <span>INPUT → EVALUATION</span>
      </div>
      <svg className="system-map" viewBox="0 0 520 350" role="img" aria-labelledby="system-title system-desc">
        <title id="system-title">AI workflow illustration</title>
        <desc id="system-desc">Input flows through retrieval and tools to a model, evaluation, and delivery.</desc>
        <path className="system-path" d="M76 168 C128 168 132 93 194 93 S255 168 314 168 S373 92 440 92" />
        <path className="system-path system-path--lower" d="M76 168 C130 168 132 253 194 253 S254 191 314 191 S376 269 440 269" />
        <path className="system-branch" d="M194 93V253M314 168V191" />
        <g className="system-node system-node--dark" transform="translate(76 168)"><circle r="34"/><text y="4">INPUT</text></g>
        <g className="system-node" transform="translate(194 93)"><circle r="31"/><text y="4">RETRIEVE</text></g>
        <g className="system-node" transform="translate(194 253)"><circle r="31"/><text y="4">TOOLS</text></g>
        <g className="system-node system-node--mint" transform="translate(314 168)"><circle r="35"/><text y="4">MODEL</text></g>
        <g className="system-node" transform="translate(440 92)"><circle r="31"/><text y="4">EVAL</text></g>
        <g className="system-node system-node--dark" transform="translate(440 269)"><circle r="31"/><text y="4">SHIP</text></g>
        <circle className="system-pulse" cx="314" cy="168" r="47" />
      </svg>
      <div className="system-card__caption">
        <span className="signal-dot" />
        <span>Useful AI needs a way to check its work.</span>
      </div>
    </div>
  );
}

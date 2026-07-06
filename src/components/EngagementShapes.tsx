"use client";

import { useId, useState } from "react";

type Shape = {
  bucket: string;
  objective: string;
  stake: string;
  fee: string;
  matter: {
    eyebrow: string;
    title: string;
    blocks: { head: string; body: string }[];
  };
};

// Each fee shape carries one illustrative matter, revealed on demand. The
// examples are archetypes, not case results—the note below the board says so.
const SHAPES: Shape[] = [
  {
    bucket: "Negotiation & disputes",
    objective: "Move the matter forward without letting conflict become a machine.",
    stake: "We have to earn your confidence stage by stage.",
    fee: "Staged fixed fees",
    matter: {
      eyebrow: "Illustrative matter",
      title: "A divorce heading toward settlement",
      blocks: [
        {
          head: "The objective",
          body: "End the marriage on terms you can live with—custody, support, and property resolved by agreement rather than attrition.",
        },
        {
          head: "The work",
          body: "Strategy, financial disclosure, settlement negotiation, and the marital settlement agreement—one defined stage at a time.",
        },
        {
          head: "The fee",
          body: "Each stage carries its own fixed number, agreed in writing before that stage begins. No retainer draining while you wait.",
        },
        {
          head: "Why it fits",
          body: "Uncertainty in a dispute arrives one stage at a time, so the price does too. Escalation reprices the next stage—never the last one.",
        },
      ],
    },
  },
  {
    bucket: "Review & advice",
    objective: "Give you a clear, usable answer without over-lawyering the problem.",
    stake: "We bear the risk of doing the work efficiently.",
    fee: "Defined flat fee",
    matter: {
      eyebrow: "Illustrative matter",
      title: "An executive employment agreement lands in your inbox",
      blocks: [
        {
          head: "The objective",
          body: "Sign with full information—and better terms where the market supports them.",
        },
        {
          head: "The work",
          body: "A full redline, market analytics on the offer, and a call to walk through every change before you respond.",
        },
        {
          head: "The fee",
          body: "Professional Contract Review is $444, posted. Other reviews and opinion letters are quoted the same way: one number, up front.",
        },
        {
          head: "Why it fits",
          body: "The document defines the scope, so the firm can carry the efficiency risk. If the review takes longer than expected, that is our problem.",
        },
      ],
    },
  },
  {
    bucket: "Deal work",
    objective: "Negotiate better economics, better terms, or better downside protection.",
    stake: "Where permitted, we can share in measurable upside.",
    fee: "Fixed fee + success component",
    matter: {
      eyebrow: "Illustrative matter",
      title: "An acquisition with real money at stake",
      blocks: [
        {
          head: "The objective",
          body: "Close the deal on better economics, with tighter protections and no surprises at the closing table.",
        },
        {
          head: "The work",
          body: "Letter of intent through closing—diligence, purchase agreement, disclosure schedules, and the negotiation between.",
        },
        {
          head: "The fee",
          body: "A fixed base sized to the transaction, plus a success component tied to closing or measurable value—where appropriate and permitted.",
        },
        {
          head: "Why it fits",
          body: "When the outcome is measurable, the fee can share in it. The firm's upside is the deal closing well—not the hours it takes.",
        },
      ],
    },
  },
];

export default function EngagementShapes() {
  const uid = useId();
  const [open, setOpen] = useState<Set<number>>(new Set());

  function toggle(i: number) {
    setOpen((cur) => {
      const next = new Set(cur);
      if (next.has(i)) {
        next.delete(i);
      } else {
        next.add(i);
      }
      return next;
    });
  }

  return (
    <div className="games-board games-board--interactive">
      {SHAPES.map((shape, i) => {
        const expanded = open.has(i);
        const triggerId = `${uid}-shape-t${i}`;
        const panelId = `${uid}-shape-p${i}`;
        return (
          <div
            className={expanded ? "games-item is-open" : "games-item"}
            key={shape.bucket}
          >
            <button
              type="button"
              className="games-row games-row--trigger"
              id={triggerId}
              aria-expanded={expanded}
              aria-controls={panelId}
              onClick={() => toggle(i)}
            >
              <span className="games-cell games-cell--bucket">
                <span className="games-head">Engagement</span>
                <span className="games-bucket-name">{shape.bucket}</span>
              </span>
              <span className="games-cell">
                <span className="games-head">The objective</span>
                <span className="games-text">{shape.objective}</span>
              </span>
              <span className="games-cell">
                <span className="games-head">Our stake</span>
                <span className="games-text">{shape.stake}</span>
              </span>
              <span className="games-cell games-cell--last">
                <span className="games-head">Fee shape</span>
                <span className="games-fee">{shape.fee}</span>
                <span className="games-cue">
                  {expanded ? "Hide the matter" : "See it on a matter"}
                  <svg
                    className="pa-chevron"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </span>
              </span>
            </button>
            <div
              className="games-panel"
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              hidden={!expanded}
            >
              <div className="games-panel-inner">
                <span className="example-eyebrow">{shape.matter.eyebrow}</span>
                <h3 className="games-panel-title">{shape.matter.title}</h3>
                <dl className="games-panel-grid">
                  {shape.matter.blocks.map((block) => (
                    <div className="games-panel-block" key={block.head}>
                      <dt>{block.head}</dt>
                      <dd>{block.body}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

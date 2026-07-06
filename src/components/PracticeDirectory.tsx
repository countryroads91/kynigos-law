"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { FEE_SHAPES, PRACTICE_GROUPS } from "@/content/practices";

/**
 * The practice-area directory: five numbered groups, each service an
 * expandable disclosure row (design system §5 Accordion—multiple panels may
 * be open at once; the chevron rotation is the affordance).
 */
export default function PracticeDirectory() {
  const uid = useId();
  const [open, setOpen] = useState<Set<string>>(new Set());

  function toggle(key: string) {
    setOpen((cur) => {
      const next = new Set(cur);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }

  return (
    <div className="pa-directory">
      {PRACTICE_GROUPS.map((group) => (
        <section
          key={group.slug}
          className="pa-group"
          id={group.slug}
          aria-labelledby={`${uid}-${group.slug}-heading`}
        >
          <header className="pa-group-head" data-reveal>
            <span className="pa-group-num" aria-hidden="true">
              {group.num}
            </span>
            <div className="pa-group-intro">
              <h2
                className="pa-group-name"
                id={`${uid}-${group.slug}-heading`}
              >
                {group.name}
              </h2>
              <p className="pa-group-lede">{group.lede}</p>
              {group.flagship && (
                <Link href={group.flagship.href} className="pa-flagship">
                  {group.flagship.label} in depth
                  <span className="pa-arrow" aria-hidden="true">
                    &rarr;
                  </span>
                </Link>
              )}
            </div>
          </header>
          <ul className="pa-list" data-reveal>
            {group.services.map((service, i) => {
              const key = `${group.slug}:${i}`;
              const expanded = open.has(key);
              const triggerId = `${uid}-${group.slug}-t${i}`;
              const panelId = `${uid}-${group.slug}-p${i}`;
              return (
                <li className="pa-item" key={service.name}>
                  <h3 className="pa-item-heading">
                    <button
                      type="button"
                      className="pa-trigger"
                      id={triggerId}
                      aria-expanded={expanded}
                      aria-controls={panelId}
                      onClick={() => toggle(key)}
                    >
                      <span className="pa-trigger-name">{service.name}</span>
                      <span className="pa-trigger-meta">
                        <span className="fee-badge">
                          {FEE_SHAPES[service.fee].label}
                        </span>
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
                    </button>
                  </h3>
                  <div
                    className="pa-panel"
                    id={panelId}
                    role="region"
                    aria-labelledby={triggerId}
                    hidden={!expanded}
                  >
                    <div className="pa-panel-inner">
                      <p className="pa-panel-body">{service.description}</p>
                      <div className="pa-panel-actions">
                        <Link href="/contact" className="pa-panel-link">
                          Start this matter
                          <span className="pa-arrow" aria-hidden="true">
                            &rarr;
                          </span>
                        </Link>
                        {service.href && (
                          <Link href={service.href} className="pa-panel-link">
                            Full practice page
                            <span className="pa-arrow" aria-hidden="true">
                              &rarr;
                            </span>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}

import { FEE_SHAPES, type FeeShapeKey } from "@/content/practices";

const ORDER: FeeShapeKey[] = ["flat", "staged", "success", "quoted"];

/**
 * Compact fee-design module: the four fee shapes the firm works in, each with
 * what it is and when it fits. Reused wherever fees need explaining without
 * restating the whole philosophy.
 */
export default function FeeDesign() {
  return (
    <div className="fee-design" data-reveal>
      {ORDER.map((key) => {
        const shape = FEE_SHAPES[key];
        return (
          <article className="fee-shape" key={key}>
            <h3 className="fee-shape-label">{shape.label}</h3>
            <p className="fee-shape-short">{shape.short}</p>
            <p className="fee-shape-when">
              <span className="fee-shape-when-label">When it fits</span>
              {shape.when}
            </p>
          </article>
        );
      })}
    </div>
  );
}

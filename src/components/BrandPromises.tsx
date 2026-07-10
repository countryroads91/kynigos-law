import Link from "next/link";
import SpearMark from "@/components/SpearMark";

const promises = [
  {
    word: "Calculated.",
    label: "Define the game",
    body: "We identify the objective, decision points, downside, and likely paths before prescribing work.",
  },
  {
    word: "Zealous.",
    label: "Earn the next stage",
    body: "Every lawyer promises zeal. Our engagement structure requires us to prove it before you re-engage.",
  },
  {
    word: "Invested.",
    label: "Carry real risk",
    body: "We carry the efficiency and scope risk we agreed to carry. Where appropriate, part of the fee can depend on a defined result.",
  },
];

export default function BrandPromises() {
  return (
    <section className="promise-band band-marked" aria-labelledby="promise-heading">
      <SpearMark className="band-mark" />
      <div className="promise-inner">
        <div className="promise-statement">
          <div className="kicker">The Operating System</div>
          <h2 id="promise-heading">
            The engagement is designed around the objective, not the activity.
          </h2>
          <Link href="/philosophy" className="text-link">
            Read the philosophy <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
        <ol className="promise-list">
          {promises.map((promise, index) => (
            <li key={promise.word} data-reveal>
              <span className="promise-num">0{index + 1}</span>
              <div>
                <h3>{promise.word}</h3>
                <span className="promise-label">{promise.label}</span>
                <p>{promise.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

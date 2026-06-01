type Props = { step: number };

const steps = ["アイテム", "ゲージ", "画像", "編み図"];

export default function ProgressBar({ step }: Props) {
  return (
    <div className="progress-bar">
      {steps.map((label, i) => (
        <div
          key={i}
          className={`progress-step ${i === step ? "active" : i < step ? "done" : ""}`}
        >
          <span className="step-num">{"①②③④"[i]}</span>
          {label}
        </div>
      ))}
    </div>
  );
}

import React from "react";
import "./SurveyProgressBar.css";

const steps = [
  {
    label: "Step 1",
    title: "You & Your Travel Style",
    progress: "25%",
  },
  {
    label: "Step 2",
    title: "Your Interests & Passions",
    progress: "50%",
  },
  {
    label: "Step 3",
    title: "Tastes & Comfort",
    progress: "75%",
  },
  {
    label: "Step 4",
    title: "Practical Preferences",
    progress: "100%",
  },
];

const SurveyProgressBar = ({ currentStep = 1 }) => {
  return (
    <div className="progress-wrapper">
      <div className="survey-progress-bar">
        {steps.map((step, index) => (
          <React.Fragment key={step.label}>
            {index > 0 && (
              <div
                className={`connector ${index < currentStep ? "active" : ""}`}
              ></div>
            )}
            <div className="progress-step">
              <div className={`dot ${index < currentStep ? "active" : ""}`} />
              <div className="step-content">
                <span className="step-title">{step.label}</span>
                <span className="step-label">{step.title}</span>
                <span className="step-progress">{step.progress}</span>
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default SurveyProgressBar;

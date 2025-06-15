import React from "react";
import "./SurveyStep.css";

const SurveyStep = ({
  questions,
  selectedAnswers,
  onSelectionChange,
  errors,
}) => {
  const handleOptionToggle = (questionIndex, option) => {
    const currentSelection = selectedAnswers[questionIndex];
    const maxSelect = questions[questionIndex].maxSelect;
    let newSelection;

    if (currentSelection.includes(option)) {
      newSelection = currentSelection.filter((item) => item !== option);
    } else {
      if (currentSelection.length >= maxSelect) return; // Don't allow over-select
      newSelection = [...currentSelection, option];
    }

    onSelectionChange(questionIndex, newSelection);
  };

  return (
    <div className="survey-step">
      {questions.map((q, i) => (
        <div key={i} className="survey-question-block">
          <h3 className="survey-question-title">{q.question}</h3>
          <div className="survey-options">
            {q.options.map((option) => {
              const isSelected = selectedAnswers[i]?.includes(option);
              return (
                <div
                  key={option}
                  className={`survey-option ${isSelected ? "selected" : ""}`}
                  onClick={() => handleOptionToggle(i, option)}
                >
                  {option}
                </div>
              );
            })}
          </div>

          {errors[i] && (
            <p className="survey-error-message">
              Please select at least one option.
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default SurveyStep;

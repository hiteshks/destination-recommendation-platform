import React from "react";
import { useNavigate } from "react-router-dom";

const TakeSurveyButton = () => {
  const navigate = useNavigate();

  return (
    <button className="take-survey-button" onClick={() => navigate("/survey")}>
      Take Survey
    </button>
  );
};

export default TakeSurveyButton;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../firebase-config";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { HiX } from "react-icons/hi";
import "./SurveyPage.css";
import SurveyProgressBar from "../../components/Survey/SurveyProgressBar";
import SurveyStep from "../../components/Survey/SurveyStep";

const SurveyPage = () => {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [hasTakenSurvey, setHasTakenSurvey] = useState(null);
  const [user, setUser] = useState(null);
  const [step, setStep] = useState(1);
  const [showThankYou, setShowThankYou] = useState(false);

  const [answers, setAnswers] = useState({
    1: [[], []],
    2: [[], []],
    3: [[], []],
    4: [[], []],
  });

  const [errors, setErrors] = useState({
    1: [false, false],
    2: [false, false],
    3: [false, false],
    4: [false, false],
  });

  const questionSets = {
    1: [
      {
        question: "Select Your Preferred Regions",
        required: true,
        maxSelect: 5,
        options: ["North", "South", "East/Northeast", "West", "Central"],
      },
      {
        question: "Choose Your Travel Style",
        required: true,
        maxSelect: 3,
        options: ["Solo", "Couple", "Family", "Luxury", "Budget"],
      },
    ],
    2: [
      {
        question: "Pick Your Interests / Themes",
        required: true,
        maxSelect: 5,
        options: [
          "Heritage & Culture",
          "Adventure & Nature",
          "Spiritual & Wellness",
          "Wildlife & National Parks",
          "Food & Culinary",
          "Rural & Village Tourism",
          "Arts & Handicrafts",
        ],
      },
      {
        question: "Favourite Activities",
        required: true,
        maxSelect: 4,
        options: [
          "Sightseeing & Monuments",
          "Trekking / Hiking",
          "Beach Relaxation & Water Sports",
          "Yoga / Ayurveda / Meditation",
          "Wildlife Safari",
          "Cultural Festivals",
          "Street-Food Tours",
        ],
      },
    ],
    3: [
      {
        question: "Cuisine Preference",
        required: true,
        maxSelect: 3,
        options: [
          "North Indian / Punjabi",
          "South Indian (Dosa, Seafood)",
          "Street Food Lover",
          "Tribal / Regional Dishes",
          "Vegetarian / Vegan",
        ],
      },
      {
        question: "Budget Range Per Person",
        required: true,
        maxSelect: 1,
        options: [
          "₹5,000 – ₹15,000 (Budget)",
          "₹15,000 – ₹35,000 (Mid-range)",
          "₹35,000+ (Luxury)",
        ],
      },
    ],
    4: [
      {
        question: "Trip Duration you prefer",
        required: true,
        maxSelect: 1,
        options: [
          "Weekend (2–3 days)",
          "5–7 days",
          "10–14 days",
          "Longer (2+ weeks)",
        ],
      },
      {
        question: "Season Preference",
        required: true,
        maxSelect: 2,
        options: [
          "Winter (Oct–Feb)",
          "Summer (Mar–May)",
          "Monsoon (Jun–Sep)",
          "Any time",
        ],
      },
    ],
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          setHasTakenSurvey(userDoc.data().hasTakenSurvey);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    document.body.style.overflow = showConfirm ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showConfirm]);

  const handleClose = () => setShowConfirm(true);
  const handleConfirmGoBack = () => navigate("/");
  const handleLogout = () => {
    signOut(auth);
    navigate("/");
  };

  const handleAnswerChange = (questionIndex, selectedOptions) => {
    setAnswers((prev) => ({
      ...prev,
      [step]: prev[step].map((ans, idx) =>
        idx === questionIndex ? selectedOptions : ans
      ),
    }));
  };

  const handleNext = async () => {
    const currentAnswers = answers[step];
    const requiredQuestions = questionSets[step];

    const newErrors = requiredQuestions.map(
      (q, i) =>
        q.required && (!currentAnswers[i] || currentAnswers[i].length === 0)
    );

    const hasErrors = newErrors.includes(true);

    if (hasErrors) {
      setErrors((prev) => ({
        ...prev,
        [step]: newErrors,
      }));
      return;
    }

    setErrors((prev) => ({
      ...prev,
      [step]: [false, false],
    }));

    if (step < 4) {
      setStep((prev) => prev + 1);
    } else {
      const structuredAnswers = {
        preferredRegions: answers[1][0],
        travelStyle: answers[1][1],
        interests: answers[2][0],
        activities: answers[2][1],
        cuisinePreference: answers[3][0],
        budgetRange: answers[3][1],
        tripDuration: answers[4][0],
        seasonPreference: answers[4][1],
      };

      //   console.log("Structured Survey Answers:", structuredAnswers);

      setShowThankYou(true); // Show thank-you screen

      setTimeout(async () => {
        if (user) {
          try {
            await updateDoc(doc(db, "users", user.uid), {
              userPreferences: structuredAnswers,
              hasTakenSurvey: true,
            });

            // Start fade-out animation
            const container = document.querySelector(".thank-you-container");
            if (container) {
              container.classList.add("fade-out");
            }

            // Wait for fade-out before navigating
            setTimeout(() => {
              navigate("/", { state: { fromSurvey: true } });
            }, 1200); // 1.2s fade-out
          } catch (error) {
            console.error("Survey submission failed:", error);
          }
        }
      }, 2500); // Show thank-you for 2.5s before starting fade-out
    }
  };

  return (
    <div className="survey-page">
      {showThankYou ? (
        <div className="thank-you-container">
          <div className="thank-you-message">
            <h1>🎉 Thank You!</h1>
            <p>Your travel preferences have been saved.</p>
            <p>
              Sit back and relax while we curate{" "}
              <strong>personalized destination recommendations</strong> just for
              you.
            </p>
            <p className="loading-text">
              Redirecting to your adventure suggestions...
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="survey-header-bar">
            <div className="survey-header">
              <h1>Let’s Personalize Your Next Adventure</h1>
              <p>
                Answer a few quick questions so we can tailor destination
                recommendations just for you.
              </p>
            </div>
            <button className="survey-close-button" onClick={handleClose}>
              <HiX size={24} />
            </button>
          </div>

          <SurveyProgressBar currentStep={step} />

          <SurveyStep
            questions={questionSets[step]}
            selectedAnswers={answers[step]}
            onSelectionChange={handleAnswerChange}
            errors={errors[step]}
          />

          <div
            className="survey-navigation"
            style={
              showConfirm
                ? { pointerEvents: "none", filter: "blur(1px)", opacity: 0.5 }
                : {}
            }
          >
            {step > 1 ? (
              <button
                className="survey-nav-button back"
                onClick={() => setStep((s) => s - 1)}
              >
                Back
              </button>
            ) : (
              <div />
            )}
            <button
              className="survey-nav-button next"
              onClick={handleNext}
              disabled={
                step === 4 &&
                (answers[4][0].length === 0 || answers[4][1].length === 0)
              }
              style={{
                opacity:
                  step === 4 &&
                  (answers[4][0].length === 0 || answers[4][1].length === 0)
                    ? 0.5
                    : 1,
                cursor:
                  step === 4 &&
                  (answers[4][0].length === 0 || answers[4][1].length === 0)
                    ? "not-allowed"
                    : "pointer",
              }}
            >
              {step === 4 ? "Submit" : "Next"}
            </button>
          </div>

          {showConfirm && (
            <div className="confirm-overlay">
              <div className="confirm-box">
                {hasTakenSurvey ? (
                  <>
                    <h2>Go back to homepage?</h2>
                    <span className="confirm-message">
                      You've already completed the survey before. Your
                      personalized recommendations will be based on your last
                      responses.
                    </span>
                    <div className="confirm-actions">
                      <button
                        className="cancel-button"
                        onClick={() => setShowConfirm(false)}
                      >
                        Stay Here
                      </button>
                      <button
                        className="confirm-button"
                        onClick={() => navigate("/")} // redirect to homepage
                      >
                        Go Back
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h2>Are you sure you want to go back?</h2>
                    <span className="confirm-message">
                      Without completing the survey, you won’t receive
                      personalized destination suggestions.
                    </span>
                    <div className="confirm-actions">
                      <button
                        className="cancel-button"
                        onClick={() => setShowConfirm(false)}
                      >
                        Cancel
                      </button>
                      <button
                        className="confirm-button"
                        onClick={handleConfirmGoBack}
                      >
                        Go Back
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SurveyPage;

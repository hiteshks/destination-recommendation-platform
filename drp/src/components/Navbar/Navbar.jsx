import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase-config";
import "./Navbar.css";

import Logo from "./Logo";
import SearchBar from "./SearchBar";
import MenuItems from "./MenuItems";
import AuthButton from "./AuthButton";
import TakeSurveyButton from "./TakeSurveyButton";
import HamburgerMenu from "./HamburgerMenu";

const Navbar = ({ openModal }) => {
  const [user, setUser] = useState(null);
  const [hasTakenSurvey, setHasTakenSurvey] = useState(null);
  const [showSurveyHint, setShowSurveyHint] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          const taken = userDoc.data().hasTakenSurvey;
          setHasTakenSurvey(taken);
          if (!taken) {
            setShowSurveyHint(true);
            setTimeout(() => setShowSurveyHint(false), 6000);
          }
        } else {
          setHasTakenSurvey(null);
        }
      } else {
        setHasTakenSurvey(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSurveyHover = () => setShowSurveyHint(true);
  const handleSurveyLeave = () => setShowSurveyHint(false);

  return (
    <nav className="navbar-container">
      <div className="navbar-left">
        <Logo />
        <SearchBar />
      </div>

      <div className="navbar-center">
        <MenuItems />
      </div>

      <div className="navbar-right">
        {!user && <AuthButton openModal={openModal} />}
        {user && hasTakenSurvey === false && (
          <div
            className="survey-button-wrapper"
            onMouseEnter={handleSurveyHover}
            onMouseLeave={handleSurveyLeave}
          >
            <TakeSurveyButton />
            {showSurveyHint && (
              <div className="dropdown-menu survey-dropdown">
                <div className="dropdown-item survey-message">
                  Get better travel picks—take our quick survey!
                </div>
              </div>
            )}
          </div>
        )}
        {user && <HamburgerMenu />}
      </div>
    </nav>
  );
};

export default Navbar;

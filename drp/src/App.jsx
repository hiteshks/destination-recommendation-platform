import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHomePageData } from "./slices/homePageSlice";
import { fetchUserDataIfSurveyed } from "./slices/userDataSlice";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase-config";
import { Routes, Route, useLocation } from "react-router-dom";

import "./App.css";
import CarouselSection from "./components/CarouselSection/CarouselSection";
import HeroSection from "./components/HeroSection/HeroSection";
import Navbar from "./components/Navbar/Navbar";
import AuthModal from "./components/Auth/AuthModal";
import SurveyPage from "./pages/SurveyPage/SurveyPage";
import SearchPage from "./pages/SearchPage/SearchPage";
import DestinationDetailsPage from "./pages/DestinationDetailsPage/DestinationDetailsPage";

function App() {
  const dispatch = useDispatch();
  const location = useLocation();

  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState(null);

  const { destinationSections, loading: homepageLoading } = useSelector(
    (state) => state.homePage
  );

  const {
    hasTakenSurvey,
    personalizedSections,
    allDestinations,
    loading: userLoading,
  } = useSelector((state) => state.userData);

  const isLoading = homepageLoading || userLoading;

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (user) {
      const fromSurvey = location.state?.fromSurvey;

      if (fromSurvey) {
        // 🔁 Refetch fresh data after survey
        dispatch(fetchUserDataIfSurveyed(user.uid));
      } else if (!hasTakenSurvey) {
        dispatch(fetchUserDataIfSurveyed(user.uid));
      }
    } else {
      dispatch(fetchHomePageData());
    }
  }, [dispatch, user, location.state]);

  useEffect(() => {
    if (location.state?.fromSurvey) {
      // Clear the state so it doesn't refetch on future renders
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    if (user && hasTakenSurvey) {
      dispatch(fetchUserDataIfSurveyed(user.uid));
    }
  }, [hasTakenSurvey, user, dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!user) setShowModal(true);
    }, 10000);
    return () => clearTimeout(timer);
  }, [user]);

  const isPersonalized = user && hasTakenSurvey;
  const sectionData = isPersonalized
    ? personalizedSections
    : destinationSections;
  const destinations = isPersonalized
    ? allDestinations
    : destinationSections.allDestinations || [];

  if (isLoading) {
    return (
      <div className="loading-screen fade-in">
        <div className="loading-spinner" />
        <p>Finding the best destinations for you...</p>
      </div>
    );
  }

  return (
    <div>
      {location.pathname !== "/survey" && (
        <Navbar openModal={() => setShowModal(true)} />
      )}
      <AuthModal isOpen={showModal} onClose={() => setShowModal(false)} />

      <Routes>
        <Route path="/survey" element={<SurveyPage user={user} />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/destination/:id" element={<DestinationDetailsPage />} />
        <Route
          path="/*"
          element={
            <>
              <HeroSection />
              <main>
                {sectionData.regionShowcase && (
                  <CarouselSection
                    title="Explore by Region"
                    data={sectionData.regionShowcase}
                    allDestinations={destinations}
                  />
                )}
                {Object.entries(sectionData)
                  .filter(
                    ([key]) =>
                      key !== "heroDestinations" &&
                      key !== "regionShowcase" &&
                      key !== "allDestinations"
                  )
                  .map(([key, data]) => (
                    <CarouselSection
                      key={key}
                      title={key
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) => str.toUpperCase())}
                      data={data}
                      allDestinations={destinations}
                    />
                  ))}
              </main>
            </>
          }
        />
      </Routes>
    </div>
  );
}

export default App;

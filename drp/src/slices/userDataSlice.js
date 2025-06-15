import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase-config";
import { useSelector } from "react-redux";

export const fetchUserDataIfSurveyed = createAsyncThunk(
  "userData/fetchIfSurveyed",
  async (userId, { rejectWithValue }) => {
    try {
      const userDocRef = doc(db, "users", userId);
      const userSnap = await getDoc(userDocRef);

      if (!userSnap.exists()) {
        return rejectWithValue("User not found.");
      }

      const userData = userSnap.data();
      if (!userData.hasTakenSurvey) {
        return { hasTakenSurvey: false };
      }

      const userPreferences = userData.userPreferences || {};
      const destinationsSnap = await getDocs(collection(db, "destination"));
      const allDestinations = destinationsSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const personalizedSections = {};

      Object.entries(userPreferences).forEach(([sectionKey, values]) => {
        if (!Array.isArray(values)) return;

        const matchedDestinations = allDestinations.filter((dest) => {
          const tags = Array.isArray(dest.tags)
            ? dest.tags.map((t) => t.toLowerCase())
            : [];
          const types = Array.isArray(dest.type)
            ? dest.type.map((t) => t.toLowerCase())
            : [];
          const seasons = Array.isArray(dest.bestSeason)
            ? dest.bestSeason.map((s) => s.toLowerCase())
            : [];
          const durations = Array.isArray(dest.duration)
            ? dest.duration.map((d) => d.toLowerCase())
            : [];

          const price = Number(dest.price) || 0;

          return values.some((prefValue) => {
            const pref = prefValue.toLowerCase();

            // ✅ Budget range match
            if (sectionKey === "budgetRange") {
              const [minStr, maxStr] = pref
                .replace(/[^\d–-]/g, "") // Remove ₹ and text
                .split(/–|-/)
                .map((s) => s.trim());

              const min = parseInt(minStr, 10);
              const max = parseInt(maxStr, 10);

              return price >= min && price <= max;
            }

            // ✅ Trip duration match
            if (sectionKey === "tripDuration") {
              return durations.some(
                (d) => d.includes(pref) || pref.includes(d)
              );
            }

            // ✅ Season preference match
            if (sectionKey === "seasonPreference") {
              return seasons.some((s) => s.includes(pref) || pref.includes(s));
            }

            // ✅ Preferred region match
            if (sectionKey === "preferredRegions") {
              const destRegion = dest.region?.toLowerCase();
              return (
                destRegion &&
                (destRegion.includes(pref) || pref.includes(destRegion))
              );
            }

            // ✅ Tag or type match
            return (
              tags.some((tag) => tag.includes(pref) || pref.includes(tag)) ||
              types.some((type) => type.includes(pref) || pref.includes(type))
            );
          });
        });

        personalizedSections[sectionKey] = matchedDestinations;
      });

      return {
        hasTakenSurvey: true,
        userPreferences,
        personalizedSections,
        allDestinations,
      };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const userDataSlice = createSlice({
  name: "userData",
  initialState: {
    personalizedSections: null,
    allDestinations: [],
    hasTakenSurvey: false,
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserDataIfSurveyed.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserDataIfSurveyed.fulfilled, (state, action) => {
        state.loading = false;
        state.hasTakenSurvey = action.payload.hasTakenSurvey;
        state.personalizedSections =
          action.payload.personalizedSections || null;
        state.allDestinations = action.payload.allDestinations || [];
      })
      .addCase(fetchUserDataIfSurveyed.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default userDataSlice.reducer;

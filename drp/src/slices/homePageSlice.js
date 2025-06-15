import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase-config";

// Section keys to categorize destinations
const sectionKeys = [
  "foodAndCulinary",
  "eventsAndFestivals",
  "personalizedRecommendations",
  "topRatedDestinations",
  "preMadeItineraries",
];

const keywordMap = {
  foodAndCulinary: ["food", "cuisine", "culinary", "dish", "flavors"],
  eventsAndFestivals: ["festival", "event", "celebration", "fair", "cultural"],
  personalizedRecommendations: [
    "romantic",
    "adventure",
    "heritage",
    "offbeat",
    "relaxing",
  ],
  topRatedDestinations: ["top", "popular", "famous", "best", "rated"],
  preMadeItineraries: ["itinerary", "tour", "trip", "guide", "plan"],
};

export const fetchHomePageData = createAsyncThunk(
  "homePage/fetchHomePageData",
  async (_, { rejectWithValue }) => {
    try {
      const colRef = collection(db, "destination");
      const snapshot = await getDocs(colRef);
      const allDestinations = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const result = {};

      sectionKeys.forEach((key) => {
        const keywords = keywordMap[key] || [];
        const filtered = allDestinations.filter((dest) => {
          const combined = [
            ...(dest.tags || []),
            ...(dest.type || []),
            ...(dest.name ? [dest.name] : []),
            ...(dest.shortDescription ? [dest.shortDescription] : []),
          ]
            .join(" ")
            .toLowerCase();

          return keywords.some((kw) => combined.includes(kw));
        });

        const shuffled = [...filtered].sort(() => 0.5 - Math.random());
        result[key] =
          shuffled.length > 0
            ? shuffled.slice(0, 8)
            : [...allDestinations].sort(() => 0.5 - Math.random()).slice(0, 8);
      });

      // 🆕 Group by unique regions with a random destination for each
      const regionMap = {};
      allDestinations.forEach((dest) => {
        const region =
          typeof dest.region === "string" ? dest.region.trim() : null;
        if (region) {
          if (!regionMap[region]) {
            regionMap[region] = [];
          }
          regionMap[region].push(dest);
        }
      });

      result.regionShowcase = Object.entries(regionMap).map(
        ([region, places]) => {
          const randomPlace = places[Math.floor(Math.random() * places.length)];

          // Improved image fallback logic
          let imageUrl =
            randomPlace.cardImage ||
            randomPlace.bgImage ||
            (randomPlace.images &&
              (randomPlace.images.cardImage ||
                randomPlace.images.bgImage ||
                Object.values(randomPlace.images).find(
                  (img) => typeof img === "string"
                ))) ||
            "/images/default-region.jpg"; // Final fallback image

          //   console.log("📸 Selected image for region", region, imageUrl);

          return {
            id: `${region}-${randomPlace.id}`,
            name: region,
            region: randomPlace.region,
            imageUrl,
            location: randomPlace.location || "",
            price: randomPlace.price ?? "",
            rating: randomPlace.rating || 5.0,
            reviews: randomPlace.reviews || [],
            type: randomPlace.type || [],
            shortDescription: randomPlace.shortDescription || "",
            longDescription: randomPlace.longDescription || "",
            attractions: randomPlace.attractions || [],
            experiences: randomPlace.experiences || [],
            events: randomPlace.events || [],
            nearbyDestinations: randomPlace.nearbyDestinations || [],
            tags: randomPlace.tags || [],
          };
        }
      );

      return result;
    } catch (error) {
      console.error("❌ Firestore Fetch Error:", error);
      return rejectWithValue(error.message || "Failed to fetch homepage data.");
    }
  }
);

const homePageSlice = createSlice({
  name: "homePage",
  initialState: {
    destinationSections: {},
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHomePageData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHomePageData.fulfilled, (state, action) => {
        state.loading = false;
        state.destinationSections = action.payload;
      })
      .addCase(fetchHomePageData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default homePageSlice.reducer;

import { db } from "../src/firebase-config.js"; // Adjust path as needed
import { readFileSync } from "fs";
const seedData = JSON.parse(
  readFileSync(new URL("./seedData.json", import.meta.url), "utf-8")
);
import { collection, doc, setDoc } from "firebase/firestore";

async function seedFirestore() {
  const topCollection = "destination"; // This will hold all destination documents

  for (const [destinationId, destinationData] of Object.entries(seedData)) {
    const docRef = doc(collection(db, topCollection), destinationId);
    await setDoc(docRef, destinationData, { merge: true });
    console.log(`✅ Seeded: ${topCollection}/${destinationId}`);
  }

  console.log("🌱 Firestore seeding completed.");
}

seedFirestore().catch(console.error);

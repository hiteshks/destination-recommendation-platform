export default function fuzzyMatch(destination, query) {
  if (!query || !destination) return false;

  const q = query.toLowerCase().trim();

  const fields = [
    destination.name,
    ...(destination.tags || []),
    ...(destination.type || []),
    ...(destination.experiences || []),
    destination.region,
    destination.shortDescription,
    destination.longDescription,
  ];

  return fields.some(
    (field) => typeof field === "string" && field.toLowerCase().includes(q)
  );
}

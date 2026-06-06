function formatDateTime(value) {
  if (value == null || value === "") {
    return "";
  }
  const s = String(value);
  const parsed = s.includes("T") ? new Date(s) : new Date(s.replace(" ", "T"));
  if (Number.isNaN(parsed.getTime())) {
    return s;
  }
  return parsed.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default formatDateTime;

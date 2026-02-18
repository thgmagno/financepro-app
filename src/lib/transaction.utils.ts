import { ALL } from "./strings.utils"

function titleize(input: string) {
  return input
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

export function getStatusLabel(value: string) {
  if (value === ALL) return "Any status"
  switch (value) {
    case "PENDING":
      return "Pending"
    case "COMPLETED":
      return "Completed"
    default:
      return titleize(value)
  }
}

export function getTypeLabel(value: string) {
  if (value === ALL) return "Any type"
  return titleize(value)
}

export function getScopeLabel(value: string) {
  if (value === ALL) return "Any scope"
  switch (value) {
    case "PRIVATE":
      return "Private"
    case "GROUP":
      return "Shared with my group"
    default:
      return titleize(value)
  }
}

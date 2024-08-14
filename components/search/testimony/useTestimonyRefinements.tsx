import { useRefinements } from "../useRefinements"

export const useTestimonyRefinements = () => {
  const baseProps = { limit: 500, searchable: true }
  const propsList = [
    {
      attribute: "court",
      ...baseProps,
      searchablePlaceholder: "Court"
    },
    {
      attribute: "position",
      ...baseProps,
      searchablePlaceholder: "Position"
    },
    {
      attribute: "billId",
      ...baseProps,
      searchablePlaceholder: "Bill"
    },
    {
      attribute: "authorDisplayName",
      ...baseProps,
      searchablePlaceholder: "Author Name"
    },
    {
      attribute: "authorRole",
      ...baseProps,
      searchable: false,
      hidden: true
    }
  ]

  return useRefinements({ refinementProps: propsList })
}

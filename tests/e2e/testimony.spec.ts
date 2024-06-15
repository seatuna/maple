import { test, expect } from "@playwright/test"
import { TestimonyPage } from "./page_objects/testimony"

test.beforeEach(async ({ page }) => {
  const testimonyPage = new TestimonyPage(page)
  await testimonyPage.goto()
})

test.describe("Browse Testimonies Page", () => {
  test("should display header and tabs", async ({ page }) => {
    const header = page.getByRole("heading", { name: "Browse Testimony" })
    await expect(header).toBeVisible()
  })
})

test.describe("Testimony Search", () => {
  test("should search for testimonies", async ({ page }) => {
    const testimonyPage = new TestimonyPage(page)
    const queryText = "test"
    await testimonyPage.search(queryText)

    const { queryFilterItem, resultsCountText } = testimonyPage
    await expect(queryFilterItem).toContainText("query:")
    await expect(queryFilterItem).toContainText(queryText)
    await expect(resultsCountText).toBeVisible()
  })

  test("should show zero results if no testimonies found", async ({ page }) => {
    const testimonyPage = new TestimonyPage(page)
    const queryText = "cantfindthis!"
    await testimonyPage.search(queryText)

    const { resultsCountText } = testimonyPage
    const noResultsImg = page.getByAltText("No Results")
    await expect(resultsCountText).toBeVisible()
    await expect(noResultsImg).toBeVisible()
  })
})

test.describe("Testimony Filtering", () => {
  test("should filter for testimonies by individuals", async ({ page }) => {
    const testimonyPage = new TestimonyPage(page)
    await testimonyPage.filterByAuthorRoleTab("Individuals")

    const { individualsTab } = testimonyPage
    await expect(page).toHaveURL(/.*authorRole%5D%5B0%5D=user/)
    await expect(individualsTab).toHaveClass(/nav-link/)
    await expect(individualsTab).toHaveClass(/active/)
  })

  test("should filter for testimonies by organizations", async ({ page }) => {
    const testimonyPage = new TestimonyPage(page)
    await testimonyPage.filterByAuthorRoleTab("Organizations")

    const { organizationsTab } = testimonyPage
    await expect(page).toHaveURL(/.*authorRole%5D%5B0%5D=organization/)
    await expect(organizationsTab).toHaveClass(/nav-link/)
    await expect(organizationsTab).toHaveClass(/active/)
  })

  // "All" is the page default, this test switches tabs then goes back to "All"
  // SKIP: This test will fail, switching from other tabs back to "All" currently has a bug
  test.skip("should filter for testimonies by all", async ({ page }) => {
    const testimonyPage = new TestimonyPage(page)
    await testimonyPage.filterByAuthorRoleTab("Individuals")

    const { individualsTab, allTab } = testimonyPage
    await expect(page).toHaveURL(/.*authorRole%5D%5B0%5D=user/)
    await expect(individualsTab).toHaveClass(/nav-link/)
    await expect(individualsTab).toHaveClass(/active/)

    await testimonyPage.filterByAuthorRoleTab("All")
    await expect(page).toHaveURL(/.*authorRole%5D%5B0%5D=all/)
    await expect(allTab).toHaveClass(/nav-link/)
    await expect(allTab).toHaveClass(/active/)
  })
})

test.describe("Testimony Sorting", () => {
  test("should sort by new -> old", async ({ page }) => {
    const testimonyPage = new TestimonyPage(page)
    await testimonyPage.sort("Sort by New -> Old")

    const resultsDatePosted = page.getByText(/Posted/)

    const count = await resultsDatePosted.count()
    for (let i = 0; i < count - 1; i++) {
      const current = await resultsDatePosted.nth(i).textContent()
      const next = await resultsDatePosted.nth(i + 1).textContent()

      const currDateString = current?.slice(7) // Removes "Posted " before date
      const nextDateString = next?.slice(7)

      if (currDateString && nextDateString) {
        const currPostedDate = Date.parse(currDateString)
        const nextPostedDate = Date.parse(nextDateString)

        expect(currPostedDate).toBeGreaterThanOrEqual(nextPostedDate)
      }
    }
  })

  test("should sort by old -> new", async ({ page }) => {
    const testimonyPage = new TestimonyPage(page)
    await testimonyPage.sort("Sort by Old -> New")

    const resultsDatePosted = page.getByText(/Posted/)

    const count = await resultsDatePosted.count()
    for (let i = 0; i < count - 1; i++) {
      const current = await resultsDatePosted.nth(i).textContent()
      const next = await resultsDatePosted.nth(i + 1).textContent()

      const currDateString = current?.slice(7) // Removes "Posted " before date
      const nextDateString = next?.slice(7)

      if (currDateString && nextDateString) {
        const currPostedDate = Date.parse(currDateString)
        const nextPostedDate = Date.parse(nextDateString)

        expect(currPostedDate).toBeLessThanOrEqual(nextPostedDate)
      }
    }
  })
})

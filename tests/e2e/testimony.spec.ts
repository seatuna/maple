import { test, expect } from "@playwright/test"

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:3000")
  const testimonyBtn = page.getByRole("button", {
    name: "Browse All Testimony"
  })
  await testimonyBtn.click()
})

test.describe("Browse Testimonies Page", () => {
  test("should display header and tabs", async ({ page }) => {
    const header = page.getByRole("heading", { name: "Browse Testimony" })
    await expect(header).toBeVisible()
  })
})

test.describe("Testimony Search", () => {
  test("should search for testimonies", async ({ page }) => {
    const queryText = "test"
    const searchBar = page.getByPlaceholder("Search for Testimony")
    searchBar.fill(queryText)
    const queryFilterItem = page.getByText("query:").locator("..")
    const resultsCountText = page.getByText("Results").first()
    await expect(queryFilterItem).toContainText("query:")
    await expect(queryFilterItem).toContainText(queryText)
    await expect(resultsCountText).toBeVisible()
  })

  test("should show zero results if no testimonies found", async ({ page }) => {
    const queryText = "cantfindthis!"
    const searchBar = page.getByPlaceholder("Search for Testimony")
    searchBar.fill(queryText)
    const resultsCountText = page.getByText("Showing 0-0 of 0 Results")
    const noResultsImg = page.getByAltText("No Results")
    await expect(resultsCountText).toBeVisible()
    await expect(noResultsImg).toBeVisible()
  })
})

test.describe("Testimony Filters", () => {
  test("should filter for testimonies by individuals", async ({ page }) => {
    const individualsTab = page.getByRole("tab", { name: "Individuals" })
    individualsTab.click()
    await expect(page).toHaveURL(/.*authorRole%5D%5B0%5D=user/)
    await expect(individualsTab).toHaveClass("nav-link active")
  })
})

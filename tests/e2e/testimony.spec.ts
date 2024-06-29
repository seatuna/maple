import { test, expect } from "@playwright/test"
import { TestimonyPage } from "./page_objects/testimony"

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:3000/testimony")
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
  test("should filter for testimonies by author role, individuals", async ({
    page
  }) => {
    const testimonyPage = new TestimonyPage(page)
    await testimonyPage.filterByAuthorRoleTab("Individuals")

    const { individualsTab } = testimonyPage
    await expect(page).toHaveURL(/.*authorRole%5D%5B0%5D=user/)
    await expect(individualsTab).toHaveClass(/nav-link/)
    await expect(individualsTab).toHaveClass(/active/)
  })

  test("should filter for testimonies by author role, organizations", async ({
    page
  }) => {
    const testimonyPage = new TestimonyPage(page)
    await testimonyPage.filterByAuthorRoleTab("Organizations")

    const { organizationsTab } = testimonyPage
    await expect(page).toHaveURL(/.*authorRole%5D%5B0%5D=organization/)
    await expect(organizationsTab).toHaveClass(/nav-link/)
    await expect(organizationsTab).toHaveClass(/active/)
  })

  /* "All" is the page default, this test switches tabs then goes back to "All"
    SKIP: This test will fail, switching from other tabs back to "All" currently has a bug
    https://github.com/codeforboston/maple/issues/1578 */
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

  test("should filter by court", async ({ page }) => {
    await page.getByRole("checkbox", { name: "192" }).check()
    const appliedCourtFilters = page.getByText("court:").locator("..")
    await expect(appliedCourtFilters).toContainText("192")
    await expect(page).toHaveURL(/.*court%5D%5B1%5D=192/)
  })

  test("should filter by position: endorse", async ({ page }) => {
    await page.getByRole("checkbox", { name: "endorse" }).check()
    const testimonyPage = new TestimonyPage(page)
    await expect(testimonyPage.positionFilterItem).toContainText("endorse")
    await expect(page).toHaveURL(/.*position%5D%5B0%5D=endorse/)
  })

  test("should filter by position: neutral", async ({ page }) => {
    await page.getByRole("checkbox", { name: "neutral" }).check()
    const testimonyPage = new TestimonyPage(page)
    await expect(testimonyPage.positionFilterItem).toContainText("neutral")
    await expect(page).toHaveURL(/.*position%5D%5B0%5D=neutral/)
  })
})

test.describe("Testimony Sorting", () => {
  test("should sort by new -> old", async ({ page }) => {
    const testimonyPage = new TestimonyPage(page)
    await testimonyPage.sort("Sort by New -> Old")
    const sortValue = page.getByText("Sort by New -> Old", { exact: true })
    await expect(sortValue).toBeVisible()
  })

  test("should sort by old -> new", async ({ page }) => {
    const testimonyPage = new TestimonyPage(page)
    await testimonyPage.sort("Sort by Old -> New")
    const sortValue = page.getByText("Sort by Old -> New", { exact: true })
    await expect(sortValue).toBeVisible()
  })
})

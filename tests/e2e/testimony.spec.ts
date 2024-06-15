import { test, expect } from "@playwright/test"
import { TestimonyPage } from "./page_objects/testimony"

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:3000")
  await page
    .getByRole("button", {
      name: "Browse All Testimony"
    })
    .click()
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
    const individualsTab = page.getByRole("tab", { name: "Individuals" })
    await individualsTab.click()
    await expect(page).toHaveURL(/.*authorRole%5D%5B0%5D=user/)
    await expect(individualsTab).toHaveClass(/nav-link/)
    await expect(individualsTab).toHaveClass(/active/)
  })

  test("should filter for testimonies by organizations", async ({ page }) => {
    const orgsTab = page.getByRole("tab", { name: "Organizations" })
    await orgsTab.click()
    await expect(page).toHaveURL(/.*authorRole%5D%5B0%5D=organization/)
    await expect(orgsTab).toHaveClass(/nav-link/)
    await expect(orgsTab).toHaveClass(/active/)
  })

  // "All" is the page default, this test switches tabs then goes back to "All"
  // SKIP: This test will fail, switching from other tabs back to "All" currently has a bug
  test.skip("should filter for testimonies by all", async ({ page }) => {
    const individualsTab = page.getByRole("tab", { name: "Individual" })
    await individualsTab.click()
    await expect(page).toHaveURL(/.*authorRole%5D%5B0%5D=user/)
    await expect(individualsTab).toHaveClass(/nav-link/)
    await expect(individualsTab).toHaveClass(/active/)

    const allTab = page.getByRole("tab", { name: "Individual" })
    await allTab.click()
    await expect(page).toHaveURL(/.*authorRole%5D%5B0%5D=all/)
    await expect(allTab).toHaveClass(/nav-link/)
    await expect(allTab).toHaveClass(/active/)
  })
})

// test.describe("Testimony Sorting", () => {
//   test("should sort by new -> old", async ({ page }) => {
//     await page.getByRole("option", { name: "Sort by New -> Old" }).click()
//   })
// })

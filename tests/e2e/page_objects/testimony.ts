import { expect, type Locator, type Page } from "@playwright/test"

export class TestimonyPage {
  readonly page: Page
  readonly allTab: Locator
  readonly individualsTab: Locator
  readonly organizationsTab: Locator
  readonly queryFilterItem: Locator
  readonly resultsCountText: Locator
  readonly searchBar: Locator

  constructor(page: Page) {
    this.page = page
    this.allTab = page.getByRole("tab", { name: "All" })
    this.individualsTab = page.getByRole("tab", { name: "Individual" })
    this.organizationsTab = page.getByRole("tab", { name: "Organizations" })
    this.queryFilterItem = page.getByText("query:").locator("..")
    this.resultsCountText = page.getByText("Results").first()
    this.searchBar = page.getByPlaceholder("Search for Testimony")
  }

  async goto() {
    await this.page.goto("http://localhost:3000/testimony")
  }

  async search(query: string) {
    await this.searchBar.fill(query)
  }

  async filterByAuthorRoleTab(role: string) {
    await this.page.getByRole("tab", { name: role }).click()
  }

  async sort(option: string) {
    await this.page.getByText("Sort by New -> Old").click()
    await this.page.getByRole("option", { name: option }).click()
  }

  async getPostedDatesFromLocatorResults(results: Locator) {
    const count = await results.count()
    const dates = []
    for (let i = 0; i < count - 1; i++) {
      const current = await results.nth(i).textContent()
      const next = await results.nth(i + 1).textContent()

      const currDateString = current?.slice(7) // Removes "Posted " before date
      const nextDateString = next?.slice(7)

      if (i === 0 && currDateString) dates.push(Date.parse(currDateString))
      if (nextDateString) dates.push(Date.parse(nextDateString))
    }
    return dates
  }
}

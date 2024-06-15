import { expect, type Locator, type Page } from "@playwright/test"

export class TestimonyPage {
  readonly page: Page
  readonly resultsCountText: Locator
  readonly queryFilterItem: Locator
  readonly searchBar: Locator

  constructor(page: Page) {
    this.page = page
    this.resultsCountText = page.getByText("Results").first()
    this.queryFilterItem = page.getByText("query:").locator("..")
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
}

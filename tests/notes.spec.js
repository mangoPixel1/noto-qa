import { test, expect } from "@playwright/test";

// Notes Tests
// test notes CRUD actions

test.describe("Note Creation", () => {
  test.beforeEach(async ({ page }) => {
    // Go to the login url
    await page.goto("http://localhost:5173/login");

    // Login with credentials
    await page.getByRole("textbox", { name: "Email" }).click();
    await page
      .getByRole("textbox", { name: "Email" })
      .fill(process.env.TEST_EMAIL);
    await page.getByRole("textbox", { name: "Password" }).click();
    await page
      .getByRole("textbox", { name: "Password" })
      .fill(process.env.TEST_PASSWORD);
    await page.getByRole("button", { name: "Log in" }).click();
  });
  // Happy path for a simple note
  test("Verify new note with title/body and no folder appears on dashboard", async ({
    page,
  }) => {
    // Open new note modal
    await page.locator("button:has(svg.lucide-circle-plus)").click();

    // Enter note title and body
    const noteTitle = `Test Note ${Date.now()}`;
    const noteBody = `Test note body ${Date.now()}`;
    await page.getByRole("textbox", { name: "Title" }).fill(noteTitle);
    await page.getByRole("textbox", { name: "Body" }).fill(noteBody);

    // Confirm no folder is selected and add note
    await expect(page.locator("form")).toContainText("Select a folder");
    await page.getByRole("button", { name: "Add Note" }).click();

    // Verify that note appears on dashboard
    await expect(page.getByRole("link", { name: noteTitle })).toBeVisible();
    await expect(page.getByText(noteBody)).toBeVisible();
  });

  test("name", async ({ page }) => {
    // todo
  });

  test("name2", async ({ page }) => {
    // todo
  });

  test("name3", async ({ page }) => {
    // todo
  });
});

test.describe("Note Editing", () => {
  test.beforeEach(async ({ page }) => {
    // Go to the login url
    await page.goto("http://localhost:5173/login");

    // Login with credentials
    await page.getByRole("textbox", { name: "Email" }).click();
    await page
      .getByRole("textbox", { name: "Email" })
      .fill(process.env.TEST_EMAIL);
    await page.getByRole("textbox", { name: "Password" }).click();
    await page
      .getByRole("textbox", { name: "Password" })
      .fill(process.env.TEST_PASSWORD);
    await page.getByRole("button", { name: "Log in" }).click();
  });

  // modifying title/content
});

test.describe("Note Status", () => {
  test.beforeEach(async ({ page }) => {
    // Go to the login url
    await page.goto("http://localhost:5173/login");

    // Login with credentials
    await page.getByRole("textbox", { name: "Email" }).click();
    await page
      .getByRole("textbox", { name: "Email" })
      .fill(process.env.TEST_EMAIL);
    await page.getByRole("textbox", { name: "Password" }).click();
    await page
      .getByRole("textbox", { name: "Password" })
      .fill(process.env.TEST_PASSWORD);
    await page.getByRole("button", { name: "Log in" }).click();
  });

  // active, archived, trash, restored
});

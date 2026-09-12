import { test, expect } from "@playwright/test";

// Login tests
test.describe("Login", () => {
  // Navigate to login page before each test
  test.beforeEach(async ({ page }) => {
    // Go to the login url
    await page.goto("http://localhost:5173/login");
  });

  test("Valid credentials navigates to dashboard", async ({ page }) => {
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

    await expect(page.getByRole("heading", { name: "Home" })).toBeVisible(); // verify "Home" text is visible
    await expect(page).toHaveURL("http://localhost:5173/dashboard"); // verify URL for dashboard page after page loads
  });

  test("Invalid credentials displays error message", async ({ page }) => {
    await page.getByRole("textbox", { name: "Email" }).click();
    await page
      .getByRole("textbox", { name: "Email" })
      .fill(process.env.TEST_EMAIL);
    await page.getByRole("textbox", { name: "Password" }).click();
    await page
      .getByRole("textbox", { name: "Password" })
      .fill("wrong-password");
    await page.getByRole("button", { name: "Log in" }).click();
    await expect(page.locator("form")).toContainText(
      "Invalid login credentials",
    ); // verify error message is displayed
    await expect(page).toHaveURL("http://localhost:5173/login"); // verify current URL is still the login page
  });

  test("Empty fields shows validation message", async ({ page }) => {
    // Submit the form without filling in any fields
    await page.getByRole("button", { name: "Log in" }).click();

    // verify validation message is displayed
    await expect(page.locator("form")).toContainText(
      "All fields are required.",
    );

    // verify page did not navigate away
    await expect(page).toHaveURL("http://localhost:5173/login");
  });

  test('"Forgot your password?" link navigates to the reset page', async ({
    page,
  }) => {
    const forgotPasswordLink = page.getByRole("link", {
      name: "Forgot your password?",
    });
    await expect(forgotPasswordLink).toBeVisible();

    await forgotPasswordLink.click();

    // verify navigation to the password reset page
    await expect(page).toHaveURL("http://localhost:5173/forgot-password");
  });

  test("Logout navigates to home page", async ({ page }) => {
    // Log in as existing user
    await page.getByRole("textbox", { name: "Email" }).click();
    await page
      .getByRole("textbox", { name: "Email" })
      .fill(process.env.TEST_EMAIL);
    await page.getByRole("textbox", { name: "Password" }).click();
    await page
      .getByRole("textbox", { name: "Password" })
      .fill(process.env.TEST_PASSWORD);
    await page.getByRole("button", { name: "Log in" }).click();

    // Log out of account
    await page.getByRole("button", { name: "Sign out" }).click();

    // verify URL for home page
    await expect(page).toHaveURL("http://localhost:5173/");

    // Verify Login and Signup buttons visible
    await expect(page.getByRole("link", { name: "Log In" })).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Sign Up", exact: true }),
    ).toBeVisible();
  });

  test("Security check: Logged out user cannot access authenticated routes", async ({
    page,
  }) => {
    // Log in as existing user
    await page.getByRole("textbox", { name: "Email" }).click();
    await page
      .getByRole("textbox", { name: "Email" })
      .fill(process.env.TEST_EMAIL);
    await page.getByRole("textbox", { name: "Password" }).click();
    await page
      .getByRole("textbox", { name: "Password" })
      .fill(process.env.TEST_PASSWORD);
    await page.getByRole("button", { name: "Log in" }).click();
    await expect(page).toHaveURL(/\/dashboard/);

    // Log out of account
    await page.getByRole("button", { name: "Sign out" }).click();

    // Verify URL for home page
    await expect(page).toHaveURL("http://localhost:5173/");
    await expect(
      page.getByRole("heading", { name: "Capture What's On Your Mind" }),
    ).toBeVisible();

    // Test back functionality
    await page.goto("http://localhost:5173/dashboard");
    await expect(page).not.toHaveURL(/\/dashboard/);
    await expect(page).toHaveURL("http://localhost:5173/login");
  });
});

test("Verify user remains logged in when Remember Me is selected in login page", async ({
  browser,
}) => {
  // Create persistent context
  const context = await browser.newContext();
  const page = await context.newPage();

  // Navigate to your login page
  await page.goto("http://localhost:5173/login");

  // Enter valid credentials
  await page.getByRole("textbox", { name: "Email" }).click();
  await page
    .getByRole("textbox", { name: "Email" })
    .fill(process.env.TEST_EMAIL);
  await page.getByRole("textbox", { name: "Password" }).click();
  await page
    .getByRole("textbox", { name: "Password" })
    .fill(process.env.TEST_PASSWORD);

  // Verify "Remember Me" checkbox is checked by default
  const rememberMe = page.getByRole("checkbox", { name: "Remember Me" });
  await expect(rememberMe).toBeChecked();

  // Click Login button and verify login succeeded
  await page.getByRole("button", { name: "Log in" }).click();
  await expect(page).toHaveURL(/\/dashboard/);
  await expect(page.getByRole("heading", { name: "Home" })).toBeVisible();

  // Capture the storage state containing cookies and local storage tokens
  const rememberedState = await context.storageState();

  // Obliterate the session context to mimic a browser restart
  await context.close();

  // Create a completely separate context prepopulated with the saved state
  const newContext = await browser.newContext({
    storageState: rememberedState,
  });
  const newPage = await newContext.newPage();

  // Navigate to an authenticated route to check session persistance
  await newPage.goto("http://localhost:5173/dashboard");
  await expect(newPage).toHaveURL(/\/dashboard/);
  await expect(newPage.getByRole("heading", { name: "Home" })).toBeVisible();
});

test("Verify user is not persisted when Remember Me is not selected in login page", async ({
  browser,
}) => {
  // Create persistent context
  const context = await browser.newContext();
  const page = await context.newPage();

  // Navigate to your login page
  await page.goto("http://localhost:5173/login");

  // Enter valid credentials
  await page.getByRole("textbox", { name: "Email" }).click();
  await page
    .getByRole("textbox", { name: "Email" })
    .fill(process.env.TEST_EMAIL);
  await page.getByRole("textbox", { name: "Password" }).click();
  await page
    .getByRole("textbox", { name: "Password" })
    .fill(process.env.TEST_PASSWORD);

  // Verify "Remember Me" checkbox is checked by default
  const rememberMe = page.getByRole("checkbox", { name: "Remember Me" });
  await expect(rememberMe).toBeChecked();

  // Uncheck "Remember Me" checkbox
  await rememberMe.uncheck();

  // Click Login button and verify login succeeded
  await page.getByRole("button", { name: "Log in" }).click();
  await expect(page).toHaveURL(/\/dashboard/);
  await expect(page.getByRole("heading", { name: "Home" })).toBeVisible();

  // Capture the storage state containing cookies and local storage tokens
  const rememberedState = await context.storageState();

  // Obliterate the session context to mimic a browser restart
  await context.close();

  // Create a completely separate context prepopulated with the saved state
  const newContext = await browser.newContext({
    storageState: rememberedState,
  });
  const newPage = await newContext.newPage();

  // Navigate to an authenticated route to verify that session did not persist
  await newPage.goto("http://localhost:5173/dashboard");
  await expect(newPage).toHaveURL(/\/login/);
  await expect(newPage.getByRole("heading", { name: "Log in" })).toBeVisible();
});

// Sign up tests
test.describe("Signup", () => {
  // Navigate to signup page before each test
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173/signup");
  });

  // Generates a unique, deliverable email per run using Gmail "+tag" addressing
  function uniqueTestEmail() {
    return `mcavada97+notoqa${Date.now()}@gmail.com`;
  }

  test("Valid input submits the signup request to the API", async ({
    page,
  }) => {
    const email = uniqueTestEmail();

    await page.getByRole("textbox", { name: "Name" }).fill("Noto QA");
    await page.getByRole("textbox", { name: "Email" }).fill(email);
    await page
      .getByRole("textbox", { name: "Password", exact: true })
      .fill("password123");
    await page
      .getByRole("textbox", { name: "Confirm Password" })
      .fill("password123");

    // Verifies that valid credentials triggers an API POST request with the correct credentials
    const signupRequestPromise = page.waitForRequest(
      (req) => req.url().includes("/auth/v1/signup") && req.method() === "POST",
    );
    await page.getByRole("button", { name: "Sign up" }).click();
    const signupRequest = await signupRequestPromise;
    const requestBody = signupRequest.postDataJSON();

    expect(requestBody.data.name).toBe("Noto QA");
    expect(requestBody.email).toBe(email);
    expect(requestBody.password).toBe("password123");
  });

  test("Empty fields shows validation message", async ({ page }) => {
    // Submit the form without filling in any fields
    await page.getByRole("button", { name: "Sign up" }).click();

    await expect(page.locator("form")).toContainText(
      "All fields are required.",
    );
    await expect(page).toHaveURL("http://localhost:5173/signup");
  });

  test("Mismatched passwords are rejected", async ({ page }) => {
    await page.getByRole("textbox", { name: "Name" }).fill("Noto QA");
    await page.getByRole("textbox", { name: "Email" }).fill(uniqueTestEmail());
    await page
      .getByRole("textbox", { name: "Password", exact: true })
      .fill("password123");
    await page
      .getByRole("textbox", { name: "Confirm Password" })
      .fill("password456");
    await page.getByRole("button", { name: "Sign up" }).click();

    await expect(page.locator("form")).toContainText("Passwords do not match.");
    await expect(page).toHaveURL("http://localhost:5173/signup");
  });

  test("Password below minimum length is rejected", async ({ page }) => {
    await page.getByRole("textbox", { name: "Name" }).fill("Noto QA");
    await page.getByRole("textbox", { name: "Email" }).fill(uniqueTestEmail());
    await page
      .getByRole("textbox", { name: "Password", exact: true })
      .fill("123");
    await page.getByRole("textbox", { name: "Confirm Password" }).fill("123");
    await page.getByRole("button", { name: "Sign up" }).click();

    await expect(page.locator("form")).toContainText(
      "Password should be at least 6 characters.",
    ); // enforced server-side by Supabase, may take a moment
    await expect(page).toHaveURL("http://localhost:5173/signup");
  });

  test("Invalid email format is rejected", async ({ page }) => {
    const emailInput = page.getByRole("textbox", { name: "Email" });

    await page.getByRole("textbox", { name: "Name" }).fill("Noto QA");
    await emailInput.fill("not-an-email");
    await page
      .getByRole("textbox", { name: "Password", exact: true })
      .fill("password123");
    await page
      .getByRole("textbox", { name: "Confirm Password" })
      .fill("password123");
    await page.getByRole("button", { name: "Sign up" }).click();

    // Blocked by the browser's native type="email" validation, so the form
    // never submits (there is no custom app error message for this case)
    const emailIsValid = await emailInput.evaluate((el) => el.validity.valid);
    expect(emailIsValid).toBe(false);
    await expect(page).toHaveURL("http://localhost:5173/signup");
  });

  test("Signup page renders all fields and a link to login", async ({
    page,
  }) => {
    await expect(page.getByRole("textbox", { name: "Name" })).toBeVisible();
    await expect(page.getByRole("textbox", { name: "Email" })).toBeVisible();
    await expect(
      page.getByRole("textbox", { name: "Password", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("textbox", { name: "Confirm Password" }),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign up" })).toBeVisible();

    // Existing users can get back to the login page
    await expect(page.getByRole("link", { name: "Log in" })).toBeVisible();
  });

  test("Signup with an existing email displays an appropriate error and does not show the confirmation page", async ({
    page,
  }) => {
    // Enter required fields using email associated with existing account
    await page.getByRole("textbox", { name: "Name" }).fill("Noto QA");
    await page
      .getByRole("textbox", { name: "Email" })
      .fill(process.env.TEST_EMAIL);
    await page
      .getByRole("textbox", { name: "Password", exact: true })
      .fill(process.env.TEST_PASSWORD);
    await page
      .getByRole("textbox", { name: "Confirm Password" })
      .fill(process.env.TEST_PASSWORD);

    await page.getByRole("button", { name: "Sign up" }).click();
    await expect(page.locator("form")).toContainText(
      "An account associated with that email already exists.",
    );
    await expect(page.toHaveURL("http://localhost:5173/signup"));
  });
});

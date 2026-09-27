import { expect, test, type Page, type Route } from '@playwright/test';

/**
 * ContactForm.astro's validators object, field for field, so a rule change
 * there and a stale test here can't quietly disagree.
 */
const REQUIRED_ERRORS = {
  name: 'Name is required.',
  email: 'Email is required.',
  subject: 'Subject is required.',
  message: 'Message is required.',
};

const EMAILJS_CONFIG = {
  serviceId: 'service_5hchpb7',
  templateId: 'template_ypbcgdx',
  publicKey: 'Q9eb1Tl_INctb6Lbm',
  recipient: 'davchevfilip31@gmail.com',
};

async function fillValidForm(page: Page): Promise<void> {
  await page.fill('#contact-name', 'Ada Lovelace');
  await page.fill('#contact-email', 'ada@example.com');
  await page.fill('#contact-subject', 'A question about your work');
  await page.fill('#contact-message', 'This message is long enough to pass validation.');
}

/** Delays the mocked response briefly so "Sending…" is observable before it resolves. */
async function fulfillEmailJs(route: Route, status: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  await route.fulfill({ status, contentType: 'text/plain', body: status === 200 ? 'OK' : 'error' });
}

test.describe('validation errors', () => {
  test('submitting the empty form shows every field\'s required error and focuses the first invalid field', async ({
    page,
  }) => {
    await page.goto('');
    await page.click('[data-submit]');

    for (const [field, message] of Object.entries(REQUIRED_ERRORS)) {
      await expect(page.locator(`[data-error-for="${field}"]`)).toHaveText(message);
    }
    await expect(page.locator('#contact-name')).toBeFocused();
  });

  test('a name shorter than 2 characters shows a minimum-length error', async ({ page }) => {
    await page.goto('');
    await page.fill('#contact-name', 'A');
    await page.locator('#contact-name').press('Tab');
    await expect(page.locator('[data-error-for="name"]')).toHaveText('Minimum 2 characters.');
  });

  test('an email without an @ and domain shows a format error', async ({ page }) => {
    await page.goto('');
    await page.fill('#contact-email', 'not-an-email');
    await page.locator('#contact-email').press('Tab');
    await expect(page.locator('[data-error-for="email"]')).toHaveText('Enter a valid email.');
  });

  test('a subject shorter than 3 characters shows a minimum-length error', async ({ page }) => {
    await page.goto('');
    await page.fill('#contact-subject', 'Hi');
    await page.locator('#contact-subject').press('Tab');
    await expect(page.locator('[data-error-for="subject"]')).toHaveText('Minimum 3 characters.');
  });

  test('a message shorter than 10 characters shows a minimum-length error', async ({ page }) => {
    await page.goto('');
    await page.fill('#contact-message', 'too short');
    await page.locator('#contact-message').press('Tab');
    await expect(page.locator('[data-error-for="message"]')).toHaveText('Minimum 10 characters.');
  });

  test('a field with a fixed error clears it once corrected, on the next input', async ({ page }) => {
    await page.goto('');
    await page.fill('#contact-name', 'A');
    await page.locator('#contact-name').press('Tab');
    await expect(page.locator('[data-error-for="name"]')).toHaveText('Minimum 2 characters.');

    await page.fill('#contact-name', 'Ada Lovelace');
    await expect(page.locator('[data-error-for="name"]')).toHaveText('');
  });
});

test.describe('honeypot', () => {
  test('filling the hidden "website" field silently blocks the submit', async ({ page }) => {
    let sendRequested = false;
    await page.route('**/api.emailjs.com/**', (route) => {
      sendRequested = true;
      route.fulfill({ status: 200, body: 'OK' });
    });

    await page.goto('');
    await fillValidForm(page);
    await page.fill('input[name="website"]', 'http://spam.example');
    await page.click('[data-submit]');
    await page.waitForTimeout(300);

    expect(sendRequested).toBe(false);
    await expect(page.locator('[data-status]')).toBeEmpty();
    await expect(page.locator('[data-submit]')).toHaveText('Send message');
  });
});

test.describe('sending through EmailJS', () => {
  test('a valid submit sends the exact service, template, key and field names v1 uses, and shows success', async ({
    page,
  }) => {
    let requestBody: Record<string, unknown> | null = null;
    await page.route('**/api.emailjs.com/**', async (route) => {
      requestBody = route.request().postDataJSON();
      await fulfillEmailJs(route, 200);
    });

    await page.goto('');
    await fillValidForm(page);
    await page.click('[data-submit]');

    await expect(page.locator('[data-submit]')).toHaveText('Sending…');
    await expect(page.locator('[data-submit]')).toBeDisabled();

    await expect(page.locator('[data-status]')).toHaveText('Message sent. I’ll get back to you soon.');
    await expect(page.locator('[data-status]')).toHaveAttribute('data-tone', 'success');

    expect(requestBody).toMatchObject({
      service_id: EMAILJS_CONFIG.serviceId,
      template_id: EMAILJS_CONFIG.templateId,
      user_id: EMAILJS_CONFIG.publicKey,
      template_params: {
        from_name: 'Ada Lovelace',
        from_email: 'ada@example.com',
        subject: 'A question about your work',
        message: 'This message is long enough to pass validation.',
        to_email: EMAILJS_CONFIG.recipient,
      },
    });
  });

  // KNOWN BUG (reported, not fixed here): ContactForm.astro sets
  // `submitButton.hidden = true` on success, but global.css's `.button {
  // display: inline-flex }` (an author rule) always wins over the browser's
  // default `[hidden] { display: none }` (a user-agent rule), regardless of
  // selector specificity. The button never actually disappears. See the test
  // suite report for the full repro.
  test('the submit button visually hides once the message sends successfully', async ({ page }) => {
    await page.route('**/api.emailjs.com/**', (route) => fulfillEmailJs(route, 200));

    await page.goto('');
    await fillValidForm(page);
    await page.click('[data-submit]');

    await expect(page.locator('[data-status]')).toHaveAttribute('data-tone', 'success');
    await expect(page.locator('[data-submit]')).toBeHidden();
  });

  test('a rejected send shows "Failed, try again" and re-enables the button', async ({ page }) => {
    await page.route('**/api.emailjs.com/**', (route) => fulfillEmailJs(route, 500));

    await page.goto('');
    await fillValidForm(page);
    await page.click('[data-submit]');

    await expect(page.locator('[data-submit]')).toHaveText('Failed, try again');
    await expect(page.locator('[data-submit]')).toBeEnabled();
    await expect(page.locator('[data-status]')).toHaveText(
      `The message didn’t send. Try again, or email ${EMAILJS_CONFIG.recipient}.`,
    );
    await expect(page.locator('[data-status]')).toHaveAttribute('data-tone', 'error');
  });

  test('the failed-send button label reverts to "Send message" after a few seconds', async ({ page }) => {
    await page.route('**/api.emailjs.com/**', (route) => fulfillEmailJs(route, 500));

    await page.goto('');
    await fillValidForm(page);
    await page.click('[data-submit]');

    await expect(page.locator('[data-submit]')).toHaveText('Failed, try again');
    await expect(page.locator('[data-submit]')).toHaveText('Send message', { timeout: 4000 });
  });

  test('a blocked EmailJS script shows "Mail service unavailable" instead of attempting a send', async ({ page }) => {
    await page.route('**/email.min.js', (route) => route.abort());

    await page.goto('');
    await fillValidForm(page);
    await page.click('[data-submit]');

    await expect(page.locator('[data-submit]')).toHaveText('Mail service unavailable');
    await expect(page.locator('[data-status]')).toHaveText(
      `The mail service didn’t load. Email ${EMAILJS_CONFIG.recipient} directly instead.`,
    );
    await expect(page.locator('[data-status]')).toHaveAttribute('data-tone', 'error');
  });
});

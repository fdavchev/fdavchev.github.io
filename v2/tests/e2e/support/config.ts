/** Single source for the preview server's address, shared by the Playwright config and the tests. */
export const PORT = 4321;
export const ORIGIN = `http://localhost:${PORT}`;
export const BASE_URL = `${ORIGIN}/`;

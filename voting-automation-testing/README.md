# astro-automated-testing
Repo for playwright automated testing on Astro Voting CMS and Page

## Getting started
```bash
# git clone https://github.com/ronmakh/astro-automated-testing.git
cd astro-automated-testing
yarn install
# Run all tests
npx playwright test

# Run tests in headed mode (UI mode)
npx playwright test --headed

# Run a specific test file
npx playwright test tests/example.spec.js

# Show HTML report after tests
npx playwright show-report

# Debug a single test
npx playwright test tests/example.spec.js --debug
```
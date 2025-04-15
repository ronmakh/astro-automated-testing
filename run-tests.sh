#!/bin/bash

# Navigate to the project directory
cd "$(dirname "$0")"

# Install dependencies (if not already installed)
echo "Installing dependencies..."
npm install

# Run Playwright tests and output results as JUnit XML
echo "Running Playwright tests..."
npx playwright test --reporter=junit --output=reports/

# Check if the tests ran successfully
if [ $? -eq 0 ]; then
    echo "Tests ran successfully!"
else
    echo "Tests failed!"
    exit 1
fi

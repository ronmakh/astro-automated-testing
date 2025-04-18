FROM mcr.microsoft.com/playwright:v1.42.1-jammy

WORKDIR /app

# Copy project files
COPY . .

# Install dependencies
RUN yarn install

# Build if needed (optional)
RUN yarn build

# Default command
CMD ["npx", "playwright", "test"]

# Stage: Development
FROM node:20

# Set working directory
WORKDIR /app

# Copy only package files to install dependencies
COPY package*.json ./

# Install all deps (không dùng ci vì dev có thể chỉnh sửa package.json)
RUN npm install

# Copy toàn bộ source
COPY . .

# Expose port cho React dev server
EXPOSE 3001

# Run React development server
CMD ["npm", "start"]
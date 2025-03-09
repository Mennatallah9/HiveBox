FROM node:20-alpine 

# Set environment variables to prevent npm from creating unnecessary logs and cache
ENV NODE_ENV=production

# Set a non-root user for better security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production  

COPY . .

# Change ownership of the working directory to the non-root user
RUN chown -R appuser:appgroup /app

# Set user to the non-root user
USER appuser

EXPOSE 3000

CMD ["npm", "start"]

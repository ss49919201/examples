# Build stage
FROM public.ecr.aws/lambda/nodejs:22 AS builder

# Copy package files
COPY package*.json /functions/
COPY tsconfig.json /functions/

# Install dependencies (including dev)
RUN cd /functions && npm install

# Copy source code
COPY src/ /functions/src/

# Build TypeScript
RUN cd /functions && npm run build

# Final stage
FROM public.ecr.aws/lambda/nodejs:22

# Copy package files
COPY package*.json /functions/

# Install production dependencies only
RUN cd /functions && npm install --production

# Copy built JavaScript from builder
COPY --from=builder /functions/dist /functions/dist

# Copy handler to Lambda task root
COPY --from=builder /functions/dist/index.js /functions/

WORKDIR /functions

# Set the CMD to the handler
CMD [ "index.handler" ]

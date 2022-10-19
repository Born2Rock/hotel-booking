# BUILD FOR LOCAL DEVELOPMENT
FROM node:16.13.0-alpine As dev
WORKDIR /usr/src/app
COPY --chown=node:node package*.json ./
RUN npm ci
COPY --chown=node:node . .
RUN npx prisma generate --schema=./prisma/schema.prisma
USER node


# BUILD FOR PRODUCTION
FROM node:16.13.0-alpine As prod
WORKDIR /usr/src/app
COPY --chown=node:node package*.json ./
# In order to run `npm run build` we need access to the Nest CLI.
# The Nest CLI is a dev dependency,
# In the previous development stage we ran `npm ci` which installed all dependencies.
# So we can copy over the node_modules directory from the development image into this build image.
COPY --chown=node:node --from=dev /usr/src/app/node_modules ./node_modules
COPY --chown=node:node . .
# Run prisma generate
#RUN npx prisma generate --schema=./prisma/schema.prisma
# Run the build command which creates the production bundle
RUN npm run build
# Set NODE_ENV environment variable
ENV NODE_ENV production
# Running `npm ci` removes the existing node_modules directory.
# Passing in --only=production ensures that only the production dependencies are installed.
# This ensures that the node_modules directory is as optimized as possible.
RUN npm ci --only=production && npm cache clean --force
USER node

# Start the server using the production build
#CMD [ "node", "dist/main.js" ]
#RUN npm run start:dev

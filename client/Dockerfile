# Stage 1: Compile and Build angular codebase

# Use official node image as the base image
FROM node:12.18.3 as builder

# Set the working directory
WORKDIR /app/

# Add the source code to app
COPY package*.json /app/

# Install all the dependencies
RUN npm install

COPY ./ /app/

# Generate the build of the application
RUN npm run build -- --output-path=./dist/out


# Stage 2: Serve app with nginx server

# Use official nginx image as the base image
FROM nginx:1.19

COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Copy the build output to replace the default nginx contents.
COPY --from=builder /app/dist/out /usr/share/nginx/html

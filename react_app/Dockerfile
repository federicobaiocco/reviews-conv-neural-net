FROM node:alpine as react_app
WORKDIR /react_app
#COPY . /react_app
COPY package.json /react_app/package.json
#COPY yarn.lock /react_app/yarn.lock
RUN export REACT_APP_API_URL='http://api:8000/'
RUN npm install
COPY . /react_app
RUN npm run build

#FROM nginx:alpine
#COPY --from=react_app /react_app/build /usr/share/nginx/html
#EXPOSE 80
#CMD ["nginx", "-g", "daemon off;"]
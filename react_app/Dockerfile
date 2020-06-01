FROM node:alpine as react_app
WORKDIR /react_app
COPY . /react_app
COPY yarn.lock /react_app/yarn.lock
ENV PATH /react_app/node_modules/.bin:$PATH
RUN yarn
RUN yarn build

#FROM nginx:alpine
#COPY --from=react_app /react_app/build /usr/share/nginx/html
#EXPOSE 80
#CMD ["nginx", "-g", "daemon off;"]
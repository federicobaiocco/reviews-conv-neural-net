FROM nginx:1.15.8

RUN rm /etc/nginx/nginx.conf
COPY nginx.conf /etc/nginx/
RUN rm /etc/nginx/conf.d/default.conf
COPY project.conf /etc/nginx/conf.d/
#COPY --from=react_app /react_app/build /usr/share/nginx/html

#FROM nginx:1.16.0-alpine
#COPY --from=builder /app/build /usr/share/nginx/html
#EXPOSE 80
#CMD ["nginx", "-g", "daemon off;"]
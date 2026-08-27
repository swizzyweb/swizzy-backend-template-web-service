FROM node:24
WORKDIR /home/app/
ENV DEFAULT_PORT=3005
COPY . .
RUN npm install && npm run build
USER node
EXPOSE 3005
ENTRYPOINT ["./entrypoint.sh"]

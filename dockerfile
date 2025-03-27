FROM mysql:8.0

  ENV MYSQL_DATABASE=mydatebase
  ENV MYSQL_ROOT_PASSWORD=rootpassword
  ENV MYSQL_USER=myuser
  ENV MYSQL_PASSWORD=mypassword

  COPY ./init.sql/docker.entrypoint-initdb.d/

  EXPOSE 3306

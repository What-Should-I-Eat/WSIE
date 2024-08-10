FROM mongo

COPY *.json /docker-entrypoint-initdb.d/
COPY load_data.sh /docker-entrypoint-initdb.d/.

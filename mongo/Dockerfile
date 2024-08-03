FROM mongo:5.0.8

COPY admin.json /docker-entrypoint-initdb.d/
COPY load_data.sh /docker-entrypoint-initdb.d/.

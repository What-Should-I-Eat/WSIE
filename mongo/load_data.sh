if [ "$LOAD_ADMIN_DATA" = "true" ]; then
    echo "*************************************************"
    echo "LOAD_ADMIN_DATA is set to true. Importing data..."
    echo "*************************************************"
    mongoimport -d WSIE -c users --file /docker-entrypoint-initdb.d/admin.json --jsonArray
fi
curl -X POST http://localhost:4000/users/init-admin \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"$ADMIN_NAME\",
    \"password\": \"$ADMIN_PASS\",
    \"role\": \"ADMIN\",
    \"phone\": \"$ADMIN_PHONE\"
  }"

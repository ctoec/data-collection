docker run --rm -u "$(id -u)" -v "$(pwd)":/local openapitools/openapi-generator-cli:v4.2.2 generate -i /local/swagger.yaml -g nodejs-express-server -o /local/generated

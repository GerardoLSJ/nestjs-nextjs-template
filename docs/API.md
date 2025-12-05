# API Documentation

## Overview

The Auth Tutorial API is a REST API built with NestJS that provides backend services for the application. All API endpoints are accessible at `http://localhost:3333/api` in development.

## Interactive Documentation

**Swagger UI**: [http://localhost:3333/api/docs](http://localhost:3333/api/docs)

The API uses Swagger/OpenAPI for interactive documentation. Visit the Swagger UI to:

- View all available endpoints
- Test API requests directly in the browser
- See request/response schemas
- Explore example payloads

## Base URL

```
Development: http://localhost:3333/api
Production: TBD (Azure deployment)
```

## Authentication

Currently, the API does not implement authentication. This will be added in future iterations.

**Planned Authentication Methods:**

- JWT (JSON Web Tokens)
- Session-based authentication
- OAuth 2.0 integration

## Global Configurations

### Request Validation

The API uses class-validator for automatic request validation:

- **Whitelisting**: Only properties defined in DTOs are accepted
- **Forbidden non-whitelisted**: Requests with extra properties are rejected
- **Auto-transformation**: Request bodies are automatically transformed to DTO instances
- **Type conversion**: Query parameters and path variables are automatically converted to their specified types

### Error Handling

All validation errors return a consistent format:

```json
{
  "statusCode": 400,
  "message": ["email must be an email", "password must be at least 8 characters"],
  "error": "Bad Request"
}
```

## Available Endpoints

### Application Endpoints

#### GET /api

Returns a welcome message from the API.

**Response (200 OK):**

```json
{
  "message": "Hello API"
}
```

**Example Request:**

```bash
curl http://localhost:3333/api
```

## Data Transfer Objects (DTOs)

DTOs define the shape of request/response data and include validation rules.

### ExampleDto

Located at: `apps/api/src/app/dto/example.dto.ts`

**Fields:**

- `email` (string, required): Valid email address
- `password` (string, required): Minimum 8 characters
- `name` (string, required): User's full name

**Example:**

```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "name": "John Doe"
}
```

**Validation Rules:**

- Email must be a valid email format
- Password must be at least 8 characters
- All fields are required

## Error Codes

| Status Code | Meaning               | Common Causes                           |
| ----------- | --------------------- | --------------------------------------- |
| 200         | OK                    | Successful request                      |
| 400         | Bad Request           | Invalid request data, validation errors |
| 404         | Not Found             | Endpoint or resource doesn't exist      |
| 500         | Internal Server Error | Server-side error                       |

## Development

### Adding New Endpoints

1. **Create a DTO** (if needed):

   ```typescript
   // apps/api/src/app/dto/my-endpoint.dto.ts
   import { ApiProperty } from '@nestjs/swagger';
   import { IsString, IsNotEmpty } from 'class-validator';

   export class MyEndpointDto {
     @ApiProperty({ description: 'Field description' })
     @IsString()
     @IsNotEmpty()
     fieldName: string;
   }
   ```

2. **Add Controller Method**:

   ```typescript
   // apps/api/src/app/app.controller.ts
   import { Body, Post } from '@nestjs/common';
   import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
   import { MyEndpointDto } from './dto/my-endpoint.dto';

   @Post('my-endpoint')
   @ApiOperation({ summary: 'Description of endpoint' })
   @ApiResponse({ status: 200, description: 'Success response' })
   createSomething(@Body() dto: MyEndpointDto) {
     // Implementation
   }
   ```

3. **Update this documentation** with the new endpoint details

### Swagger Decorators Reference

- `@ApiTags('tag-name')`: Group endpoints in Swagger UI
- `@ApiOperation({ summary: 'Description' })`: Endpoint description
- `@ApiResponse({ status: 200, description: 'Success' })`: Response documentation
- `@ApiProperty()`: Document DTO properties
- `@ApiBearerAuth()`: Mark endpoint as requiring authentication (future)

## Testing

### Unit Tests

Run API unit tests:

```bash
npx nx test api
```

### E2E Tests

Run API end-to-end tests:

```bash
npx nx e2e api-e2e
```

### Manual Testing

**Using Swagger UI:**

1. Start the API: `npm run dev:all`
2. Visit http://localhost:3333/api/docs
3. Click "Try it out" on any endpoint
4. Fill in request parameters/body
5. Click "Execute"

**Using curl:**

```bash
# GET request
curl http://localhost:3333/api

# POST request with JSON body
curl -X POST http://localhost:3333/api/endpoint \
  -H "Content-Type: application/json" \
  -d '{"field": "value"}'
```

**Using HTTPie:**

```bash
# GET request
http GET http://localhost:3333/api

# POST request
http POST http://localhost:3333/api/endpoint field=value
```

## Rate Limiting

Rate limiting is not currently implemented but will be added for production:

- Planned: 100 requests per minute per IP
- Implementation: `@nestjs/throttler`

## Versioning

API versioning strategy (to be implemented):

- URL versioning: `/api/v1/endpoint`
- Header versioning: `Accept: application/vnd.api.v1+json`

Current version: **v1.0**

## LLM-Specific Notes

When modifying the API:

1. **Always run health checks** after changes:

   ```bash
   npm run health-check
   ```

2. **Update Swagger documentation** by adding decorators to:

   - Controllers (@ApiOperation, @ApiResponse)
   - DTOs (@ApiProperty)

3. **Validate DTOs** using class-validator decorators:

   - @IsString, @IsNumber, @IsEmail, etc.
   - @IsNotEmpty, @IsOptional
   - @MinLength, @MaxLength
   - @Min, @Max

4. **Update this file** when adding/modifying endpoints

5. **Test the Swagger UI** to ensure documentation is correct:

   ```bash
   # Start the API
   npm run dev:all

   # Visit http://localhost:3333/api/docs
   ```

6. **Follow commit conventions**:
   ```bash
   feat(api): add new user endpoint
   fix(api): correct validation for email field
   docs(api): update API documentation
   ```

## Future Enhancements

Planned features:

- [ ] JWT authentication
- [ ] User management endpoints
- [ ] Database integration (PostgreSQL)
- [ ] File upload support
- [ ] WebSocket support for real-time features
- [ ] GraphQL endpoint
- [ ] API rate limiting
- [ ] Request logging with Pino
- [ ] Global exception filter
- [ ] Health check endpoint

## Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [Swagger/OpenAPI Specification](https://swagger.io/specification/)
- [class-validator Documentation](https://github.com/typestack/class-validator)
- [Local Swagger UI](http://localhost:3333/api/docs)

---

**Last Updated**: 2025-12-05
**API Version**: 1.0
**Maintainer**: Project Team

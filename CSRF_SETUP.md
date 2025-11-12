# Double CSRF Protection Setup

This project has been configured with double CSRF protection using the `csrf-csrf` package.

## Configuration

The CSRF protection is configured in `src/main.ts` with the following settings:

- **Cookie Name**: `__Host-psifi.x-csrf-token`
- **Cookie Options**: 
  - `sameSite: 'strict'`
  - `secure: true` (in production)
  - `path: '/'`
- **Token Size**: 64 bytes
- **Ignored Methods**: GET, HEAD, OPTIONS (these methods don't require CSRF tokens)

## How It Works

The double CSRF pattern works by:
1. Setting a signed cookie with a random secret
2. Generating a CSRF token based on that secret
3. Validating that the token sent in the request matches the cookie

## Usage

### 1. Get a CSRF Token

Before making any POST, PUT, DELETE, or PATCH requests, you need to get a CSRF token:

```bash
curl -c cookies.txt http://localhost:3000/csrf/token
```

Response:
```json
{
  "token": "your-csrf-token-here",
  "message": "Include this token in the x-csrf-token header for protected requests"
}
```

### 2. Make Protected Requests

Include the token in the `x-csrf-token` header and send the cookies:

```bash
curl -b cookies.txt \
  -H "x-csrf-token: your-csrf-token-here" \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"name": "John"}' \
  http://localhost:3000/users
```

### Frontend Integration

#### Using Fetch API

```javascript
// 1. Get the CSRF token
const response = await fetch('http://localhost:3000/csrf/token', {
  credentials: 'include', // Important: include cookies
});
const { token } = await response.json();

// 2. Use the token in protected requests
const result = await fetch('http://localhost:3000/users', {
  method: 'POST',
  credentials: 'include', // Important: include cookies
  headers: {
    'Content-Type': 'application/json',
    'x-csrf-token': token, // Include the CSRF token
  },
  body: JSON.stringify({ name: 'John' }),
});
```

#### Using Axios

```javascript
import axios from 'axios';

// Configure axios to always send cookies
axios.defaults.withCredentials = true;

// 1. Get the CSRF token
const { data } = await axios.get('http://localhost:3000/csrf/token');
const csrfToken = data.token;

// 2. Use the token in protected requests
await axios.post('http://localhost:3000/users', 
  { name: 'John' },
  {
    headers: {
      'x-csrf-token': csrfToken,
    }
  }
);
```

## Environment Variables

Set the `CSRF_SECRET` environment variable for production:

```bash
CSRF_SECRET=your-very-secure-random-secret-here
NODE_ENV=production
```

## CORS Configuration

If your frontend is on a different domain, update the CORS configuration in `main.ts`:

```typescript
const app = await NestFactory.create(AppModule, {
  cors: {
    origin: 'http://localhost:4200', // Your frontend URL
    credentials: true, // Important: allow credentials (cookies)
  }
});
```

## Disabling CSRF for Specific Routes

If you need to disable CSRF for specific routes (e.g., webhooks), you can apply the middleware selectively:

1. Remove the global middleware from `main.ts`:
   ```typescript
   // app.use(doubleCsrfProtection); // Comment this out
   ```

2. Create a custom guard and apply it to specific controllers or routes:
   ```typescript
   @UseGuards(CsrfGuard)
   @Controller('users')
   export class UsersController {
     // Your routes
   }
   ```

## Testing

When running tests, you may want to disable CSRF protection or mock the token generation. You can use environment variables to conditionally enable/disable CSRF.

## Security Notes

- Always use HTTPS in production (`secure: true` in cookie options)
- Keep your `CSRF_SECRET` secret and rotate it periodically
- The token should be requested for each session or periodically refreshed
- Never expose CSRF tokens in URLs or logs

# Career Findr - Development Notes

## Quick Start Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start
```

## Firebase Setup Checklist

- [ ] Create Firebase project
- [ ] Enable Firestore Database
- [ ] Enable Email/Password Authentication
- [ ] Download Admin SDK credentials
- [ ] Copy web app configuration
- [ ] Update .env file with credentials

## API Testing

Use tools like:
- Postman
- Insomnia
- Thunder Client (VS Code extension)
- cURL

## Common Issues & Solutions

### Issue: Firebase Admin SDK error
**Solution**: Make sure FIREBASE_PRIVATE_KEY is properly formatted with `\n` for newlines

### Issue: CORS error
**Solution**: Update CLIENT_URL in .env to match your frontend URL

### Issue: JWT token expired
**Solution**: Login again to get a new token, or increase JWT_EXPIRE in .env

## Next Steps

1. Set up Firebase project and get credentials
2. Create .env file with your configuration
3. Install dependencies: `npm install`
4. Run the server: `npm run dev`
5. Test endpoints using Postman or similar tool
6. Build the frontend (React app)
7. Deploy to cloud platform

## Firestore Collections

The application uses these Firestore collections:
- `users` - User profiles and authentication data
- `jobs` - Job postings
- `applications` - Job applications

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| NODE_ENV | Environment | development/production |
| FIREBASE_PROJECT_ID | Firebase project ID | my-project-123 |
| JWT_SECRET | Secret key for JWT | random-secret-key |
| CLIENT_URL | Frontend URL | http://localhost:3000 |

## API Response Format

All API responses follow this format:

**Success:**
```json
{
  "success": true,
  "message": "Success message",
  "data": { }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error"
}
```

## Testing Workflow

1. Register a user (jobseeker)
2. Register an employer
3. Login as employer and create a job
4. Login as jobseeker and apply for the job
5. Login as employer and view/update application status

## Security Best Practices

- Never commit .env file
- Use strong JWT secrets in production
- Enable Firebase security rules
- Implement rate limiting (already configured)
- Use HTTPS in production
- Validate all inputs (already implemented)

## Future Enhancements

- [ ] Email notifications (SendGrid/NodeMailer)
- [ ] File upload for resumes (Firebase Storage)
- [ ] Real-time updates (Socket.io)
- [ ] Advanced search with Algolia
- [ ] Analytics dashboard
- [ ] Payment integration for premium features
- [ ] Job recommendations based on user profile
- [ ] Chat system between employers and jobseekers

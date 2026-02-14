# JakeBates.com

Source code for [JakeBates.com](https://jakebates.com).

## Development

1. Install dependencies: `npm install`
2. Start dev server: `npm start`

## Deployment

To deploy the site and the social media pre-rendering functions, use the following commands:

```bash
# 1. Build the React app
npm run build

# 2. Copy the index.html to the functions directory (Required for pre-rendering)
cp build/index.html functions/index.html

# 3. Deploy to Firebase
firebase deploy
```

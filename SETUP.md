# How to run locally

1. Run `npm install` or `bun install`
2. Add the `.env` file to the root folder (it's not on GitHub, you need to get it from someone on the team).
3. Open a terminal and run the backend:
   ```bash
   npm run backend:start
   ```
4. Open a second terminal and start expo:
   ```bash
   npx expo start
   ```

*(Note for Mac users: If you get command not found errors, try running `export PATH=$PATH:/opt/homebrew/bin && npm run backend:start`)*

Then just press `i` in the terminal to open the iOS simulator, or `a` for Android.

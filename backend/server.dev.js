// Local development entry point — do not use in production.
// Mocks firebase-functions so the Express app in index.js starts without the Firebase runtime.
const path = require("path")
require("dotenv").config({ path: path.join(__dirname, ".env.local") })

if (process.env.NODE_ENV === "production") {
    console.error("[dev] server.dev.js must not run with NODE_ENV=production")
    process.exit(1)
}

const mongoUri = process.env.ATLAS_URI || "mongodb://mongo:27017/vehicle-checklist"
const jwtSecret = process.env.JWT_VERIFY
const sentryDsn = process.env.SENTRY_DSN || ""

if (!jwtSecret) {
    console.error("[dev] JWT_VERIFY is required. Set it in backend/.env.local")
    process.exit(1)
}

const ffPath = require.resolve("firebase-functions")
require.cache[ffPath] = {
    id: ffPath,
    filename: ffPath,
    loaded: true,
    exports: {
        config: () => ({
            mongo: { uri: mongoUri },
            jwt: { verify: jwtSecret },
            sentry: { dsn: sentryDsn }
        }),
        // functions.region('europe-west1').https.onRequest(app) → just returns app
        region: () => ({
            https: { onRequest: (handler) => handler }
        }),
        https: { onRequest: (handler) => handler }
    }
}

const { app } = require("./index")
const PORT = parseInt(process.env.PORT || "5001", 10)

app.listen(PORT, () => {
    console.log(`[dev] Backend running on http://localhost:${PORT}`)
    console.log(`[dev] MongoDB: ${mongoUri}`)
})

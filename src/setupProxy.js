const { createProxyMiddleware } = require("http-proxy-middleware")

module.exports = (app) => {
    app.use(
        "/api",
        createProxyMiddleware({
            target: process.env.BACKEND_URL || "http://localhost:5001",
            changeOrigin: true
        })
    )
}

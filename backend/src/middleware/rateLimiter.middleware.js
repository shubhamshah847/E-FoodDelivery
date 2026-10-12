const WINDOW_MS = 60 * 1000
const MAX_REQUESTS = 5
const requestsByClient = new Map()

const cleanupInterval = setInterval(() => {
    const now = Date.now()
    for (const [key, window] of requestsByClient) {
        if (window.resetAt <= now) requestsByClient.delete(key)
    }
}, WINDOW_MS)
cleanupInterval.unref?.()

const rateLimiter = async (req, res, next) => {
    const key = req.ip || req.socket?.remoteAddress || "unknown"
    const now = Date.now()
    let window = requestsByClient.get(key)

    if (!window || window.resetAt <= now) {
        window = { count: 0, resetAt: now + WINDOW_MS }
    }

    window.count += 1
    requestsByClient.set(key, window)

    if (window.count > MAX_REQUESTS) {
        return res.status(429).json({
            message: "Too many requests. Try again later."
        })
    }

    return next()
};

export default rateLimiter;
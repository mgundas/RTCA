const setCache = (req, res, next) => {
    // Keep cache for x minutes (in seconds)
    const period = 60 * 5

    // Only want to cache for GET requests
    if (req.method == "GET") {
        res.set("Cache-control", `public, max-age=${period}`)
    } else {
        // for other requests, set strict no caching parameters
        res.set("Cache-control", `no-store`)
    }

    next()
}

module.exports = setCache
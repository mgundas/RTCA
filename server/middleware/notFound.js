const notFound = (req, res) => {
    return res.status(404).json({
        success: false,
        msg: "Not found."
    })
}

module.exports = notFound
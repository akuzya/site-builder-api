module.exports = {
    fileUpload
};

function fileUpload(req, res, next) {
    console.log('req.file: ', req.file);
    res.json({ filename: `${req.file.filename}` });
}
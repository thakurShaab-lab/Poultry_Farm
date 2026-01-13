const multer = require('multer')
const path = require('path')
const fs = require('fs')

const storage = (moduleName) =>
    multer.diskStorage({
        destination: (req, file, cb) => {
            const uploadPath = path.resolve(__dirname, '../../poultry_farming/uploaded_files', moduleName)

            console.log(uploadPath)

            cb(null, uploadPath)
        },
        filename: (req, file, cb) => {
            const fileExtension = path.extname(file.originalname)
            const fileName =
                Date.now() + '-' + Math.round(Math.random() * 1e9) + fileExtension
            cb(null, fileName)
        },
    })

const upload = (moduleName) => {
    return multer({
        storage: storage(moduleName),
        fileFilter: (req, file, cb) => {
            const fileTypes = /jpeg|jpg|png|gif|mp4|mov|avi|rtf|doc|docx|pdf/
            const mimeType = fileTypes.test(file.mimetype)
            const extname = fileTypes.test(
                path.extname(file.originalname).toLowerCase()
            )

            if (mimeType && extname) {
                return cb(null, true)
            } else {
                cb(new Error('Invalid file type! Allowed: .rtf, .doc, .docx, .pdf'))
            }
        },
        limits: {
            fileSize: 10 * 1024 * 1024,
        },
    })
}

module.exports = { upload }
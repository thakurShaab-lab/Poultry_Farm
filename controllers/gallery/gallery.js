const galleryModel = require('../../model/gallery/gallery')
const { convertNulls } = require('../../utils/convertNull')

const galleryController = {

    list: async (req, res) => {
        try {
            const { type } = req.body

            const page = Number(req.query.page || 1)
            const limit = Number(req.query.limit || 10)

            const result = await galleryModel.list({ type, page, limit })

            const host = req.get("host").split(":")[0]
            const BASE_URL = `${req.protocol}://${host}`

            const data = result.data.map(item => {
                item.gallery_image = item.gallery_image
                    ? `${BASE_URL}/plant/uploaded_files/gallery/${item.gallery_image}`
                    : `${BASE_URL}/plant/uploaded_files/no-image.png`

                return item
            })

            return res.json(convertNulls({
                success: true,
                page,
                limit,
                total: result.total,
                data
            }))

        } catch (err) {
            console.error(err)
            return res.status(500).json({
                success: false,
                message: 'Server error'
            })
        }
    },

    getSingle: async (req, res) => {
        try {
            const { id } = req.params

            const gallery = await galleryModel.getById(id)
            if (!gallery) {
                return res.status(404).json({
                    success: false,
                    message: 'Gallery not found'
                })
            }

            const host = req.get("host").split(":")[0]
            const BASE_URL = `${req.protocol}://${host}`

            gallery.gallery_image = gallery.gallery_image
                ? `${BASE_URL}/plant/uploaded_files/gallery/${gallery.gallery_image}`
                : `${BASE_URL}/plant/uploaded_files/no-image.png`

            return res.json(convertNulls({
                success: true,
                gallery
            }))

        } catch (err) {
            console.error(err)
            return res.status(500).json({
                success: false,
                message: 'Server error'
            })
        }
    }
}

module.exports = galleryController
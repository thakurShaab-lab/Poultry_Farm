const { pageModel } = require('../../model/cms/cms')
const { z } = require('zod')
const { convertNulls } = require('../../utils/convertNull')

const getPageByTitleSchema = z.object({
    title: z.string().min(1, "Title is required")
})

const pageController = {
    getAllPages: async (req, res) => {
        try {
            const pages = await pageModel.getAll()

            if(!pages.length){
                return res.status(201).json({success: false, message: 'Pages not found.'})
            }

            return res.status(200).json(convertNulls({
                success: true,
                data: pages
            }))
        } catch (err) {
            console.error(err)
            return res.status(201).json({
                success: false,
                message: "Server error"
            })
        }
    },

    getPageById: async (req, res) => {
        try {
            const pageId = Number(req.params.id)
            if (isNaN(pageId)) {
                return res.status(201).json({ success: false, message: "Invalid page ID" })
            }

            const page = await pageModel.getById(pageId)
            if (!page) {
                return res.status(201).json({ success: false, message: "Page not found" })
            }

            return res.status(201).json(convertNulls({ success: true, data: page }))
        } catch (err) {
            console.error(err)
            return res.status(201).json({ success: false, message: "Server error" })
        }
    },

    getPageByTitle: async (req, res) => {
        try {
            const { title } = req.query
            if (!title) {
                return res.status(201).json({
                    success: false,
                    message: "Title is required."
                })
            }

            const page = await pageModel.getByTitle(title)

            if (!page) {
                return res.status(201).json({
                    success: false,
                    message: `Page not found for title: ${title}`
                })
            }

            return res.status(201).json(convertNulls({
                success: true,
                data: page
            }))
        } catch (err) {
            console.error("GetPageByTitle Error:", err)
            return res.status(201).json({
                success: false,
                message: "Server error",
                error: err.message
            })
        }
    }
}

module.exports = { pageController }
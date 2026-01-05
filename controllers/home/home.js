const galleryModel = require('../../model/gallery/gallery')
const headerModel = require('../../model/banner/banner')
const faqModel = require('../../model/faq/faq')
const { convertNulls } = require('../../utils/convertNull')

const homeController = {
    getHomeData: async (req, res) => {
        try {
            const host = req.get("host").split(":")[0]
            const BASE_URL = `${req.protocol}://${host}`

            const headers = await headerModel.getActive()
            const headerData = headers.map(h => ({
                header_image: `${BASE_URL}/poultry_farming/uploaded_files/header_images/${h.header_image}`,
                header_url: h.header_url,
                // line_one: h.line_one,
                // line_two: h.line_two,
                // line_three: h.line_three,
                // line_four: h.line_four,
                // line_five: h.line_five
            }))

            const galleryData = await galleryModel.list({ page: 1, limit: 100 })
            const images = galleryData.data
                .filter(item => item.type === '1')
                .map(item => item.gallery_image 
                    ? `${BASE_URL}/poultry_farming/uploaded_files/gallery/${item.gallery_image}` 
                    : `${BASE_URL}/poultry_farming/uploaded_files/no-image.png`
                )

            const videos = galleryData.data
                .filter(item => item.type === '2') 
                .map(item => item.embed_code)

            const faqs = await faqModel.getAll()
            const faqData = faqs.map(f => ({
                faq_id: f.faq_id,
                question: f.faq_question,
                answer: f.faq_answer,
                faq_date_added: f.faq_date_added
            }))

            return res.status(201).json(convertNulls({
                success: true,
                data: {
                    headers: headerData,
                    image_gallery: images,
                    video_gallery: videos,
                    faqs: faqData
                }
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

module.exports = homeController

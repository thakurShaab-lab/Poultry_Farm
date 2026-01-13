const galleryModel = require('../../model/gallery/gallery')
const headerModel = require('../../model/banner/banner')
const pageModel = require('../../model/cms/cms')
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
            }))

            const galleryData = await galleryModel.list({ page: 1, limit: 100 })
            const images = galleryData.data
                .filter(item => item.type === '1')
                .map((item, index) => ({
                    id: item.gallery_id,
                    image_url: item.gallery_image
                        ? `${BASE_URL}/poultry_farming/uploaded_files/gallery/${item.gallery_image}`
                        : `${BASE_URL}/poultry_farming/uploaded_files/no-image.png`
                }))

            const videos = galleryData.data
                .filter(item => item.type === '2')
                .map((item, index) => ({
                    id: item.gallery_id,
                    video_url: item.embed_code,
                    video_thumb: item.gallery_image ? `${BASE_URL}/poultry_farming/uploaded_files/gallery/${item.gallery_image}`
                        : `${BASE_URL}/poultry_farming/uploaded_files/no-image.png`,
                }))

            const faqs = await faqModel.getAll()
            const faqData = faqs.map(f => ({
                faq_id: f.faq_id,
                question: f.faq_question,
                answer: f.faq_answer,
                faq_date_added: f.faq_date_added
            }))

            const aboutPage = await pageModel.getByTitle('About Us')

            const aboutUs = aboutPage ? {
                page_id: aboutPage.page_id,
                page_name: aboutPage.page_name,
                description: aboutPage.page_description,
                short_description: aboutPage.page_short_description,
                image: aboutPage.image
                    ? `${BASE_URL}/poultry_farming/uploaded_files/cms/${aboutPage.image}`
                    : `${BASE_URL}/poultry_farming/uploaded_files/no-image.png`,
                updated_date: aboutPage.page_updated_date
            } : ''

            const stats = await pageModel.getHomeStats()

            return res.status(201).json(convertNulls({
                success: true,
                data: {
                    headers: headerData,
                    about_us: aboutUs,
                    stats: {
                        completed: stats.completed,
                        satisfied_customers: stats.satisfied_customers,
                        success_rate: `${stats.success_rate}%`
                    },
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
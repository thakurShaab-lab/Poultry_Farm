const { db } = require("../../config/db")
const { eq, asc } = require("drizzle-orm")
const { wl_locations } = require("../../schema/location/location")

const locationModel = {

    getAll: async () => {
        return await db
            .select({
                location_id: wl_locations.location_id,
                location_name: wl_locations.location_name,
                friendly_url: wl_locations.friendly_url,
                location_url: wl_locations.location_url,
                location_image: wl_locations.location_image,
                sort_order: wl_locations.sort_order,
                status: wl_locations.status
            })
            .from(wl_locations)
            .where(eq(wl_locations.status, "1"))
            .orderBy(
                asc(wl_locations.sort_order),
                asc(wl_locations.location_name)
            )
    },

    getById: async (locationId) => {
        const result = await db
            .select({
                location_id: wl_locations.location_id,
                location_name: wl_locations.location_name,
                friendly_url: wl_locations.friendly_url,
                location_url: wl_locations.location_url,
                location_image: wl_locations.location_image,
                sort_order: wl_locations.sort_order,
                status: wl_locations.status
            })
            .from(wl_locations)
            .where(eq(wl_locations.location_id, locationId))
            .limit(1)

        return result[0] || null
    }
}

module.exports = locationModel
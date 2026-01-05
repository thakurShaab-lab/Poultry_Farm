const locationModel = require('../../model/location/location')
const { convertNulls } = require('../../utils/convertNull')

const locationController = {

    getLocations: async (req, res) => {
        try {
            const locations = await locationModel.getAll()

            if (!locations.length) {
                return res.status(201).json({ success: false, message: 'No location found.' })
            }

            return res.status(201).json(convertNulls({
                success: true,
                data: locations
            }))
        } catch (err) {
            console.error('GetLocations Error:', err)
            return res.status(500).json({
                success: false,
                message: 'Internal server error'
            })
        }
    },

    getLocationById: async (req, res) => {
        try {
            const locationId = Number(req.params.id)

            if (isNaN(locationId)) {
                return res.status(201).json({
                    success: false,
                    message: 'Invalid location id'
                })
            }

            const location = await locationModel.getById(locationId)

            if (!location) {
                return res.status(201).json({
                    success: false,
                    message: 'Location not found'
                })
            }

            return res.status(201).json(convertNulls({
                success: true,
                data: location
            }))
        } catch (err) {
            console.error('GetLocationById Error:', err)
            return res.status(500).json({
                success: false,
                message: 'Internal server error'
            })
        }
    }
}

module.exports = locationController
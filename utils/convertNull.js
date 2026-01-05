const convertNulls = (obj) => {
    if (Array.isArray(obj)) {
        return obj.map(convertNulls)
    }

    if (obj instanceof Date) {
        return obj.toISOString().slice(0, 19).replace('T', ' ')
    }

    if (obj !== null && typeof obj === 'object') {
        const newObj = {}
        for (const key in obj) {
            const value = obj[key]

            if (value === null || value === undefined) {
                newObj[key] = ""
            } else if (value instanceof Date) {
                newObj[key] = value
                    .toISOString()
                    .slice(0, 19)
                    .replace('T', ' ')
            } else if (typeof value === 'number') {
                newObj[key] = value.toString()
            } else {
                newObj[key] = value
            }
        }
        return newObj
    }

    return obj
}

module.exports = { convertNulls }

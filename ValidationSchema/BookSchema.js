const zod = require('zod')

const BookSchema = zod.object({
    authorName: zod.string().min(2),
    bookName: zod.string().min(2),
    bookPrice: zod.coerce.number(),
    bookPages: zod.coerce.number(),
    filePath: zod.string()
})


module.exports = BookSchema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    name: { type: 'String', required: true },
    title: { type: 'String', required: true },
    content: { type: 'String', required: true },
    slug: { type: 'String', required: true },
    cuid: { type: 'String', required: true },
    dateAdded: { type: 'Date', default: Date.now, required: true },
    images: [{ 
        url: { type: 'String', required: true },
        altText: { type: 'String' },
        caption: { type: 'String' }
    }],
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },

});

module.exports = mongoose.model('Post', postSchema);
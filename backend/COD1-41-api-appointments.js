/**
 * @deprecated Dùng COD1-41-book-appointment-api.js và COD1-42-view-appointments-api.js
 * Giữ file để tương thích cũ.
 */
const express = require('express');
const book = require('./COD1-41-book-appointment-api');
const view = require('./COD1-42-view-appointments-api');

const router = express.Router();
router.use(book);
router.use(view);

module.exports = router;

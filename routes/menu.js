/*
 * All routes for Customers are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    db.query(`SELECT * FROM menus;`)
      .then(data => {
        const menus = data.rows;
        res.render('menu', {menus: menus});
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  return router;
};

// GET request to load menu
// POST request to submit form with all added menu items and name/email/phone
  // triggers notification to owner that the order has been placed
// POST request to cancel form (either redirect or clear same page)



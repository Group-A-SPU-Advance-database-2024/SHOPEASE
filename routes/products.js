const express = require('express');
const router = express.Router();
const db = require('../server/db'); // Adjust path as per your folder structure

/**
 * @swagger
 * tags:
 *   name: Sales
 *   description: API endpoints for calculating sales
 */

/**
 * @swagger
 * /api/products/total-sales/{id}:
 *   get:
 *     summary: Calculate total sales for a specific product
 *     tags: [Sales]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the product to calculate total sales for
 *     responses:
 *       200:
 *         description: The total sales amount for the specified product
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total_sales:
 *                   type: number
 *                   format: float
 *       400:
 *         description: Bad Request. The ID parameter is invalid or missing.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid ID format or missing ID."
 *       404:
 *         description: Product not found. The product with the specified ID does not exist.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Product not found with the provided ID."
 *       500:
 *         description: Internal Server Error. An error occurred on the server while processing the request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "An unexpected error occurred. Please try again later."
 */


// Example route
router.get('/total-sales/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
      const result = await db.query('SELECT calculate_total_sales_by_product($1) AS total_sales', [id]);
      if (result.rows.length > 0) {
          res.json({ total_sales: result.rows[0].total_sales });
      } else {
          res.status(404).json({ message: 'Product not found' });
      }
  } catch (err) {
      console.error('Error calculating total sales', err);
      res.status(500).json({ message: 'Internal Server Error' });
  }
});



/**
 * @swagger
 * tags:
 *   name: Products
 *   description: API endpoints for managing products
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: A list of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   product_id:
 *                     type: integer
 *                   product_name:
 *                     type: string
 *                   cost:
 *                     type: number
 *                     format: float
 *                   quantity:
 *                     type: integer
 *                   added_date:
 *                     type: string
 *                     format: date-time
 */
router.get('/', async (req, res) => {
  let limit = parseInt(req.query.limit, 10) || 10000; // Default limit set to 10000
  const offset = parseInt(req.query.offset, 10) || 0;

  // Ensure the limit does not exceed 10,000
  if (limit > 10000) {
    limit = 10000;
  }

  try {
    const { rows } = await db.query('SELECT * FROM products ORDER BY product_id LIMIT $1 OFFSET $2', [limit, offset]);
    res.json(rows);
  } catch (err) {
    console.error('Error getting products', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get a specific product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the product to retrieve
 *     responses:
 *       200:
 *         description: A product object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 product_id:
 *                   type: integer
 *                 product_name:
 *                   type: string
 *                 cost:
 *                   type: number
 *                   format: float
 *                 quantity:
 *                   type: integer
 *                 added_date:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Product not found
 */
router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const { rows } = await db.query('SELECT * FROM products WHERE product_id = $1', [id]);
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (err) {
    console.error('Error getting product', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Add a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product_name:
 *                 type: string
 *               cost:
 *                 type: number
 *                 format: float
 *               quantity:
 *                 type: integer
 *     responses:
 *       201:
 *         description: The created product
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 product_id:
 *                   type: integer
 *                 product_name:
 *                   type: string
 *                 cost:
 *                   type: number
 *                   format: float
 *                 quantity:
 *                   type: integer
 *                 added_date:
 *                   type: string
 *                   format: date-time
 */
router.post('/', async (req, res) => {
  const { product_name, cost, quantity } = req.body;
  try {
    const { rows } = await db.query(
      'INSERT INTO products (product_name, cost, quantity, added_date) VALUES ($1, $2, $3, NOW()) RETURNING *', 
      [product_name, cost, quantity]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Error adding product', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update an existing product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the product to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product_name:
 *                 type: string
 *               cost:
 *                 type: number
 *                 format: float
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: The updated product
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 product_id:
 *                   type: integer
 *                 product_name:
 *                   type: string
 *                 cost:
 *                   type: number
 *                   format: float
 *                 quantity:
 *                   type: integer
 *                 added_date:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Product not found
 */
router.put('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { product_name, cost, quantity } = req.body;
  try {
    const { rows } = await db.query('UPDATE products SET product_name = $1, cost = $2, quantity = $3, added_time = NOW() WHERE product_id = $4 RETURNING *;', [product_name, cost, quantity, id]);
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (err) {
    console.error('Error updating product', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the product to delete
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product deleted successfully
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product not found
 */

router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const { rowCount } = await db.query('DELETE FROM products WHERE product_id = $1', [id]);
    if (rowCount > 0) {
      res.status(200).json({ message: 'Product deleted successfully' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (err) {
    console.error('Error deleting product', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;

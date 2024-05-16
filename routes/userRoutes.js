const express = require("express");

const authController = require("../controller/authController");
const router = express.Router();

/**
 * @openapi
 * components:
 *  securitySchemes:
 *    BearerAuth:
 *      type: http
 *      scheme: bearer
 *  
 */

/**
 * @openapi
 * '/users':
 *  post:
 *    tags:
 *    - User Routes
 *    summary: Create a user
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - name
 *              - email
 *              - password
 *            properties:
 *              name:
 *                type: string
 *                default: testuser
 *              email:
 *                type: string
 *                default: testemail
 *              password:
 *                type: string
 *                default: testpassword
 *    responses:
 *      201:
 *        description: Created
 *      400:
 *        description: Bad request
 *      409:
 *        description: Conflict
 *      404:
 *         description: Not found
 */
router.post("/", authController.signup);

module.exports = router;

const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Product Management API",
      description:
        "API endpoints for a simple e-commerce application using Node.js and Express.js. Use the User Route to generate a JWT token. Enter the token by pressing the Authorize button.",
      contact: {
        name: "Muhammad Abdullah",
        email: "muhammad.abdullah02@outlook.com",
        url: "https://github.com/mabdullah412/product-management-api",
      },
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:3000/",
        description: "Local server",
      },
      {
        url: "https://product-management-api-psi.vercel.app",
        description: "Live server deployed at Vercel",
      },
    ],
  },
  // looks for configuration in specified directories
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app, port) {
  // Swagger Page
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Documentation in JSON format
  app.get("/docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
}

module.exports = swaggerDocs;

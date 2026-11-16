# Tasty Bites Restaurant API

A RESTful Express.js API for managing the Tasty Bites restaurant menu. This project uses the assignment's supplied sample menu data and implements all five CRUD endpoints, request logging, input validation, consistent errors, and an importable Postman collection.

## Requirements
- Node.js 18 or newer
- npm
- Postman (for API testing and publishing public documentation)

## Setup and run
```bash
npm install
npm start
```
The API runs at `http://localhost:3000` by default. To use another port, set the `PORT` environment variable.

For automatic restart during development:
```bash
npm run dev
```

## Project structure
```text
tasty-bites-api/
├── server.js
├── package.json
├── README.md
├── .gitignore
├── logs/
│   └── .gitkeep
├── postman/
│   └── Tasty-Bites-API.postman_collection.json
└── src/
    ├── data/
    │   └── menuItems.js
    ├── middleware/
    │   ├── errorHandler.js
    │   ├── menuValidation.js
    │   └── requestLogger.js
    └── routes/
        └── menuRoutes.js
```

## API endpoints

Base URL: `http://localhost:3000`

| Method | Endpoint | Description | Success |
|---|---|---|---|
| GET | `/api/menu` | Retrieve all menu items | 200 |
| GET | `/api/menu/:id` | Retrieve one menu item | 200 |
| POST | `/api/menu` | Create a menu item | 201 |
| PUT | `/api/menu/:id` | Update an existing menu item | 200 |
| DELETE | `/api/menu/:id` | Delete a menu item | 200 |

### Menu item request body
```json
{
  "name": "Garden Salad",
  "description": "Fresh mixed greens with tomatoes and house dressing",
  "price": 9.5,
  "category": "appetizer",
  "ingredients": ["mixed greens", "tomatoes", "house dressing"],
  "available": true
}
```

`available` is optional and defaults to `true`. All other fields are required for POST and PUT.

## Validation rules
- `name`: required string, at least 3 characters
- `description`: required string, at least 10 characters
- `price`: required numeric value greater than 0
- `category`: `appetizer`, `entree`, `dessert`, or `beverage`
- `ingredients`: required array containing at least one non-empty string
- `available`: optional boolean; defaults to `true`

Validation errors return HTTP 400 with a consistent JSON response containing an `errors` array.

## Middleware
1. **Request logger** runs for every request. It records the timestamp, HTTP method, URL, and POST/PUT body in the terminal and appends JSON lines to `logs/requests.log`.
2. **Menu validation** runs on POST and PUT requests using `express-validator`. It rejects invalid data before the route changes the menu.
3. **Error handler** provides a consistent JSON response for unexpected errors.

## Example requests
```bash
# List all menu items
curl http://localhost:3000/api/menu

# Get menu item 1
curl http://localhost:3000/api/menu/1

# Create a menu item
curl -X POST http://localhost:3000/api/menu \
  -H "Content-Type: application/json" \
  -d '{"name":"Garden Salad","description":"Fresh mixed greens with tomatoes and house dressing","price":9.5,"category":"appetizer","ingredients":["mixed greens","tomatoes","house dressing"]}'

# Update menu item 1 (PUT requires all menu fields)
curl -X PUT http://localhost:3000/api/menu/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Classic Burger","description":"Beef patty with lettuce, tomato, and cheese on a sesame seed bun","price":13.5,"category":"entree","ingredients":["beef","lettuce","tomato","cheese","bun"],"available":true}'

# Delete menu item 1
curl -X DELETE http://localhost:3000/api/menu/1
```

## Test with Postman
1. Start the server with `npm start`.
2. In Postman, select **Import** and choose `postman/Tasty-Bites-API.postman_collection.json`.
3. The collection uses the `baseUrl` variable, initially set to `http://localhost:3000`.
4. Send each request. The collection includes request descriptions, example bodies, and basic status-code tests.
5. Save real response examples: open a request's response menu and choose **Save as example**. Save successful and error responses with clear names (for example, `Successful GET - All menu items`, `Error 400 - Invalid menu item`, and `Error 404 - Menu item not found`).
6. Open the collection's **View documentation** page and choose **Publish**. Follow Postman's prompts to publish the documentation publicly.
7. Copy the resulting public documentation URL into your assignment submission. A public URL cannot be generated from this project folder; it must be published from your Postman account.

## Important notes
- This starter implementation stores data in memory. Menu changes are lost when the server restarts; a database is outside this assignment's stated requirements.
- The request log is written locally to `logs/requests.log`. Do not commit logs containing real customer or sensitive data.
- This assignment API has no authentication. Do not expose it publicly with real restaurant data without adding authentication, authorization, HTTPS, and production security controls.

## Submission checklist
- [ ] All five CRUD endpoints work in Postman.
- [ ] Request logging runs for every endpoint.
- [ ] POST and PUT reject invalid data with HTTP 400.
- [ ] Missing menu items return HTTP 404.
- [ ] Successful GET/PUT/DELETE return HTTP 200; successful POST returns HTTP 201.
- [ ] Postman response examples are saved.
- [ ] Postman documentation is published and its public URL is submitted.

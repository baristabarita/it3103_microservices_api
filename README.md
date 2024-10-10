# IT3103: Designing and Building a Microservices API 

  

Created by:

- Shane Louis Barita

- Lyan Ethan Jover

  

## API Structure Overview
  
### Microservices 

1. Product Service

-  **POST /addProducts**: Add a new product.

-  **GET /products/view/:productId**: Get product details by ID.

-  **GET /products/allProducts**: Gets details of all existing products.

-  **PUT /products/:productId**: Update a product.

-  **DELETE /products/:productId**: Delete a product.

  

2. User Service

-  **POST /users/register**: registers a new user.

-  **POST /users/login**: logins an existing user.

-  **POST /users/addUser**: Add a new User (admin only).

-  **GET /users/:userId**: Gets user details by ID.

-  **PUT /users/:userId**: Update user information.

-  **DELETE /users/:userId**: Delete a user.

  

3. Order Service

-  **POST /orders/addOrder**: Creates a new order. This service will:

   a. Verify that the customer exists by communicating with the Customer Service.

   b. Verify that the product exists by communicating with the Product Service.

   c. Create the order only if the customer and product are valid.

-  **GET /orders/:orderId**: Get order details by order ID.

-  **GET /orders/allOrders/view**: Gets all existing order details.

-  **PUT /orders/:orderId**: Update an order.

-  **DELETE /orders/:orderId**: Delete an order.

### Middlewares
1. `authMiddleware.js` - Contains authenticateToken functionality.
2. `rateLimiterMiddleware.js` - Performs request rate limiting  functionality.
1. `roleAccessMiddleware.js` - Contains Role Based Accessing Control functionality.
1. `sanitizeMiddleware.js` - Contains sanitization and various input validation functionalities for the microservices.



## Installation and Running the API

1. Clone the project in your local directory of choice. Example using the git CLI:

```
git clone https://github.com/baristabarita/it3103_microservices_api.git
```

2. CD into the root folder

```
cd it3103_microservices_api
```


3. Install node modules dependencies

```
npm install
```

4. Create a .env file and place these credentials:
```
#JWT Secret Key
ACCESS_TOKEN_SECRET=lBr2q60PQKnzdthiesT5iQE4vWvOAp9hr3TwkTcF9D8=

# HTTPS Configuration
SSL_KEY_PATH=../ssl/server.key
SSL_CERT_PATH=../ssl/server.cert

# PORTS
GATEWAY_PORT=3000
```


5. Go into the directories of each API service and run them in different terminals

```
cd product-service
node product_service.js
```

```
cd customer-service
node customer_service.js
```

```
cd order-service
order_service.js
```

All services will run independently.
To run the API gateway, simply type:

```
node api_gateway.js
```

Take note that the API gateway runs on port 3000.

# Testing

Test user inputs can be found in the ```test_input.json``` file. Postman is used for testing the API functionalities.
  

1. Make a user registration test. Here is an example:

```
{
"name": "John Doe",
"email": "john.doe@example.com",
"role": "admin",
"password": "password123"
}
```

The user information above is for a user with administrative roles. 
For customers, simply make another with a ```role``` value set to ```customer```

2. Login using POST method with ```/login``` endpoint
- Endpoint Example:
```
https://localhost:3000/users/login
```
3. A JWT token should appear under ```token``` value. Copy it.

4. In Postman > Headers (right before the Body Tab) , add a row. It should look like this:

| Key | Value | Description |
|--|--|-- |
| Authorization | Bearer <place_token_here> |  |

Copy the token value from the login response and paste it next to the ```Bearer``` in the Value Column.


5. Go back to the Body tab, make a JSON data of the product. Send a POST request to Add Product. The product should be successfully added! Here is an example:

```
{
"name": "Downy!",
"description": "Very fragnant!"
"price": 10.00
}
```

6. Repeat Step 1, but make a new user with ```"role" : "customer"``` this time.

7. Ensure role-based access is applied by making an ```addProduct``` request. This should give you an unauthorized message or 403.

8. When making an order request, you only need the following field (example):

```
{
"userId" : <userId>
"productId" : <productId>
}
```

Make sure that you remember the userId and productId you wish to put in the order. 
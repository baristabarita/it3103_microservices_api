# IT3103: Designing and Building a Microservices API [TO BE UPDATED]

Created by:
  - Shane Louis Barita
  - Lyan Ethan Jover

## API Structure Overview

1. Product Service
   - **POST /products**: Add a new product.
   - **GET /products/:productId**: Get product details by ID.
   - **PUT /products/:productId**: Update a product.
   - **DELETE /products/:productId**: Delete a product.

2. Customer Service
   - **POST /customers**: Add a new customer.
   - **GET /customers/:customerId**: Get customer details by ID.
   - **PUT /customers/:customerId**: Update customer information.
   - **DELETE /customers/:customerId**: Delete a customer.

3. Order Service
   - **POST /orders**: Creates a new order. This service will:
       a. Verify that the customer exists by communicating with the Customer Service.
       b. Verify that the product exists by communicating with the Product Service.
       c. Create the order only if the customer and product are valid.
   - **GET /orders/:orderId**: Get order details.
   - **PUT /orders/:orderId**: Update an order.
   - **DELETE /orders/:orderId**: Delete an order.

## Installation and Running the API
1. Clone the project in your local directory of choice. Example using the git CLI:
```
git clone https://github.com/baristabarita/it3103_exercise3.git
```

2. CD into the root folder
```
cd it3103_exercise3
```

3. Install node modules dependencies 
```
npm install
```

4. Run each API service in different terminals
```
node product_service
```
```
node customer_service
```
```
node order_service
```
# Testing
Test user inputs can be found in the ```test_input.json``` file. Postman is used for testing the API functionalities. 
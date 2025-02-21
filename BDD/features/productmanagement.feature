Feature: Product Management
  As a system user
  I want to create and retrieve products
  So that I can manage product information

  Scenario: Create a new product
    Given I have a valid product payload
    When I send a POST request to "/products"
    Then I receive a response with status code 201
    And the response contains a product ID

  Scenario: Retrieve the created product
    Given a product has been created
    When I send a GET request to "/products/{productId}"
    Then I receive a response with status code 200
    And the product details match the created product

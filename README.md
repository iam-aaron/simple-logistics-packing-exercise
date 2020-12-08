# simple-logistics-packing-exercise
This mini project is the output from my technical interview homework in one of my job application.
PS. I have no prior experience in using Typescript, so this also serves as my Typescript practice exercise.

### The Stack
* [NodeJS] v15.3.0
* [npm] 7.0.14
* [Typescript] Version 4.1.2

### How to run this program
* install node (and npm which is installed together with it)
* Open a terminal
* Install typescript.
```
sudo npm install -g typescript
```
* Set-up npm packages.
```
npm init
```
* Install server
```
npm install --save-dev lite-server
```
* Start server
```
npm start
```
* Open another terminal
* Run Typescript watchmode
```
run tsc -w
```
* Visit http://localhost:<assignedport>/helloworld.html
open developer tools -> console, you should see "HELLO WORLD FROM TYPESCRIPT" if you were able to make things work properly.
  
### The Problem
We are asked to implement an order packing solution. We basically have three (3) parameters, templates for the input and output are predefined.
* PRODUCT -  contains product ID and products may vary on sizes.
* ORDER - it is made up of a list of products.
* CONTAINERS - box options, this is where we will fit the products for a specific order, boxes also very on sizes.

The output will be the SHIPMENT RECORD.

#### SAMPLE INPUT Order Request 
```
{
    id: "ORDER-001",
    products: [
        {
            id: "PRODUCT-001",
            name: "TEST PRODUCT 1",
            orderedQuantity: 10,
            unitPrice: 13.4,
            dimensions: {
                unit: "centimeter",
                length: 10,
                width: 10,
                height: 30,
            },
        },
        {
            id: "PRODUCT-002",
            name: "TEST PRODUCT 2",
            orderedQuantity: 11,
            unitPrice: 13.4,
            dimensions: {
                unit: "centimeter",
                length: 10,
                width: 20,
                height: 20,
            },
        },
    ],
}
```
#### SAMPLE INPUT Container 
Will try to improve the documentation later.
```
[
    {
      containerType: "Cardboard A",
      dimensions: {
        unit: "centimeter",
        length: 30,
        width: 30,
        height: 30,
      },
    },
    {
      containerType: "Cardboard B",
      dimensions: {
        unit: "centimeter",
        length: 10,
        width: 20,
        height: 20,
      }, 
    },
  ]
```
#### SAMPLE OUTPUT Shipment Record
```
{
  "orderId": "ORDER-001",
  "totalVolume": {
    "unit": "cubic centimeter",
    "value": 74000
  },
  "containers": [
    {
      "containerType": "Cardboard A",
      "containingProducts": [
        {
          "id": "PRODUCT-001",
          "quantity": 9
        }
      ]
    },
    {
      "containerType": "Cardboard B",
      "containingProducts": [
        {
          "id": "PRODUCT-001",
          "quantity": 1
        }
      ]
    },
    {
      "containerType": "Cardboard A",
      "containingProducts": [
        {
          "id": "PRODUCT-002",
          "quantity": 6
        }
      ]
    },
    {
      "containerType": "Cardboard A",
      "containingProducts": [
        {
          "id": "PRODUCT-002",
          "quantity": 5
        }
      ]
    }
  ]
}
```

#### Requirements
* Must follow the templates provided.
* Sorting is volume-based, must not exceed the capacity of the container. Optimization of the total volume of containers like choosing the "best box" or changing the orientation of the products are not yet required.
* Should be easy to maintain and flexible for new use cases.
* Must observe clean code and and practice good design principles (ie SOLID, and good use of OOP and GoF design patterns is a plus).

### Features Implemented
* Error Handling for items that can't fit any box.
* Error Handling for mismatch unit of measure
* Slight packing optimization (see SAMPLE OUTPUT Shipment Record), will group to max number of items that it will fit box container, and select the most appropriate box for the remainder items.


### Notes
* User interface is not yet available since it is not yet required for the homework.
* File structure needs to be improved.
* Codes are not yet optimized.
* Implement advanced sorting like changing the orientation of boxes.
* Checker if items can fit the box using dimensions L x W x H.




page 1 

list of cities
http://localhost:5000/locations(GET)

list of resturants
http://localhost:5000/resturant(GET)

list of Quicksearchs
http://localhost:5000/quickSearch(GET)

resturant wrt city
http://localhost:5000/resturant?stateId=1


--------------------------------------
page 2

list of resturants wrt Meal
http://localhost:5000/resturant?mealId=1

list of resturants wrt cousins and meals
http://localhost:5000/filter/1?cuisineId=2

list of resturants wrt costs and meals
http://localhost:5000/filter/1?lcost=800&hcost=1000

sort on basis of cost
http://localhost:5000/filter/1?cost=-1

-------------------------------------

page 3

Details of resturants
http://localhost:5000/details/1

Menu of a resturant
http://localhost:5000/menu/1

--------------------------------------

page 4

Menu details(POST)
http://localhost:5000/menuItem

Placeorder(POST)
http://localhost:5000/placeorder


--------------------------------

page 5

List of orders
http://localhost:5000/orders

List of orders wrt emailid
http://localhost:5000/orders?email=jack@gmail.com

update the payment details.(PUT)
http://localhost:5000/updateOrders/1

{
    "status" : "sucess",
    "bank_name":"SBI",
    "date":"23/03/2023"
}

delete the orders.(DELETE)
http://localhost:5000/deleteOrders/641c4d08d924099ce01c0bcf




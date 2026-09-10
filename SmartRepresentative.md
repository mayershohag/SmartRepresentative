**Project Name: Smart Representative**



This is a B2B Project called Smart Representative. Which is solve the real world problem. A Distributor can buy products from different companies and the products delivered to shopkeeper by the Delivery Man. A shopkeeper will have an account and the shopkeeper orders different products from different distributors. If the distributor have their necessary products. shopkeepers will see the stock of the products. then how much he needs to collect from the distributors.



**Core Features:**

1\. A Shopkeeper can order products from distributors easily by their mobile app.

2\. Distributor can see total orders today, which shop ordered the distributors products. The delivery man also can see the orders for deliver products a day later.

3\. Distributor can see his total pricing cost, total products, total expenses, total delivery etc. All expenses tracked by the app.

4\. Distributor can play with products like, create, read, delete, update products.

5\. A Distributor can add companies by adding their names.

6\. Shopkeeper also tracked expenses by the app.

7\. For the reason Sales Representative works could be decrease.



**RBAC - Role Based Access Control:**

1. Distributor:
Distributor can order The products from the companies. A distributor can collaborate multiple companies. distributor has some menu's in the sidebar. Which is Dashboard, Companies, Products, Store, Stock, Expense etc.
2. Delivery Man:
Delivery Man can see todays order which need to delivery to the shopkeeper and also can see the routes, shop location, etc.
3. Shopkeeper:
Shopkeeper will See the products, which is needs to orders, company, expense, etc.
4. Super Admin:
Super Admin will have super power to play with customization, a super admin can create, delete, update, read the products and also see the total companies, distributors, deliveryman, shops. also have permission, like a distributor create an account. The distributor account is inactive when super admin make it active then distributor can access all content.



**Frontend Workflow:**

The site visitor firstly see the Role Selection Page, after choosing user role then comes to the login page, the login page are same for every role but request APIs are different. In the login page also have their role based register button for signing up.



alright, after successfully login the user visit their dashboard content, no others role can be accessible for selected role. assume I'm a distributor I can see the sidebar content like, dashboard, companies, products, store, stock, expense etc. But others role content will can't see role content. just like all role are working.



***complete task:***

1. I have created RoleSelectionPage for the front of view for the user.
2. then I have created register form page for distributor role.
3. Login form page are created for all users role. 



***pending task:***

1. A deliveryman register form page need to access all distributor and companies routes.
2. A shopkeeper register form page.
3. A Super Admin register form page.
4. 



**Backend Workflow:**



***complete task:***

1. I'm done, Distributors APIs are ready to serve. Now, accessible user can access distributor and do CRUD. 



***pending task:***

1. frontend needs distributor, shopkeeper, deliveryman APIs ready.





**Problems:** need to resolve deliveryman and delivery issues












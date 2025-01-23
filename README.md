1. User Management
User Registration:
Users can register with their name, email, password, and role (user by default). Passwords are securely hashed before storage.
User Login:
Users can log in with their email and password to receive a JWT token for accessing protected APIs.
2. Role-Based Access Control
Roles:

Admin: Can create, edit, delete blogs, and assign blogs to editors.
Editor: Can edit blogs assigned to them.
User: Can view blogs and comments, and delete their own comments.
APIs enforce strict role-based permissions to ensure data integrity and security.

3. Blog Management
Admins can create, edit, and delete blogs.
Editors can only edit blogs assigned to them by an Admin.
Blogs have the following attributes:
title (required)
content (required)
4. Comment Management
Users can add comments to any blog.
Users can delete only their own comments.
5. Authentication
Secure JWT-based authentication ensures only authorized users can access protected routes.
API Endpoints
User Management
Method	Endpoint	Description	Access
POST	/register	Register a new user	Public
POST	/login	Log in to get a JWT token	Public
GET	/users	View all registered users	Admin Only
Blog Management
Method	Endpoint	Description	Access
GET	/blogs-view	View all blogs	Authenticated
POST	/blogs	Create a new blog	Admin Only
PUT	/blogs/:id	Update a blog	Admin/Assigned Editor
DELETE	/blogs/:id	Delete a blog	Admin Only
Comment Management
Method	Endpoint	Description	Access
GET	/comments/:id	View all comments for a specific blog	Authenticated
POST	/comment-blog/:id	Add a comment to a specific blog	Authenticated
DELETE	/comments/:id	Delete a comment (if owned by the user)	Comment Owner
Setup and Installation
Prerequisites
Node.js (v14 or later)
SQLite3 (or any compatible SQLite database)
Installation
Clone the repository:

bash
Copy
Edit
git clone <repository-url>
cd blog-management-system
Install dependencies:

bash
Copy
Edit
npm install
Set up the database:

Create an SQLite database file named blog.db.
Run migrations to create users, blogs, and comments tables.
Start the server:

bash
Copy
Edit
node app.js
Access the API at http://localhost:3000.

Environment Variables
Use a .env file to store sensitive information such as:

env
Copy
Edit
PORT=3000
JWT_SECRET=YOUR_SECRET_KEY
DB_PATH=blog.db
Database Schema
Users Table
Column	Type	Description
id	INTEGER	Unique user ID
name	TEXT	Full name
email	TEXT	Email address (unique)
password	TEXT	Hashed password
role	TEXT	Role (admin, editor, user)
Blogs Table
Column	Type	Description
id	INTEGER	Unique blog ID
title	TEXT	Blog title
content	TEXT	Blog content
editor_id	INTEGER	ID of the assigned editor
Comments Table
Column	Type	Description
id	INTEGER	Unique comment ID
blog_id	INTEGER	Blog associated with the comment
user_id	INTEGER	User who posted the comment
content	TEXT	Comment content

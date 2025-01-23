-- SQLite
-- Users Table
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT CHECK(role IN ('admin', 'editor', 'user')) NOT NULL
);

-- Blogs Table
CREATE TABLE blogs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    editor_id INTEGER,
    FOREIGN KEY (editor_id) REFERENCES users(id)
);

-- Comments Table
CREATE TABLE comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    blog_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    FOREIGN KEY (blog_id) REFERENCES blogs(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

INSERT INTO users (id, name, email, password, role) VALUES
(1, 'Admin User', 'admin@example.com', 'hashedpassword1', 'admin'),
(2, 'Editor One', 'editor1@example.com', 'hashedpassword2', 'editor'),
(3, 'Editor Two', 'editor2@example.com', 'hashedpassword3', 'editor'),
(4, 'User One', 'user1@example.com', 'hashedpassword4', 'user'),
(5, 'User Two', 'user2@example.com', 'hashedpassword5', 'user');

INSERT INTO blogs (id, title, content, editor_id) VALUES
(1, 'Blog Post 1', 'Content for blog post 1', 4),
(2, 'Blog Post 2', 'Content for blog post 2', 1),
(3, 'Blog Post 3', 'Content for blog post 3', 2), -- Assigned to Editor One
(4, 'Blog Post 4', 'Content for blog post 4', 3); -- Assigned to Editor Two

INSERT INTO comments (id, blog_id, user_id, content) VALUES
(1, 1, 4, 'This is a comment from User One on Blog Post 1'),
(2, 1, 5, 'Another comment from User Two on Blog Post 1'),
(3, 2, 4, 'User One commenting on Blog Post 2'),
(4, 3, 5, 'User Two commenting on Blog Post 3');

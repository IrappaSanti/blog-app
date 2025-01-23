const express = require('express');
const app = express();
const { open } = require('sqlite');
const sqlite3 = require('sqlite3');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const dbPath = path.join(__dirname, "blog.db");
let db = null;

const initializeServerWithDatabase = async () => {
    try {
        db = await open({
            filename: dbPath,
            driver: sqlite3.Database,
        });
        app.listen(3000, () => {
            console.log('Server started at http://localhost:3000');
        });
    } catch (error) {
        console.error(`DB Error: ${error.message}`);
        process.exit(1);
    }
};

initializeServerWithDatabase();

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (token) {
        const jwtToken = token.split(" ")[1];
        jwt.verify(jwtToken, "MY_SECRET_KEY", (error, payload) => {
            if (error) {
                res.status(403).send("Invalid JWT Token");
            } else {
                req.email = payload.email;
                next();
            }
        });
    } else {
        res.status(401).send("Authorization token required");
    }
};

app.use(express.json());

// User registration
app.post('/register', async (req, res) => {
    const { id, name, email, password, role = "user" } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const query = `
            INSERT INTO users (id, name, email, password, role) 
            VALUES (?, ?, ?, ?, ?);
        `;
        await db.run(query, [id, name, email, hashedPassword, role]);
        res.send("User registered successfully");
    } catch (error) {
        res.status(500).send(`Error: ${error.message}`);
    }
});

// User login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await db.get("SELECT * FROM users WHERE email = ?", [email]);
        if (!user) {
            res.status(400).send("Invalid email");
        } else {
            const isValidPassword = await bcrypt.compare(password, user.password);
            if (isValidPassword) {
                const token = jwt.sign({ email: user.email, role: user.role }, "MY_SECRET_KEY");
                res.send({ jwt_token: token });
            } else {
                res.status(400).send("Invalid password");
            }
        }
    } catch (error) {
        res.status(500).send(`Error: ${error.message}`);
    }
});


app.get('/users',authenticateToken,async(req,res)=>{
    const query=`select * from users;`
    const ans = await db.all(query)
    res.send(ans)
})

app.get('/blogs-view',authenticateToken,async(req,res)=>{
    const query=`select * from blogs;`
    const ans = await db.all(query)
    res.send(ans)
})

app.post('/blogs',authenticateToken,async(req,res)=>{
    const {title, content, editor_id}=req.body
    const {email}=req
    const q=`select * from users where email=?;`
    const userObj= await db.get(q,[`${email}`]);
    const role=userObj.role
    if (role==="admin"){
        const query=`insert into blogs (title, content, editor_id) values (?, ?, ?);`
        await db.run(query,[title, content, editor_id])
        res.send('Blog created Successfully')
    }
    else{
        res.send("Admin Only can post blogs");
    }
})

app.put('/blogs/:id',authenticateToken,async(req,res)=>{
    const {id}=req.params
    const queryBlog=`select * from blogs where id=${id};`
    const blogDetail=await db.get(queryBlog)
    const blogEditorId=blogDetail.editor_id
    const {title, content, editor_id}=req.body
    const {email}=req
    const q=`select * from users where email=?;`
    const userObj= await db.get(q,[`${email}`]);
    const role=userObj.role
    const userId=userObj.id
    if (role==="admin" || userId===blogEditorId){
        const query=`update blogs set title=?, content=?,editor_id=? where id=?;`
        await db.run(query,[title, content, editor_id,id])
        res.send('Blog updated Successfully')
    }
    else{
        res.send("Admin Only can post blogs");
    }
})

app.delete('/blogs/:id',authenticateToken,async(req,res)=>{
    const {id}=req.params
    const {email}=req
    const q=`select * from users where email=?;`
    const userObj= await db.get(q,[`${email}`]);
    const role=userObj.role
    if (role==="admin"){
        const query=`delete from blogs where id=?;`
        await db.run(query,[id])
        res.send('Blog deleted Successfully')
    }
    else{
        res.send("Admin Only can post blogs");
    }
})

app.get('/comments/:id',authenticateToken,async(req,res)=>{
    const {id}=req.params
    const query=`select * from comments where blog_id=?;`
    const ans = await db.all(query,[id])
    res.send(ans)
})

app.post('/comment-blog/:id',authenticateToken,async(req,res)=>{
    const {id}=req.params
    const {content}=req.body
    const {email}=req
    const q=`select * from users where email=?;`
    const userObj= await db.get(q,[`${email}`]);
    const userId=userObj.id
    try{
        const query=`insert into comments (blog_id,user_id, content) values (?, ?, ?);`
        await db.run(query,[id, userId, content])
        res.send('Comment created to blog')
    }
    catch(e){
        res.send(`DB ERROR: ${e.message}`)
    }
})

app.delete('/comments/:id',authenticateToken,async(req,res)=>{
    const {id}=req.params
    const q=`delete from comments where id=?;`
    await db.run(q,[id])
    res.send("Comment Deleted")
})
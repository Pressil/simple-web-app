const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'april_castillio',
    password: 'April@2025',
    database: 'my_databases',
});

connection.connect(err => {
    if (err) throw err;
    console.log('Connected to MySQL Server!');
});

// Kani na GET request, dle nani need kay para rani sa Website Design

app.get('/app.js',(req, res) => {
    res.setHeader('Content-Type', 'text/javascript');
    res.sendFile(path.join(__dirname, 'app.js'));
});

app.get('/style.css',(req, res) => {
    res.setHeader('Content-Type', 'text/css');
    res.sendFile(path.join(__dirname, 'style.css'));
});



// Submission 1: GET request to fetch all users
app.get('/api/users', (req, res) => {
    connection.query('SELECT * FROM users', (err, results) => {
        if (err) {
            console.error('Failed to get users', err);
            res.status(500).send('Error fetching users');
            return;
        }

const users = results.map(row => ({
    id: row.id,
    name: row.name,
    email: row.email,
    age: row.age
}));

res.json(users);
    });
});


// Submission 2: POST request to add a single user
app.post('/api/users', (req, res) => {
    const { name, email, age } = req.body;
    const user = { name, email, age };
    if (!name || !email || !age) {
        return res.status(400).json({error:"Name, email, and age are required"});
    }
connection.query('INSERT INTO users SET ?', user, (err, result) => {
        if (err) {
            console.error('Error executing the database query', err);
            res.status(500).send('Error adding user');
            return;
        }
        
const insertedUser = { 
    id: result.insertId,
    name: user.name,
    email: user.email,
    age: user.age
};
res.send(insertedUser);
});
});

// Submission 3: PUT request to update a single user based on an ID
app.put('/api/users/:id', (req, res) => {
    const {name, email, age} = req.body;
    const { id } = req.params;
    if (!name || !email || !age) {
        return res.status(400).json({error:"Name, email, and age are required"});
    }

connection.query('UPDATE users SET name = ?, email = ?, age = ? WHERE id = ?', [name, email, age, id], (err, result) => {
        if (err) {
            console.error('Error executing the database query', err);
            res.status(500).send('Error updating user');
            return;
        }

if (result.affectedRows === 0) {
    return res.status(404).json({error: 'User not found'});
}

res.json({id, name, email, age});
});
});

// Submission 4: DELETE request to delete a single user based on the User ID
app.delete('/api/users/:id', (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM users WHERE id = ?', id, (err, result) => {
        if (err) {
            console.error('Error executing the database query', err);
            res.status(500).send('Error deleting user');
        }

if (result.affectedRows === 0) {
    return res.status(404).json({error: 'User not found'});
}

res.json({id});
});
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server start on port ${port}`);
});

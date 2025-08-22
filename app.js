document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/users')
        .then(response => response.json())
        .then(users => {
            updateTable(users);
        });

    const addForm = document.querySelector('form#add-user-form');
    const updateForm = document.querySelector('form#update-form');
    const deleteForm = document.querySelector('form#delete-form');

    addForm.addEventListener('submit', (event) => {
        alert("Add form");
        event.preventDefault();
        addUser();
        addForm.reset();
    });

    updateForm.addEventListener('submit', (event) => {
        alert("Update form");
        event.preventDefault();
        const id = updateForm.elements['id'].value;
        const name = updateForm.elements['name'].value;
        const email = updateForm.elements['email'].value;
        const age = updateForm.elements['age'].value;
        updateUser(id, name, email, age);
        updateForm.reset();
    });

    deleteForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const id = deleteForm.elements['id'].value;
        deleteUser(id);
        deleteForm.reset();
    });
});

function updateTable(users) {
    console.log('Received users:', users);
    const tableBody = document.querySelector('table#users-table tbody');
    tableBody.innerHTML = '';

    if (!Array.isArray(users)) {
        console.error('Invalid response format: users is not an array');
        return;
    }

    users.forEach(user => {
        const row = document.createElement('tr');
        const idCell = document.createElement('td');
        idCell.textContent = user.id;
        const nameCell = document.createElement('td');
        nameCell.textContent = user.name;
        const emailCell = document.createElement('td');
        emailCell.textContent = user.email;
        const ageCell = document.createElement('td');
        ageCell.textContent = user.age;
        row.appendChild(idCell);
        row.appendChild(nameCell);
        row.appendChild(emailCell);
        row.appendChild(ageCell);
        tableBody.appendChild(row);
    });
}

function addUser() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const age = document.getElementById('age').value;
    const userData = { name, email, age };

    if (!name || !email || !age) {
        alert('Please fill in all required fields.');
        return;
    }

    fetch('/api/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
    .then(response => response.json())
    .then(user => {
        console.log('Added user:', user);
        alert(`User ${user.name} added successfully`);
        return fetch('/api/users');
    })
    .then(response => response.json())
    .then(users => {
        updateTable(users);
    })
    .catch(error => {
        console.error('Error adding user:', error);
        alert('Failed to add user');
    });
}

function updateUser(id, name, email, age) {
    const userData = { name, email, age };

    fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
    .then(response => response.json())
    .then(user => {
        console.log('Updated user:', user);
        alert(`User ${user.name} updated successfully`);
        return fetch('/api/users');
    })
    .then(response => response.json())
    .then(users => {
        updateTable(users);
    })
    .catch(error => {
        console.error('Error updating user:', error);
        alert('Failed to update user');
    });
}

function deleteUser(id) {
    fetch(`/api/users/${id}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(result => {
        if (result.id) {
            return fetch('/api/users');
        } else {
            throw new Error('Failed to delete user');
        }
    })
    .then(response => response.json())
    .then(users => {
        updateTable(users);
    })
    .catch(error => {
        console.error(error);
        alert('Failed to delete user');
    });
}

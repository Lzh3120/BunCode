const tableBody = document.querySelector('#realmTable tbody');
const addButton = document.getElementById('addBtn');
const endpointList = '/realm/list';
const endpointAdd = '/realm/add';
const endpointDelete = '/realm/delete';
const endpointUpdate = '/realm/update';
const endpointForward = '/realm/forward';
const AUTH = 'cC321321..';

// Function to fetch and display the realm entries
async function fetchRealmEntries() {
    try {
        const response = await fetch(endpointList, {
            method: 'POST',
            headers: { 'Authorization': AUTH }
        });
        const data = await response.json();
        renderTable(data);
    } catch (error) {
        console.error('Error fetching realm entries:', error);
    }
}

// Function to render the table with realm entries
function renderTable(entries) {
    tableBody.innerHTML = '';
    entries.forEach(entry => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${entry.ip}</td>
            <td>${entry.port}</td>
            <td>${entry.remarks}</td>
            <td>
                <button class="modifyButton" data-id="${entry.id}">Modify</button>
                <button class="deleteButton" data-id="${entry.id}">Delete</button>
                <button class="forwardButton" data-id="${entry.id}">Forward</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Event listener for the Add button
addButton.addEventListener('click', async () => {
    const ip = prompt('Enter IP address:');
    const port = prompt('Enter port number:');
    const remark = prompt('Enter remark:');
    
    if (ip && port) {
        try {
            const response = await fetch(endpointAdd, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': AUTH
                },
                body: JSON.stringify({ ip, port, remark })
            });
            if (response.ok) {
                fetchRealmEntries(); // Refresh the table
            } else {
                console.error('Error adding realm entry:', response.statusText);
            }
        } catch (error) {
            console.error('Error adding realm entry:', error);
        }
    }
});

// Event delegation for Modify and Delete buttons
tableBody.addEventListener('click', async (event) => {
    const target = event.target;
    const id = target.getAttribute('data-id');

    if (target.classList.contains('deleteButton')) {
        if (confirm('Are you sure you want to delete this entry?')) {
            try {
                const response = await fetch(endpointDelete, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ id })
                });
                if (response.ok) {
                    fetchRealmEntries(); // Refresh the table
                } else {
                    console.error('Error deleting realm entry:', response.statusText);
                }
            } catch (error) {
                console.error('Error deleting realm entry:', error);
            }
        }
    } else if (target.classList.contains('modifyButton')) {
        const newIp = prompt('Enter new IP address:');
        const newPort = prompt('Enter new port number:');
        const newRemark = prompt('Enter new remark:');
        
        if (newIp && newPort) {
            try {
                const response = await fetch(endpointUpdate, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': AUTH
                    },
                    body: JSON.stringify({ id, ip: newIp, port: newPort, remark: newRemark })
                });
                if (response.ok) {
                    fetchRealmEntries(); // Refresh the table
                } else {
                    console.error('Error updating realm entry:', response.statusText);
                }
            } catch (error) {
                console.error('Error updating realm entry:', error);
            }
        }
    } else if (target.classList.contains('forwardButton')) {
        if (confirm('Start forwarding local 6666 to this realm?')) {
            try {
                const response = await fetch(endpointForward, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': AUTH
                    },
                    body: JSON.stringify({ id })
                });
                const data = await response.json();
                if (response.ok) {
                    alert('Forward started: ' + (data.target || ''));
                } else {
                    console.error('Error starting forward:', data);
                    alert('Forward failed: ' + (data.message || response.statusText));
                }
            } catch (error) {
                console.error('Error starting forward:', error);
            }
        }
    }
});

// Initial fetch of realm entries
fetchRealmEntries();
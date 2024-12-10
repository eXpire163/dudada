<template>
    <div>
        <h2>Im Labor</h2>
        <div class="grid-container">
            <div v-for="user in users" :key="user.id" class="grid-item">
                <button @click="toggleUser(user.id)" :class="{ active: user.active }">
                    {{ user.name
                    }}
                </button>
            </div>
        </div>

        <h2>User Management</h2>
        <div>
            <input v-model="newUser.name" placeholder="Name" />
            <button @click="addUser">Add User</button>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {

        return {
            newUser: { id: '', name: '' },
            users: []
        };
    },
    methods: {
        async addUser() {
            try {
                const response = await axios.post('http://localhost:5000/add-user', this.newUser);
                this.users = response.data.users;
            } catch (error) {
                console.error(error.response.data);
            }
        },
        async removeUser(id) {
            try {
                const response = await axios.delete(`http://localhost:5000/remove-user/${id}`);
                this.users = response.data.users;
            } catch (error) {
                console.error(error.response.data);
            }
        },
        async toggleUser(id) {
            try {
                const response = await axios.put(`http://localhost:5000/toggle-user/${id}`);
                this.users = this.users.map(user => (user.id === id ? response.data.user : user));
            } catch (error) {
                console.error(error.response.data);
            }
        },
        setupWebSocket() {
            const ws = new WebSocket('ws://localhost:5000');

            ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                console.log(data);
                if (data.type === 'update') {
                    this.users = data.users;
                }
            };

            ws.onclose = () => {
                console.warn('WebSocket closed, attempting to reconnect...');
                setTimeout(this.setupWebSocket, 3000); // Reconnect on close
            };
        }
    },
    async mounted() {
        this.setupWebSocket(); // Initialize WebSocket connection
        const response = await axios.get('http://localhost:5000/users');
        this.users = response.data;
    }
};
</script>

<style scoped>
ul {
    list-style-type: none;
    padding: 0;
}

li {
    margin: 10px 0;
}


button {
    width: 150px;
    height: 150px;
    background-color: #686968;
    color: white;
}

button.form {
    width: 150px;
    height: 50px;
    background-color: #686968;
    color: white;
}

/* Active Button Style */
button.active {
    background-color: #28a745;
    color: white;
}

.grid-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    /* Responsive columns */
    gap: 10px;
    /* Spacing between buttons */
}

.grid-item {
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>

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
        <h3 @click="showAdmin = !showAdmin">Verwaltung anzeigen/verstecken</h3>
        <div class="adminpanel" v-if="showAdmin">
            <h2>Benutzer hinzufügen</h2>
            <div class="grid-container">
                <input v-model="newUser.name" placeholder="Name" class="form" />
                <button @click="addUser" class="form">Add User</button>
            </div>
            <h2>Benutzer entfernen</h2>
            <div class="grid-container">
                <div v-for="user in users" :key="user.id" class="grid-item">
                    <button @click="removeUser(user.id)" class="remover">
                        {{ user.name
                        }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

const api = axios.create({
    baseURL: `${window.location.origin}/api`, // Dynamically use the current origin
});

export default {
    data() {

        return {
            newUser: { id: '', name: '' },
            users: [],
            showAdmin: false
        };
    },
    methods: {
        async addUser() {
            try {
                const response = await api.post('/add-user', this.newUser);
                this.users = response.data.users;
            } catch (error) {
                console.error(error.response.data);
            }
        },
        async removeUser(id) {
            try {
                const confirmDelete = window.confirm("Are you sure you want to delete this user?");
                if (!confirmDelete) return;
                const response = await api.delete(`/remove-user/${id}`);
                this.users = response.data.users;
            } catch (error) {
                console.error(error.response.data);
            }
        },
        async toggleUser(id) {
            try {
                const response = await api.put(`/toggle-user/${id}`);
                this.users = this.users.map(user => (user.id === id ? response.data.user : user));
            } catch (error) {
                console.error(error.response.data);
            }
        },
        setupWebSocket() {

            // console.log(`Setting up WebSocket connection... on ws://${window.location.origin}`);
            // console.log(window.location);
            // console.log(window.location.origin);
            const ws = new WebSocket(`ws://${window.location.host}`);

            ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                //console.log(data);
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
        const response = await api.get('/users');
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


.form {
    margin: 10px;
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

button.remover {
    background-color: #a31414;
    color: rgb(112, 112, 112);
    width: 100px;
    height: 50px;
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

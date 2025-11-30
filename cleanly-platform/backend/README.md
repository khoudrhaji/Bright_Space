# Bright_Space
Cleanly platform, strictly follows the MVC (Model-View-Controller) pattern for the backend and a modern Component-Page architecture for the React frontend.

## API Documentation

This documentation provides details about the API endpoints for the Bright Space platform.

### Base URL

All API endpoints are prefixed with `/api`.

---

### Authentication (`/api/auth`)

| Method | Endpoint                  | Description              | Access |
|--------|---------------------------|--------------------------|--------|
| `POST` | `/register`               | Register a new user      | Public |
| `POST` | `/login`                  | Authenticate a user      | Public |
| `POST` | `/forgot-password`        | Request a password reset | Public |
| `PUT`  | `/reset-password/:token`  | Reset user password      | Public |

---

### Users (`/api/users`)

| Method | Endpoint       | Description                  | Access      |
|--------|----------------|------------------------------|-------------|
| `GET`  | `/providers`   | Get a list of all providers  | Public      |
| `GET`  | `/profile`     | Get current user's profile   | Private     |
| `PUT`  | `/profile`     | Update current user's profile| Private     |

---

### Services (`/api/services`)

| Method | Endpoint | Description              | Access      |
|--------|----------|--------------------------|-------------|
| `GET`  | `/`      | Get all services         | Public      |
| `GET`  | `/:id`   | Get a single service     | Public      |
| `POST` | `/`      | Create a new service     | Admin       |
| `PUT`  | `/:id`   | Update a service         | Admin       |
| `DELETE`| `/:id`   | Delete a service         | Admin       |

---

### Bookings (`/api/bookings`)

| Method | Endpoint        | Description                               | Access      |
|--------|-----------------|-------------------------------------------|-------------|
| `GET`  | `/`             | Get all bookings (user or all for admin)  | Private     |
| `GET`  | `/:id`          | Get a single booking                      | Private     |
| `POST` | `/`             | Create a new booking                      | Private     |
| `PUT`  | `/:id/status`   | Update booking status                     | Private     |

---

### Chat (`/api/chat`)

| Method | Endpoint            | Description                      | Access      |
|--------|---------------------|----------------------------------|-------------|
| `GET`  | `/conversations`    | Get all conversations for a user | Private     |
| `GET`  | `/:conversationId`  | Get messages in a conversation   | Private     |
| `POST` | `/`                 | Send a new message               | Private     |

---

### Admin (`/api/admin`)

| Method | Endpoint                  | Description              | Access      |
|--------|---------------------------|--------------------------|-------------|
| `GET`  | `/stats`                  | Get dashboard statistics | Admin       |
| `PUT`  | `/approve-provider/:id`   | Approve a service provider| Admin       |

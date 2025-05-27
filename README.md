# Book Review API (Node.js, Bun, MongoDB, Mongoose)

A RESTful API for a basic Book Review system built with Node.js (running with Bun), Express.js, and MongoDB (managed with Docker Compose and Mongoose). It includes JWT-based user authentication, comprehensive book management, and review submission/management.

## 🔧 Tech Stack

* **Node.js**: JavaScript runtime (executed via Bun)
* **Bun**: Fast all-in-one JavaScript runtime (replaces Node.js for execution, npm for package management)
* **Express.js**: Web application framework
* **MongoDB**: NoSQL database (containerized with Docker Compose)
* **Mongo Express**: Web-based MongoDB administrative interface (containerized with Docker Compose)
* **Mongoose**: MongoDB object modeling for Node.js
* **JWT (JSON Web Tokens)**: For authentication
* **bcryptjs**: For password hashing
* **dotenv**: For environment variable management
* **TypeScript**: For type safety and better code organization

## 📦 Features

* **User Authentication (`/api/v1/` prefix)**:
    * `POST /api/v1/signup`: Register a new user.
    * `POST /api/v1/login`: Authenticate a user and return a JWT.
* **Book Management (`/api/v1/books` prefix)**:
    * `POST /api/v1/books`: Add a new book (Authenticated users only).
    * `GET /api/v1/books`: Get all books with pagination, and optional filters by author and genre.
    * `GET /api/v1/books/:id`: Get book details by ID, including average rating and reviews (with pagination for reviews).
    * `POST /api/v1/books/:id/reviews`: Submit a review for a specific book (Authenticated users only, one review per user per book).
* **Review Management (`/api/v1/reviews` prefix)**:
    * `PUT /api/v1/reviews/:id`: Update your own review (Authenticated users only).
    * `DELETE /api/v1/reviews/:id`: Delete your own review (Authenticated users only).

## 🚀 Project Setup Instructions

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/manishdait/book-review-api.git
    cd book-review-api
    ```

2.  **Install Bun:**
    If you don't have Bun installed, follow the instructions at [https://bun.sh/docs/installation](https://bun.sh/docs/installation).

3.  **Install project dependencies using Bun:**
    ```bash
    bun install
    ```

4.  **Create a `.env` file:**
    Create a file named `.env` in the root of the project and add the following environment variables:
    ```env
    SERVER_PORT=3000
    DATASOURCE_URL=mongodb://<db_username>:<db_password>@localhost:27017/<db_name>?authSource=admin
    ACCESS_TOKEN_KEY=<access-token-key>
    ```
    * **`DATASOURCE_URL`**: This URL points to the MongoDB container set up by Docker Compose. The `authSource=admin` is necessary because `root` user is created in the `admin` database.
    * **`ACCESS_TOKEN_KEY`**: You can generate one with
      ```sh
      node
      require('crypto').randomBytes(64).toString('hex')
      ```

5.  **Start MongoDB and Mongo Express with Docker Compose:**
    Ensure you have Docker installed and running.
    ```bash
    docker-compose up -d
    ```
    This will start two containers:
    * `mongo`: MongoDB database, accessible at `mongodb://localhost:27017`.
    * `mongo-express`: Web UI for MongoDB, accessible at `http://localhost:8081`. (Login: `admin`/`pass`)

6.  **Run the application in development mode:**
    ```bash
    bun start:dev
    ```
    The API will be accessible at `http://localhost:3000`. `ts-node` will watch for changes and restart the server automatically.

7.  **Build and Start (for production):**
    ```bash
    bun run build # Compiles TypeScript to JavaScript
    bun run start # Starts the compiled JavaScript application
    ```

## 📋 Example API Requests (using `curl`)

Replace `YOUR_JWT_TOKEN` with the token obtained from the `/api/v1/login` endpoint.

### Authentication (`/api/v1/`)

**1. Register a new user (`POST /api/v1/signup`)**
```bash
curl -X POST -H "Content-Type: application/json" -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
}' http://localhost:3000/api/v1/signup
```

**2. Login a user (`POST /api/v1/login`)**
```bash
curl -X POST -H "Content-Type: application/json" -d '{
    "username": "testuser",
    "password": "password123"
}' http://localhost:3000/api/v1/login
```

### Books (`/api/v1/books`)

**3. Add a new book (`POST /api/v1/books`) - Requires Authentication**

```bash
curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer YOUR_JWT_TOKEN" -d '{
    "title": "The Hitchhikers Guide to the Galaxy",
    "description": "A comedic science fiction series.",
    "author": "Douglas Adams",
    "genre": "Science Fiction",
    "price": 23.34
}' http://localhost:3000/api/v1/books
```
**4. Get all books (`GET /api/v1/books`) - Pagination, Filter by Author/Genre**

```bash
# Get all books (default page 1, limit 10)
curl http://localhost:3000/api/v1/books

# With pagination
curl http://localhost:3000/api/v1/books?page=2&limit=5

# Filter by author
curl "http://localhost:3000/api/v1/books?author=Douglas%20Adams"

# Filter by genre
curl "http://localhost:3000/api/v1/books?genre=Science%20Fiction"

# Filter by both
curl "http://localhost:3000/api/v1/books?author=Douglas%20Adams&genre=Science%20Fiction"
```

**5. Get book details by ID, including reviews and average rating (`GET /api/v1/books/:id`)
(Replace BOOK_ID with an actual book ID from previous requests)**

```bash
curl http://localhost:3000/api/v1/books/60c72b2f9f1b2c001c8e4d01 # Example ID

# With review pagination
curl http://localhost:3000/api/v1/books/60c72b2f9f1b2c001c8e4d01?reviewPage=1&reviewLimit=2
```

### Reviews (`/api/v1/reviews`)

**7. Submit a review for a book (`POST /api/v1/books/:id/reviews`) - Requires Authentication
(Replace BOOK_ID with an actual book ID)**

```bash
curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer YOUR_JWT_TOKEN" -d '{
    "comment": "Absolutely brilliant and hilarious!"
    "rating": 5,
}' http://localhost:3000/api/v1/books/60c72b2f9f1b2c001c8e4d01/reviews
```

**8. Update your own review (`PUT /api/v1/reviews/:id`) - Requires Authentication
(Replace REVIEW_ID with an actual review ID)**

```bash
curl -X PUT -H "Content-Type: application/json" -H "Authorization: Bearer YOUR_JWT_TOKEN" -d '{
    "comment": "Still brilliant, but could be longer."
    "rating": 4,
}' http://localhost:3000/api/v1/reviews/60c72c0e9f1b2c001c8e4d02 # Example ID
```

**9. Delete your own review (`DELETE /api/v1/reviews/:id`) - Requires Authentication
(Replace REVIEW_ID with an actual review ID)**

```bash
curl -X DELETE -H "Authorization: Bearer YOUR_JWT_TOKEN" http://localhost:3000/api/v1/reviews/60c72c0e9f1b2c001c8e4d02 # Example ID
```

## 📊 Database Schema
**User Schema**
- `_id`: ObjectId (Primary Key)
- `username`: String (Unique, Required)
- `email`: String (Unique, Required)
- `password`: String (Required, Hashed)

**Book Schema**
- `_id`: ObjectId (Primary Key)
- `title`: String (Required)
- `description`: String
- `author`: String (Required)
- `genre`: String (Required)
- `price`: Number (Required)

**Review Schema**
- `_id`: ObjectId (Primary Key)
- `book`: ObjectId (Reference to Book, Required)
- `user`: ObjectId (Reference to User, Required)
- `comment`: String
- `rating`: Number (Required, between 0 and 5)
- `createdAt`: Date

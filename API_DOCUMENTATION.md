# GymFlow BD - API Documentation

Base URL: `/api/v1`

---

## 1. Authentication (`/auth`)

### Register User
- **Method:** `POST`
- **Endpoint:** `/auth/register`
- **Input (Body):**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword",
    "phone": "01700000000",      // Optional
    "address": "Dhaka"           // Optional
  }
  ```
- **Expected Output (201 Created):**
  ```json
  {
    "success": true,
    "statusCode": 201,
    "message": "User registered successfully",
    "data": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "USER",
      "createdAt": "2024-05-12T10:00:00.000Z"
    }
  }
  ```

### Login User
- **Method:** `POST`
- **Endpoint:** `/auth/login`
- **Input (Body):**
  ```json
  {
    "email": "john@example.com",
    "password": "securepassword"
  }
  ```
- **Expected Output (200 OK):**
  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "User logged in successfully",
    "data": {
      "accessToken": "eyJhbGciOiJIUz...",
      "user": {
        "id": "uuid",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "USER"
      }
    }
  }
  ```

---

## 2. Users (`/users`)

### Get Profile
- **Method:** `GET`
- **Endpoint:** `/users/profile`
- **Headers:** `Authorization: Bearer <accessToken>`
- **Expected Output (200 OK):**
  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "Profile retrieved successfully",
    "data": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "01700000000",
      "address": "Dhaka",
      "profileImage": null
    }
  }
  ```

### Update Profile
- **Method:** `PATCH`
- **Endpoint:** `/users/profile`
- **Headers:** `Authorization: Bearer <accessToken>`
- **Input (Body - all optional):**
  ```json
  {
    "name": "John Updated",
    "phone": "01800000000",
    "address": "Gulshan",
    "profileImage": "https://link-to-image.com/img.png"
  }
  ```
- **Expected Output (200 OK):** User profile object.

### Get All Users (Admin)
- **Method:** `GET`
- **Endpoint:** `/users/admin/all`
- **Headers:** `Authorization: Bearer <accessToken>` (Admin only)
- **Expected Output (200 OK):** Array of all user objects.

---

## 3. Membership Plans (`/membership-plans`)

### Get All Active Plans
- **Method:** `GET`
- **Endpoint:** `/membership-plans`
- **Expected Output (200 OK):**
  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "Membership plans retrieved successfully",
    "data": [
      {
        "id": "uuid",
        "name": "Monthly Standard",
        "description": "Standard access",
        "price": 2000,
        "durationDays": 30,
        "features": ["Gym Access", "Locker"],
        "isActive": true
      }
    ]
  }
  ```

### Create Plan (Admin)
- **Method:** `POST`
- **Endpoint:** `/membership-plans`
- **Headers:** `Authorization: Bearer <accessToken>` (Admin only)
- **Input (Body):**
  ```json
  {
    "name": "Monthly Standard",
    "description": "Standard access",
    "price": 2000,
    "durationDays": 30,
    "features": ["Gym Access", "Locker"],
    "isActive": true
  }
  ```
- **Expected Output (201 Created):** Membership plan object.

*(Also supports `PATCH /:id` and `DELETE /:id` for Admins)*

---

## 4. Trainers (`/trainers`)

### Get All Trainers
- **Method:** `GET`
- **Endpoint:** `/trainers`
- **Expected Output (200 OK):** Array of active trainer objects.

### Create Trainer (Admin)
- **Method:** `POST`
- **Endpoint:** `/trainers`
- **Headers:** `Authorization: Bearer <accessToken>` (Admin only)
- **Input (Body):**
  ```json
  {
    "name": "Arnold",
    "specialization": "Bodybuilding",
    "experience": "10 Years",
    "certifications": ["ACE Certified"],
    "bio": "Expert in hypertrophy.",
    "image": "url" // Optional
  }
  ```
- **Expected Output (201 Created):** Trainer object.

*(Also supports `PATCH /:id` and `DELETE /:id` for Admins)*

---

## 5. Facilities (`/facilities`)

### Get All Facilities
- **Method:** `GET`
- **Endpoint:** `/facilities`
- **Expected Output (200 OK):** Array of active facility objects.

### Create Facility (Admin)
- **Method:** `POST`
- **Endpoint:** `/facilities`
- **Headers:** `Authorization: Bearer <accessToken>` (Admin only)
- **Input (Body):**
  ```json
  {
    "name": "Cardio Zone",
    "description": "State of the art treadmills.",
    "image": "url" // Optional
  }
  ```
- **Expected Output (201 Created):** Facility object.

*(Also supports `PATCH /:id` and `DELETE /:id` for Admins)*

---

## 6. Gallery (`/gallery`)

### Get Gallery Images
- **Method:** `GET`
- **Endpoint:** `/gallery`
- **Expected Output (200 OK):** Array of gallery image objects.

### Add Gallery Image (Admin)
- **Method:** `POST`
- **Endpoint:** `/gallery`
- **Headers:** `Authorization: Bearer <accessToken>` (Admin only)
- **Input (Body):**
  ```json
  {
    "title": "Dumbbell Rack",
    "imageUrl": "https://link.com/img.png",
    "category": "Equipment"
  }
  ```
- **Expected Output (201 Created):** Gallery image object.

*(Also supports `DELETE /:id` for Admins)*

---

## 7. FAQs (`/faqs`)

### Get FAQs
- **Method:** `GET`
- **Endpoint:** `/faqs`
- **Expected Output (200 OK):** Array of FAQ objects.

### Create FAQ (Admin)
- **Method:** `POST`
- **Endpoint:** `/faqs`
- **Headers:** `Authorization: Bearer <accessToken>` (Admin only)
- **Input (Body):**
  ```json
  {
    "question": "What are your opening hours?",
    "answer": "We are open 24/7."
  }
  ```
- **Expected Output (201 Created):** FAQ object.

*(Also supports `PATCH /:id` and `DELETE /:id` for Admins)*

---

## 8. Memberships (`/memberships`)

### Purchase/Initiate Membership
- **Method:** `POST`
- **Endpoint:** `/memberships`
- **Headers:** `Authorization: Bearer <accessToken>`
- **Input (Body):**
  ```json
  {
    "planId": "uuid-of-the-plan"
  }
  ```
- **Expected Output (201 Created):**
  ```json
  {
    "success": true,
    "statusCode": 201,
    "message": "Membership initiated successfully",
    "data": {
      "membership": { /* membership object, status PENDING */ },
      "payment": { /* payment object, status PENDING, transactionId */ }
    }
  }
  ```

### Get My Memberships
- **Method:** `GET`
- **Endpoint:** `/memberships/me`
- **Headers:** `Authorization: Bearer <accessToken>`
- **Expected Output (200 OK):** Array of the user's memberships (including plan details and payment history).

### Get All Memberships (Admin)
- **Method:** `GET`
- **Endpoint:** `/memberships/admin`
- **Headers:** `Authorization: Bearer <accessToken>` (Admin only)
- **Expected Output (200 OK):** Array of all memberships across all users.

---

## 9. Payments (`/payments`)

### Get My Payments
- **Method:** `GET`
- **Endpoint:** `/payments/me`
- **Headers:** `Authorization: Bearer <accessToken>`
- **Expected Output (200 OK):** Array of the user's payment records.

### Get All Payments (Admin)
- **Method:** `GET`
- **Endpoint:** `/payments/admin`
- **Headers:** `Authorization: Bearer <accessToken>` (Admin only)
- **Expected Output (200 OK):** Array of all payment records in the system.

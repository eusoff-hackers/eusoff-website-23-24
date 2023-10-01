# Login

Used to login to an account.

**URL**: `/user/login`

**Method**: `POST`

**Auth required**: No

## Body

### Constraints

- **credentials** `(object)` &mdash; The account credentials:
  - **username** `(string)` &mdash; The account's username.
  - **password** `(string)` &mdash; The account's password.

### Example

```json
{
  "credentials": {
    "username": "C112",
    "password": "securepassword1234"
  }
}
```

## Success Response

**Code**: `200 OK`

### Body

- **success** `(bool)` &mdash; Whether the request was successful.
- **data**? `(object)` &mdash; If successful, the requested data:
  - **user** `(object)` &mdash; The account details:
    - **username** `(string)` &mdash; The user's username.
    - **bids** `(array)` &mdash; The user's current bids.
      - TBC
    - Other functionalities TBC


### Example

```json
{
    "success": true,
    "data": {
        "user": {
            "username": "C112",
            "bids": []
        }
    }
}
```

# Error Response

| **Condition**                  | **Code**                    | **Message**                    |
| ------------------------------ | --------------------------- | ------------------------------ |
| Invalid credentials            | `401 Unauthorized`          | `Invalid Credentials.`         |
| Incomplete credentials         | `400 Bad Request`           | `body/credentials must have required property.`         |
| Internal error                 | `500 INTERNAL SERVER ERROR` |                                |
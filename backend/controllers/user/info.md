# User Info

Used to get user info on a logged in account.

**URL**: `/user/info`

**Method**: `GET`

**Auth required**: Yes

## Success Response

**Code**: `200 OK`

### Body

- **success** `(bool)` &mdash; Whether the request was successful.
- **data**? `(object)` &mdash; If successful, the requested data:
  - **user** `(object)` &mdash; The account details:
    - **username** `(string)` &mdash; The user's username.
    - **teams** `(array)` &mdash; The user's teams.
    - **bids** `(array)` &mdash; The user's current bids.
      - TBC
    - **isEligible** `(boolean)` &mdash; Whether the user is eligible for a bid.
    - **role** `(string)` &mdash; The user's role.
    - **year** `(integer)` &mdash; Year user is enrolled in (1 - 4).
    - Other functionalities TBC


### Example

```json
{
    "success": true,
    "data": {
        "user": {
            "username": "C112",
            "teams": [],
            "bids": [],
            "isEligible": false,
            "role": "USER",
            "year": 1
        }
    }
}
```

# Error Response

| **Condition**                  | **Code**                    | **Message**                    |
| ------------------------------ | --------------------------- | ------------------------------ |
| Not logged in                  | `401 Unauthorized`          |                                |
| Internal error                 | `500 INTERNAL SERVER ERROR` |                                |
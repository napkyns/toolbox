# ApiService

## Config

The ApiService will look for the auth token in localStorage.

```javascript
Authorization: {
  toString() {
    return  `Bearer ${localStorage.getItem('token')}`;
  },
}
```
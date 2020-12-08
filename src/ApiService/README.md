# ApiService

## Config

**Authorization**

By default, the ApiService will look for the localStorage item with a key of token.

```javascript
Authorization: {
  toString() {
    const tokenKey = window.app && window.app.tokenKey ? window.app.tokenKey : 'token'; 
    return  `Bearer ${localStorage.getItem(tokenKey)}`;
  },
}
```

You can override this by setting the ``window.app.tokenKey`` variable.

```javascript
window.app.tokenKey = 'customKey';
```

**Login Redirect**

If you set a ``window.app.loginPath``, the ApiService will automatically redirect 401 responses to login.

```javascript
window.app.loginPath = '/auth/login';
```
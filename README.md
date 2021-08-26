# Employee Attendance Manager

### Configuration for ```.env``` file
```
SECRET_KEY, TOKEN_EXPIRATION_TIME, SUPPRESS_NO_CONFIG_WARNING, PORT, JWT_ISS, JWT_SUB, JWT_AUD, JWT_KEY_PASS,
VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_EMAIL
```
---
### Configuration for ```config``` files
Create two files in ***/config*** directory ```development.json```(for dev environment) and ```test.json```(for test environment)
```
{
  <"dev" or "test"> : {
    "name": "<APP_NAME>",
    "port": <SERVER_PORT>,
    "mode": "<CONFIG_MODE>",
    "protocol": "http",
    "serverUrl": "localhost",
    "database": {
      "host": "<HOSTNAME>",
      "user": "<USERNAME>",
      "password": "<PASSWORD>",
      "database": "<DATABASE_NAME>"
    },
    "email": {
      "service":"<SERVICE_NAME>",
      "host": "<EMAIL_HOST>",
      "port": "<EMAIL_SERVICE_PORT>",
      "username": "<EMAIL_ADDRESS>",
      "password": "<PASSWORD>"
    }
  }
}
```
---
### Configuration for ```key``` files
Add RSA key pair named ```jwt-private.key``` and ```jwt-public.key``` in ***/keys*** directory

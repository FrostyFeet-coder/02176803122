const axios = require("axios");

const LOG_API = "http://20.244.56.144/evaluation-service/logs";

const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJ3YXNhbi5hbnNoQGdtYWlsLmNvbSIsImV4cCI6MTc1MTk1NjI5MywiaWF0IjoxNzUxOTU1MzkzLCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiOWIzYWQ1NmUtMTQxOC00YTE3LThmNWMtZGE0ZGExMDE0ZWYyIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoiYW5zaCB3YXNhbiIsInN1YiI6IjFlNTNlNjA3LTkyYWUtNDEzZi1iY2Y5LTk1NTVjOGZiZjZjMiJ9LCJlbWFpbCI6Indhc2FuLmFuc2hAZ21haWwuY29tIiwibmFtZSI6ImFuc2ggd2FzYW4iLCJyb2xsTm8iOiIwMjE3NjgwMzEyMiIsImFjY2Vzc0NvZGUiOiJWUHBzbVQiLCJjbGllbnRJRCI6IjFlNTNlNjA3LTkyYWUtNDEzZi1iY2Y5LTk1NTVjOGZiZjZjMiIsImNsaWVudFNlY3JldCI6IldySkVXamtOcEJFcUFxRGsifQ.8_6K4tzhI-3r-iJBcZfttGbAimY36Sk2DJmBk2C95FseyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJ3YXNhbi5hbnNoQGdtYWlsLmNvbSIsImV4cCI6MTc1MTk1NjQzMiwiaWF0IjoxNzUxOTU1NTMyLCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiZGMxYmJiZTctNmQzZC00ZWU0LThkMGItZjI4OWU1MjdlZDdiIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoiYW5zaCB3YXNhbiIsInN1YiI6IjFlNTNlNjA3LTkyYWUtNDEzZi1iY2Y5LTk1NTVjOGZiZjZjMiJ9LCJlbWFpbCI6Indhc2FuLmFuc2hAZ21haWwuY29tIiwibmFtZSI6ImFuc2ggd2FzYW4iLCJyb2xsTm8iOiIwMjE3NjgwMzEyMiIsImFjY2Vzc0NvZGUiOiJWUHBzbVQiLCJjbGllbnRJRCI6IjFlNTNlNjA3LTkyYWUtNDEzZi1iY2Y5LTk1NTVjOGZiZjZjMiIsImNsaWVudFNlY3JldCI6IldySkVXamtOcEJFcUFxRGsifQ.8KGRODDjTIpjwpUw04hm4IONR3b-ANmpNWJXetUEjNA";
async function Log(stack, level, pkg, message) {
  try {
    const payload = {
      stack: stack.toLowerCase(),
      level: level.toLowerCase(),
      package: pkg.toLowerCase(),
      message,
    };

    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${AUTH_TOKEN}`, 
    };

    const res = await axios.post(LOG_API, payload, { headers });
    console.log("Log sent:", payload);
  } catch (err) {
    console.error("Failed to send log:", err.message);
  }
}

module.exports = Log;

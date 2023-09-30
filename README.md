## Getting Started

First, run the development server:

```bash
npm dev
```

## Manual deploy to server

```bash
npm deploy
```

## Run use pm2

### Start pm2 cluster

```bash
pm2 start ./dist/index.js --name fastify -i 3
```

### Reload pm2 cluster

```bash
pm2 reload admin_api
```

## API Rules

URI formats

- Forward slash separator (/) must be used to indicate a hierarchical
  relationship
- A trailing forward slash (/) should not be included in URIs
- Hyphens (-) should be used to improve the readability of URIs
- Underscores (\_) should not be used in URIs
- Prefer all lowercase letters in a URI path
- Do not include file extensions

Resource archetypes

- Document
- Collection
- Stores
- Controller

URI path

- Use singular nouns for document names
- Use plural nouns for collections and stores
- As controller names represent an action, use a verb or verb phrase for controller resources
- Do not use CRUD function names in URIs

URI query

- Use the query to filter collections or stores
- Use the query to paginate collection or store results

Request methods

- Don't tunnel to other requests with the GET and POST methods
- Use the GET method to retrieve a representation of a resource
- Use the HEAD method to retrieve response headers
- Use the PUT method to update and insert a stored resource
- Use the PUT method to update mutable resources
- Use the POST method to create a new resource in a collection
- Use the POST method for controller's execution
- Use the DELETE method to remove a resource from its parent
- Use the OPTIONS method to retrieve metadata

Response status codes

- 200: (“OK”) must not be used to communicate errors in the response
  body
- 201: (“Created”) must be used to indicate successful resource creation
- 202: (“Accepted”) must be used to indicate successful start of an
  asynchronous action
- 204: (“No Content”) should be used when the response body is
  intentionally empty
- 301: (“Moved Permanently”) should be used to relocate resources
- 303: (“See Other”) should be used to refer the client to a different URI
- 304: (“Not Modified”) should be used to preserve bandwidth
- 307: (“Temporary Redirect”) should be used to tell clients to resubmit
  the request to another URI
- 400: (“Bad Request”) may be used to indicate nonspecific failure
- 401: (“Unauthorized”) must be used when there is a problem with the
  client’s credentials
- 403: (“Forbidden”) should be used to forbid access regardless of
  authorization state
- 404: (“Not Found”) must be used when a client’s URI cannot be mapped to a resource
- 405: (“Method Not Allowed”) must be used when the HTTP method is
  not supported
- 406: (“Not Acceptable”) must be used when the requested media type
  cannot be served
- 409: (“Conflict”) should be used to indicate a violation of resource state
- 500: (“Internal Server Error”) should be used to indicate API
  malfunction

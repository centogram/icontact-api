# iContact API

icontact-api provides a pomisified interface for iContact and iContact Pro's REST APIs.

To install icontact-api, use npm:

```
$ npm install icontact-api
```

## Examples

### Instantiating an IContactAPI Object

#### TypeScript
```typescript
import IContactAPI, { IContact } from 'icontact-api';

const iContactAPI = new IContactAPI('my app id', 'my username', 'my password');
iContactAPI.setAccountId(9999999);
iContactAPI.setClientFolderId(9999);
```

#### JavaScript
```javascript
var IContactAPI = require('icontact-api').default;

var iContactAPI = new IContactAPI('my app id', 'my username', 'my password');
iContactAPI.setAccountId(9999999);
iContactAPI.setClientFolderId(9999);
```

### iContact and iContact Pro

By default, the IContactAPI object will attempt to connect to the iContact Pro REST API. To instantiate an object that will connect to regular iContact, pass `false` for the optional fourth constructor parameter:

```javascript
iContactAPI = new IContactAPI('my app id', 'my username', 'my password', false);
```

### Sandbox Account

To connect to an iContact Sandbox account, pass `true` for the optional fifth constructor parameter.

```javascript
iContactAPI = new IContactAPI('my app id', 'my username', 'my password', false, true);
```

Note that iContact Pro doesn't have a sandbox and the fifth parameter will be ignored.

### Searching for a Contact

#### TypeScript

```typescript
// search by contactId
iContactAPI.getContacts({ contactId: 23 }).then((results) => {
  console.log(results);
}).catch((err) => {
  console.log(err);
});

// search by state and firstName with pattern matching
iContactAPI.getContacts({ state: 'MD', firstName: 'John*' }).then((results) => {
  console.log(results);
}).catch((err) => {
  console.log(err);
});
```

#### JavaScript

```javascript
// search by contactId
iContactAPI.getContacts({ contactId: 23 }).then(function (results) {
  console.log(results);
}).catch(function (err) {
  console.log(err);
});

// search by state and firstName with pattern matching
iContactAPI.getContacts({ state: 'MD', firstName: 'John*' }).then(function (results) {
  console.log(results);
}).catch(function (err) {
  console.log(err);
});
```

### Add or Update a Contact and Subscribe It to a List

If you issue a contact creation request when a contact already exists (same email address), the old contact will be overwritten and any fields you don't provide will be blank on the resulting contact. To avoid this, see if a contact exists first and then issue either a create contacts request or an update contact request.

#### TypeScript
```typescript
const emailAddress = 'john@example.com';
const firstName = 'John';
const lastName = 'Doe'
const listId = 5;

const contact: IContact = {
  email: emailAddress,
  firstName,
  lastName,
};

iContactAPI.getContacts({ email: contact.email }).then(async (results) => {
  if (results.total === 0) {
    let result = await iContactAPI.addContacts([contact]);
    return result.contacts[0];
  } else {
    let result = await iContactAPI.updateContact(results.contacts[0].contactId, contact);
    return result.contact;
  }
}).then((results) => {
  return iContactAPI.subscribeContactToList(contact.contactId, listId); 
  console.log(results);
}).catch((err) => {
  console.log(err);
});
```

#### JavaScript
```javascript
var emailAddress = 'john@example.com';
var firstName = 'John';
var lastName = 'Doe'
var listId = 5;

var contact = {
  email: emailAddress,
  firstName: firstName,
  lastName: lastName,
  subsciptions: [
    {
      email: emailAddress,
      listId: listId,
      status: 'normal'
    },
  ],
};

iContactAPI.getContacts({ email: contact.email }).then(async function (results) {
  if (results.total === 0) {
    let result = await iContactAPI.addContacts([contact]);
    return result.contacts[0];
  } else {
    let result = await iContactAPI.updateContact(results.contacts[0].contactId, contact);
    return result.contact;
  }
}).then(function (results) {
  return iContactAPI.subscribeContactToList(contact.contactId, listId); 
  console.log(results);
}).catch(function (err) {
  console.log(err);
});
```

## Testing

Tests were written with [mocha](https://www.npmjs.com/package/mocha) and [chai](https://www.npmjs.com/package/chai).

Run them with

```
$ npm test
```

Testing will require an iContact Pro account. Provide the credentials in an `.env` file, following the example in `.env.example`.  var 

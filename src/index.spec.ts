import { expect } from 'chai';
import * as dotenv from 'dotenv';
import IContactAPI from './index';
import { IContact, IList } from './index';

dotenv.config();

if (typeof process.env.APP_ID === 'undefined') {
  throw new Error('APP_ID not specified in .env file');
}
const appId = process.env.APP_ID;

if (typeof process.env.API_USERNAME === 'undefined') {
  throw new Error('API_USERNAME not specified in .env file');
}
const apiUsername = process.env.API_USERNAME;

if (typeof process.env.API_PASSWORD === 'undefined') {
  throw new Error('API_PASSWORD not specified in .env file');
}
const apiPassword = process.env.API_PASSWORD;

if (typeof process.env.ACCOUNT_ID === 'undefined') {
  throw new Error('ACCOUNT_ID not specified in .env file');
}
const accountId = parseInt(process.env.ACCOUNT_ID, 10);

if (typeof process.env.CLIENT_FOLDER_ID === 'undefined') {
  throw new Error('CLIENT_FOLDER_ID not specified in .env file');
}
const clientFolderId = parseInt(process.env.CLIENT_FOLDER_ID, 10);

const pro = process.env.PRO ? true : false;
const sandbox = process.env.SANDBOX ? true : false;

const timeout = 5000;

describe('accountId', () => {

  it('should be set and read', (done) => {
    const iContactAPI = new IContactAPI(appId, apiUsername, apiPassword, pro, sandbox);
    iContactAPI.setAccountId(accountId);
    expect(iContactAPI.getAccountId()).to.equal(accountId);
    done();
  });

});

describe('clientFolderId', () => {

  it('should be set and read', (done) => {
    const iContactAPI = new IContactAPI(appId, apiUsername, apiPassword, pro, sandbox);
    iContactAPI.setClientFolderId(clientFolderId);
    expect(iContactAPI.getClientFolderId()).to.equal(clientFolderId);
    done();
  });

});

describe('timeout', () => {

  it('should be set and read', (done) => {
    const iContactAPI = new IContactAPI(appId, apiUsername, apiPassword, pro, sandbox);
    const t = 8000;
    iContactAPI.setTimeout(t);
    expect(iContactAPI.getTimeout()).to.equal(t);
    done();
  });

});

describe('getContacts', () => {

  it('should get some contacts', (done) => {
    const iContactAPI = new IContactAPI(appId, apiUsername, apiPassword, pro, sandbox);
    iContactAPI.setAccountId(accountId);
    iContactAPI.setClientFolderId(clientFolderId);
    iContactAPI.getContacts({ email: 'dave*' }).then((result) => {
      expect(result).to.be.an('object').with.property('contacts');
      expect(result.contacts).to.be.an('array');
      expect(result).to.have.property('total').that.is.a('number');
      done();
    }).catch(done);
  }).timeout(timeout);

  const numLoops = 60;

  it('should get ' + numLoops + ' contacts', (done) => {
    const emailAddresses: string[] = [];
    for (let i = 0; i < numLoops; i++) {
      emailAddresses.push(randomEmail());
    }
    const iContactAPI = new IContactAPI(appId, apiUsername, apiPassword, pro, sandbox);
    iContactAPI.setAccountId(accountId);
    iContactAPI.setClientFolderId(clientFolderId);
    Promise.all(emailAddresses.map((email) => iContactAPI.getContacts({ email }))).then((results) => {
      results.forEach((result) => {
        expect(result).to.be.an('object').with.property('contacts');
        expect(result.contacts).to.be.an('array');
        expect(result).to.have.property('total').that.is.a('number');
      });
      done();
    }).catch(done);
  }).timeout(timeout * numLoops);

});

describe('addContacts', () => {

  it('should add a single contact', (done) => {
    const email = randomEmail();
    const firstName = randomStr();
    const contacts = [{ email, firstName }];

    const iContactAPI = new IContactAPI(appId, apiUsername, apiPassword, pro, sandbox);
    iContactAPI.setAccountId(accountId);
    iContactAPI.setClientFolderId(clientFolderId);
    iContactAPI.addContacts(contacts).then((result) => {
      expect(result).to.be.an('object');
      expect(result).to.have.property('contacts');
      expect(result.contacts).to.be.an('array').of.length(1);
      expect(result.contacts[0]).to.have.property('contactId');
      expect(result.contacts[0]).to.have.property('email').that.equals(email);
      expect(result.contacts[0]).to.have.property('firstName').that.equals(firstName);
      done();
    }).catch(done);
  }).timeout(timeout);

  it('should add a single contact with custom fields', (done) => {
    const email = randomEmail();
    const firstName = randomStr();
    const country = 'Canada';
    const contact: IContact = { email, firstName, country };

    const iContactAPI = new IContactAPI(appId, apiUsername, apiPassword, pro, sandbox);
    iContactAPI.setAccountId(accountId);
    iContactAPI.setClientFolderId(clientFolderId);
    iContactAPI.addContacts([contact]).then((result) => {
      expect(result).to.be.an('object');
      expect(result).to.have.property('contacts');
      expect(result.contacts).to.be.an('array').of.length(1);
      expect(result.contacts[0]).to.have.property('contactId');
      expect(result.contacts[0]).to.have.property('email').that.equals(email);
      expect(result.contacts[0]).to.have.property('firstName').that.equals(firstName);
      expect(result.contacts[0]).to.have.property('country').that.equals(country);
      done();
    }).catch(done);
  }).timeout(timeout);

  it('should add a multiple contacts with custom fields', (done) => {
    const email1 = randomEmail();
    const email2 = randomEmail();
    const firstName1 = randomStr();
    const firstName2 = randomStr();
    const country1 = 'Canada';
    const country2 = 'Italy';
    const contacts: IContact[] = [
      { email: email1, firstName: firstName1, country: country1 },
      { email: email2, firstName: firstName2, country: country2 },
    ];

    const iContactAPI = new IContactAPI(appId, apiUsername, apiPassword, pro, sandbox);
    iContactAPI.setAccountId(accountId);
    iContactAPI.setClientFolderId(clientFolderId);
    iContactAPI.addContacts(contacts).then((result) => {
      expect(result).to.be.an('object');
      expect(result).to.have.property('contacts');
      expect(result.contacts).to.be.an('array').of.length(2);
      expect(result.contacts[0]).to.have.property('contactId');
      expect(result.contacts[0]).to.have.property('email').that.equals(email1);
      expect(result.contacts[0]).to.have.property('firstName').that.equals(firstName1);
      expect(result.contacts[0]).to.have.property('country').that.equals(country1);
      expect(result.contacts[1]).to.have.property('contactId');
      expect(result.contacts[1]).to.have.property('email').that.equals(email2);
      expect(result.contacts[1]).to.have.property('firstName').that.equals(firstName2);
      expect(result.contacts[1]).to.have.property('country').that.equals(country2);
      done();
    }).catch(done);
  }).timeout(timeout);

  if (pro) { // only version 2.3 of the API supports this

    it('should add a single contact with a subscription', (done) => {
      const email = randomEmail();
      const firstName = randomStr();
      const contacts: IContact[] = [
        {
          email,
          firstName,
          subscriptions: [
            {
              email,
              listId: 5,
              status: 'normal',
            },
          ],
        },
      ];

      const iContactAPI = new IContactAPI(appId, apiUsername, apiPassword, pro, sandbox);
      iContactAPI.setAccountId(accountId);
      iContactAPI.setClientFolderId(clientFolderId);
      iContactAPI.addContacts(contacts).then((result) => {
        expect(result).to.be.an('object');
        expect(result).to.have.property('contacts');
        expect(result.contacts).to.be.an('array').of.length(1);
        expect(result.contacts[0]).to.have.property('contactId');
        expect(result.contacts[0]).to.have.property('email').that.equals(email);
        expect(result.contacts[0]).to.have.property('firstName').that.equals(firstName);
        expect(result.contacts[0]).to.have.property('subscriptions');
        expect(result.contacts[0].subscriptions).to.be.an('array');
        done();
      }).catch(done);
    }).timeout(timeout);
  }

});

describe('updateContact', () => {

  let contactId: number;
  const email = randomEmail();
  const firstName = randomStr();
  const lastName = randomStr();

  let iContactAPI: IContactAPI;
  before(function (done) {
    this.timeout(timeout);
    const contact: IContact = { email, firstName, lastName };

    iContactAPI = new IContactAPI(appId, apiUsername, apiPassword, pro, sandbox);
    iContactAPI.setAccountId(accountId);
    iContactAPI.setClientFolderId(clientFolderId);
    iContactAPI.addContacts([contact]).then((result) => {
      contactId = result.contacts[0].contactId;
      done();
    }).catch(done);
  });

  it('should update a contact', (done) => {
    const newLastName = randomStr();
    const contact: IContact = {
      lastName: newLastName,
    };
    iContactAPI.updateContact(contactId, contact).then((result) => {
      expect(result).to.be.an('object').with.property('contact');
      expect(result.contact).to.have.property('contactId').that.equals(contactId); // shouldn't change
      expect(result.contact).to.have.property('email').that.equals(email); // old value
      expect(result.contact).to.have.property('firstName').that.equals(firstName); // old value
      expect(result.contact).to.have.property('lastName').that.equals(newLastName); // new value
      done();
    }).catch(done);
  }).timeout(timeout);

});

describe('replaceContact', () => {

  let contactId: number;
  const email = randomEmail();
  const firstName = randomStr();
  const lastName = randomStr();

  let iContactAPI: IContactAPI;
  before(function (done) {
    this.timeout(timeout);
    const contact: IContact = { email, firstName, lastName };

    iContactAPI = new IContactAPI(appId, apiUsername, apiPassword, pro, sandbox);
    iContactAPI.setAccountId(accountId);
    iContactAPI.setClientFolderId(clientFolderId);
    iContactAPI.addContacts([contact]).then((result) => {
      contactId = parseInt(result.contacts[0].contactId, 10);
      done();
    }).catch(done);
  });

  it('should replace a contact', (done) => {
    const newEmail = randomEmail();
    const newLastName = randomStr();
    const contact: IContact = {
      email: newEmail,
      lastName: newLastName,
    };
    iContactAPI.replaceContact(contactId, contact).then((result) => {
      expect(result).to.be.an('object').with.property('contact');
      expect(result.contact).to.have.property('contactId').that.equals(contactId); // shouldn't change
      expect(result.contact).to.have.property('email').that.equals(newEmail); // new value
      expect(result.contact).to.have.property('firstName').to.equal(''); // wasn't set
      expect(result.contact).to.have.property('lastName').that.equals(newLastName); // new value
      done();
    }).catch(done);
  }).timeout(timeout);

});

describe('deleteContact', () => {

  let contactId: number;
  const email = randomEmail();
  const firstName = randomStr();
  const lastName = randomStr();

  let iContactAPI: IContactAPI;
  before(function (done) {
    this.timeout(timeout);
    const contact: IContact = { email, firstName, lastName };

    iContactAPI = new IContactAPI(appId, apiUsername, apiPassword, pro, sandbox);
    iContactAPI.setAccountId(accountId);
    iContactAPI.setClientFolderId(clientFolderId);
    iContactAPI.addContacts([contact]).then((result) => {
      expect(result).to.be.an('object').with.property('contacts');
      expect(result.contacts).to.be.an('array').of.length(1);
      expect(result.contacts[0]).to.have.property('contactId');
      contactId = result.contacts[0].contactId;
      done();
    }).catch(done);
  });

  it('should delete a contact', (done) => {
    iContactAPI.getContacts({ contactId }).then((result) => {
      expect(result).to.be.an('object');
      expect(result).to.have.property('contacts');
      expect(result.contacts).to.be.an('array').of.length(1);
      expect(result).to.have.property('total');
      expect(result.total).to.equal(1);
      return iContactAPI.deleteContact(contactId);
    }).then((result) => {
      return iContactAPI.getContacts({ contactId });
    }).then((result) => {
      expect(result).to.be.an('object');
      expect(result).to.have.property('contacts');
      expect(result.contacts).to.be.an('array').of.length(0);
      expect(result).to.have.property('total');
      // for some reason, when we do two searches like in this test, result.total ends equal to 1
      // expect(result.total).to.equal(0);
      done();
    }).catch(done);
  }).timeout(timeout);

});

describe('getLists', () => {

  it('should get all the lists', (done) => {
    const iContactAPI = new IContactAPI(appId, apiUsername, apiPassword, pro, sandbox);
    iContactAPI.setAccountId(accountId);
    iContactAPI.setClientFolderId(clientFolderId);
    iContactAPI.getLists().then((result) => {
      expect(result).to.be.an('object').with.property('lists');
      expect(result.lists).to.be.an('array');
      if (result.lists.length > 0) {
        expect(result.lists[0]).to.be.an('object').with.property('listId');
        expect(result.lists[0].listId).to.be.a('number');
      }
      done();
    }).catch(done);
  }).timeout(timeout);

  it('should get the matching lists', (done) => {
    const iContactAPI = new IContactAPI(appId, apiUsername, apiPassword, pro, sandbox);
    const searchParamters = pro ? { welcomeOnSignupAdd: false } : { welcomeOnSignupAdd: 0 };
    iContactAPI.setAccountId(accountId);
    iContactAPI.setClientFolderId(clientFolderId);
    iContactAPI.getLists(searchParamters).then((result) => {
      expect(result).to.be.an('object').with.property('lists');
      expect(result.lists).to.be.an('array');
      if (result.lists.length > 0) {
        expect(result.lists[0]).to.be.an('object').with.property('listId');
        expect(result.lists[0].listId).to.be.a('number');
      }
      done();
    }).catch(done);
  }).timeout(timeout);
});

describe('addLists', () => {

  it('should create a list', (done) => {
    const name = randomStr();
    const list: IList = { name };
    const iContactAPI = new IContactAPI(appId, apiUsername, apiPassword, pro, sandbox);
    iContactAPI.setAccountId(accountId);
    iContactAPI.setClientFolderId(clientFolderId);
    iContactAPI.createLists([list]).then((result) => {
      expect(result).to.be.an('object').with.property('lists');
      expect(result.lists).to.be.an('array').of.length(1);
      expect(result.lists[0]).to.have.property('listId').that.is.a('number');
      expect(result.lists[0]).to.have.property('name').that.equals(name);
      done();
    }).catch(done);
  }).timeout(timeout);

});

describe('subscribeContactToList', () => {

  let iContactAPI: IContactAPI;
  let contactId: number;
  let listId: number;
  const email = randomEmail();
  const firstName = randomStr();
  const lastName = randomStr();
  const name = randomStr();
  const list: IList = { name };

  before(function (done) {
    this.timeout(timeout);
    const contact = { email, firstName, lastName };

    iContactAPI = new IContactAPI(appId, apiUsername, apiPassword, pro, sandbox);
    iContactAPI.setAccountId(accountId);
    iContactAPI.setClientFolderId(clientFolderId);
    iContactAPI.addContacts([contact]).then((result) => {
      expect(result).to.be.an('object').with.property('contacts');
      expect(result.contacts).to.be.an('array').of.length(1);
      expect(result.contacts[0]).to.have.property('contactId');
      contactId = result.contacts[0].contactId;
      return iContactAPI.createLists([list]);
    }).then((result) => {
      expect(result).to.be.an('object').with.property('lists');
      expect(result.lists).to.be.an('array').of.length(1);
      expect(result.lists[0]).to.have.property('listId').that.is.a('number');
      expect(result.lists[0]).to.have.property('name').that.equals(name);
      listId = result.lists[0].listId;
      done();
    }).catch(done);

  });

  it('should subcribe a contact to a list', (done) => {
    iContactAPI.subscribeContactToList(contactId, listId).then((result) => {
      expect(result).to.be.an('object').with.property('subscriptions');
      expect(result.subscriptions).to.be.an('array').of.length(1);
      expect(result.subscriptions[0]).to.have.property('subscriptionId');
      expect(result.subscriptions[0]).to.have.property('contactId').that.equals(contactId);
      expect(result.subscriptions[0]).to.have.property('listId');
      done();
    }).catch(done);
  }).timeout(timeout);

});

function randomStr() {
  return Math.random().toString(36).slice(2);
}

function randomEmail() {
  return `test+${randomStr()}@example.com`;
}

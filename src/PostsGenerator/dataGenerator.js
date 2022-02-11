const { v4: uuidv4 } = require("uuid");
const { faker } = require("@faker-js/faker");

class DataGenerator {
  constructor() {
    this.messagesList = [];
    this.timer = null;
    this.finish = false;
  }

  start() {
    const delay = Math.floor(Math.random() * (4000 - 1000)) + 1000;

    this.timer = setTimeout(() => {
      this.getMessage();
    }, delay);
  }

  getMessage() {
    const message = {
      id: uuidv4(),
      from: faker.internet.email(),
      subject: faker.lorem.words(),
      body: faker.lorem.paragraph(),
      received: Date.now(),
    };

    this.messagesList.push(message);

    if (this.messagesList.length > 5) {
      this.messagesList = [];
      clearTimeout(this.timer);
      //this.start();
    }
    
  }
}

module.exports = DataGenerator;

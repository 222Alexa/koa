const { v4: uuidv4 } = require("uuid");
const { faker } = require("@faker-js/faker");

class PostsManager {
  constructor() {
    this.postsList = [];
  }

  start() {
    this.timer = setTimeout(() => {
      this.genericPost();
    }, 200);
  }

  genericPost() {
    const message = {
      id: uuidv4(),
      author_id: uuidv4(),
      title: faker.hacker.phrase(),
      author: faker.name.findName(),
      avatar: faker.image.avatar(),
      image: faker.image.image(),
      created: Date.now(),
    };

    this.postsList.push(message);

    if (this.postsList.length > 3) {
      clearTimeout(this.timer);

      return;
    }
    this.start();
  }

  static random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  getPostIndexId(arr, id) {
    return arr.findIndex((item) => item.id === id);
  }

  createdPost(post) {
    const message = {
      id: uuidv4(),
      author_id: post.author_id,
      title: post.title,
      author: post.userName,
      avatar: faker.image.avatar(),
      image: faker.image.image(),
      created: Date.now(),
    };

    this.postsList.push(message);
  }
  upDatePosts(post, id) {
    const idx = this.getPostIndexId(this.postsList, id);

    if (idx === -1) {
      return;
    }

    this.postsList[idx].title = post.title;
  }

  deletePost(arr, id) {
    const idx = this.getPostIndexId(this.postsList, id);
    
    return !!arr.splice(idx, 1);
  }
}

module.exports = PostsManager;

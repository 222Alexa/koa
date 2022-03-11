const { v4: uuidv4 } = require("uuid");
const { faker } = require("@faker-js/faker");

class PWCGenerator {
  constructor() {
    this.postsList = [];
    this.commentsList = [];
    this.timer = null;
    this.finish = false;
  }

  start() {
    this.timer = setTimeout(() => {
      this.getPost();
    }, 200);
  }

  getPost() {
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

    if (this.postsList.length > 9) {
      clearTimeout(this.timer);
      //комменты сгенерируются
      // ко всем постам после того, как
      //заполнен this.postsList
      this.commentsGenerator();
      return;
    }
    this.start();
  }

  static random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  getComment(post_id) {
    const comment = {
      id: uuidv4(),
      post_id: post_id,
      author_id: uuidv4(),
      title: faker.hacker.phrase(),
      author: faker.name.findName(),
      avatar: faker.image.avatar(),
      content: faker.hacker.phrase(),
      created: Date.now(),
    };

    return comment;
  }
  /**
   * генерирует комментарии к постам
   *
   */

  commentsGenerator() {
    this.postsList.forEach((elem) => {
      const comments = [];
      let count = PWCGenerator.random(0, 3);
      if (count === 0) {
        return;
      }

      for (let i = 1; i <= count; i++) {
        const comment = this.getComment(elem.id);
        comments.push(comment);
      }

      this.commentsList.push(comments);
    });
  }

  /**
   *
   * @param {*} id
   * @param {*} i
   * достает вложенные массивы комментариев к постам
   * фильтует по id поста
   * если фильтрованный массив больше заданной длины i
   * возвращает урезанный результат
   */

  filteredComments(id, i) {
    const commentsArr = this.commentsList.flat();

    const result = commentsArr.filter((elem) => elem.post_id === id);

    if (result.length > i) {
      return result.slice(0, i);
    }
    return result;
  }
}

module.exports = PWCGenerator;

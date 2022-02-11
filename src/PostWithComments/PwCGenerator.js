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
      this.commentsGenerator();
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
    //не получилось сделать изначально
    // заданную длину массива(до 3 элементов)
    //не отловить ошибку, которая позволяет к посту сгенерировать 8 комментов
    let count = 0;
    const comments = [];
    this.postsList.forEach((elem) => {
      if (PWCGenerator.random(0, 3) === 0 || count > 3) {
        return;
      }
      count++;

      setTimeout(() => {
        const item = this.getComment(elem.id);

        comments.push(item);
       
      }, 100);
    });

    this.commentsList.push(comments);
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
    if (result.length > i) result.splice(0, result.length - i);
    return result;
  }

}

module.exports = PWCGenerator;

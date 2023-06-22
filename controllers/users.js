const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const EmailError = require('../errors/email-err');
const ServerError = require('../errors/server-err');
const AuthError = require('../errors/auth-err');

const {
  STATUS_OK,
  STATUS_CREATED,
} = require('../utils/constants');

module.exports.getAllUsers = (req, res, next) => User.find({})
  .then((users) => res.status(STATUS_OK).send(users))
  .catch(() => {
    throw new ServerError('Внутренняя ошибка сервера');
  })
  .catch(next);

module.exports.getUserId = (req, res, next) => {
  const { userId } = req.params;
  return User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      return res.status(STATUS_OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Введен неверный id');
      }
      throw new ServerError('Внутренняя ошибка сервера');
    })
    .catch(next);
};

module.exports.getUserInfo = (req, res, next) => {
  User.findOne({ _id: req.user._id })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      res.status(STATUS_OK).send(user);
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.status(STATUS_CREATED).send(user))
    .catch((err) => {
      if (err.code === 11000) {
        throw new EmailError(`Пользователь с такой электронной почтой ${email} уже зарегистрирован`);
      }
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Неверный запрос');
      }
      throw new ServerError('Внутренняя ошибка сервера');
    })
    .catch(next);
};

module.exports.updateProfile = (req, res, next) => {
  const userId = req.user._id;
  const { name, about } = req.body;
  return User.findByIdAndUpdate(
    userId,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      return res.status(STATUS_OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Произошла ошибка валидации');
      }
      throw new ServerError('Внутренняя ошибка сервера');
    })
    .catch(next);
};

module.exports.updateAvatar = (req, res, next) => {
  const userId = req.user._id;
  const { avatar } = req.body;
  return User.findByIdAndUpdate(
    userId,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      return res.status(STATUS_OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Неверный запрос');
      }
      throw new ServerError('Внутренняя ошибка сервера');
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'some-secret-key',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch(() => {
      throw new AuthError('Неправильные почта или пароль');
    })
    .catch(next);
};

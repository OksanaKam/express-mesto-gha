const User = require('../models/user');

const {
  STATUS_OK,
  STATUS_CREATED,
  ERROR_CODE,
  STATUS_NOT_FOUND,
  STATUS_ERROR_SERVER,
} = require('../utils/constants');

module.exports.getAllUsers = (req, res) => User.find({})
  .then((users) => res.status(STATUS_OK).send(users))
  .catch(() => res.status(STATUS_ERROR_SERVER).send({ message: 'Внутренняя ошибка сервера' }));

module.exports.getUserId = (req, res) => {
  const { userId } = req.params;
  return User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(STATUS_NOT_FOUND).send({ message: 'Запрашиваемый пользователь не найден' });
      }
      return res.status(STATUS_OK).send(user);
    })
    .catch(() => res.status(STATUS_ERROR_SERVER).send({ message: 'Внутренняя ошибка сервера' }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  return User.create({ name, about, avatar })
    .then((user) => res.status(STATUS_CREATED).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE).send({ message: 'Неверный запрос' });
      }
      return res.status(STATUS_ERROR_SERVER).send({ message: 'Внутренняя ошибка сервера' });
    });
};

module.exports.updateProfile = (req, res) => {
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
        return res.status(STATUS_NOT_FOUND).send({ message: 'Запрашиваемый пользователь не найден' });
      }
      return res.status(STATUS_OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE).send({ message: 'Неверный запрос' });
      }
      return res.status(STATUS_ERROR_SERVER).send({ message: 'Внутренняя ошибка сервера' });
    });
};

module.exports.updateAvatar = (req, res) => {
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
        return res.status(STATUS_NOT_FOUND).send({ message: 'Запрашиваемый пользователь не найден' });
      }
      return res.status(STATUS_OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE).send({ message: 'Неверный запрос' });
      }
      return res.status(STATUS_ERROR_SERVER).send({ message: 'Внутренняя ошибка сервера' });
    });
};

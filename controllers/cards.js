const Card = require('../models/card');

const {
  STATUS_OK,
  STATUS_CREATED,
  ERROR_CODE,
  STATUS_NOT_FOUND,
  STATUS_ERROR_SERVER,
} = require('../utils/constants');

module.exports.getAllCards = (req, res) => Card.find({})
  .then((cards) => res.status(STATUS_OK).send(cards))
  .catch(() => res.status(STATUS_ERROR_SERVER).send({ message: 'Внутренняя ошибка сервера' }));

module.exports.deleteCardId = (req, res) => {
  const { cardId } = req.params;
  return Card.findById(cardId)
    .then((card) => {
      if (!card) {
        return res.status(STATUS_NOT_FOUND).send({ message: 'Запрашиваемый ресурс не найден' });
      }
      return res.status(STATUS_OK).send(card);
    })
    .catch(() => res.status(STATUS_ERROR_SERVER).send({ message: 'Внутренняя ошибка сервера' }));
};

module.exports.createCard = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;

  return Card.create({ name, link, owner })
    .then((card) => res.status(STATUS_CREATED).send(card))
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE).send({ message: 'Неверный запрос' });
      }
      res.status(STATUS_ERROR_SERVER).send({ message: 'Внутренняя ошибка сервера' });
    });
};

module.exports.setLikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .then((card) => {
    if (!card) {
      return res.status(STATUS_NOT_FOUND).send({ message: 'Запрашиваемый ресурс не найден' });
    }
    return res.status(STATUS_CREATED).send(card);
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      return res.status(ERROR_CODE).send({ message: 'Неверный запрос' });
    }
    return res.status(STATUS_ERROR_SERVER).send({ message: 'Внутренняя ошибка сервера' });
  });

module.exports.deleteLikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .then((card) => {
    if (!card) {
      return res.status(STATUS_NOT_FOUND).send({ message: 'Запрашиваемый ресурс не найден' });
    }
    return res.status(STATUS_OK).send(card);
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      return res.status(ERROR_CODE).send({ message: 'Неверный запрос' });
    }
    return res.status(STATUS_ERROR_SERVER).send({ message: 'Внутренняя ошибка сервера' });
  });

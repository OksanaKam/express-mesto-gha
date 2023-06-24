const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ForbiddenError = require('../errors/forbidden-err');

const {
  STATUS_OK,
  STATUS_CREATED,
} = require('../utils/constants');

module.exports.getAllCards = (req, res, next) => Card.find({})
  .then((cards) => res.status(STATUS_OK).send(cards))
  .catch(next);

module.exports.createCard = (req, res, next) => {
  const owner = req.user._id;
  const { name, link } = req.body;

  return Card.create({ name, link, owner })
    .then((card) => res.status(STATUS_CREATED).send(card))
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Неверный запрос'));
      }
      next(err);
    });
};

module.exports.deleteCardId = (req, res, next) => {
  const { cardId } = req.params;
  return Card.findById(cardId)
    .orFail(() => new NotFoundError('Нет карточки с таким id'))
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Нет прав удалить эту карточку');
      }
      return Card.findByIdAndRemove(cardId)
        .then((item) => res.status(STATUS_OK).send({ data: item }))
        .catch((err) => {
          if (err.name === 'CastError') {
            next(new BadRequestError('Введен некорректный id карточки'));
          }
          next(err);
        });
    })
    .catch(next);
};

module.exports.setLikeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .then((card) => {
    if (!card) {
      throw new NotFoundError('Нет карточки с таким id');
    }
    return res.status(STATUS_CREATED).send(card);
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      next(new BadRequestError('Введен некорректный id карточки'));
    }
    next(err);
  });

module.exports.deleteLikeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .then((card) => {
    if (!card) {
      throw new NotFoundError('Нет карточки с таким id');
    }
    return res.status(STATUS_OK).send(card);
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      next(new BadRequestError('Введен некорректный id карточки'));
    }
    next(err);
  });

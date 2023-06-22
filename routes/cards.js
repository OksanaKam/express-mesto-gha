const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { REGEX_AVATAR } = require('../utils/constants');
const {
  getAllCards,
  deleteCardId,
  createCard,
  setLikeCard,
  deleteLikeCard,
} = require('../controllers/cards');

router.get('/cards', getAllCards);

router.delete('/cards/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex(),
  }),
}), deleteCardId);

router.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(REGEX_AVATAR),
  }),
}), createCard);

router.put('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex(),
  }),
}), setLikeCard);

router.delete('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex(),
  }),
}), deleteLikeCard);

module.exports = router;

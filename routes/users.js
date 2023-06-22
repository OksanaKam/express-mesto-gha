const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { REGEX_AVATAR } = require('../utils/constants');
const {
  getAllUsers,
  getUserId,
  getUserInfo,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

router.get('/users', getAllUsers);

router.get('/users/:userId', celebrate({
  body: Joi.object().keys({
    userId: Joi.string().required().length(24).hex(),
  }),
}), getUserId);

router.get('/users/me', getUserInfo);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateProfile);

router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(REGEX_AVATAR),
  }),
}), updateAvatar);

module.exports = router;

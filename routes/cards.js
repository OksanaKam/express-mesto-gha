const router = require('express').Router();
const { getAllCards,
        deleteCardId,
        createCard,
        setLikeCard,
        deleteLikeCard
} = require('../controllers/cards');

router.get('/cards', getAllCards);

router.delete('/cards/:cardId', deleteCardId);

router.post('/cards', createCard);

router.put('/cards/:cardId/likes', setLikeCard);

router.delete('/cards/:cardId/likes', deleteLikeCard);

module.exports = router;
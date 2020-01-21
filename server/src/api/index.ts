import * as express from 'express';
const router = express.Router();

router.get('/avatar/:nickname', (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.redirect(`https://www.instagram.com/${req.params.nickname}/?__a=1`)
});
 
export default router;

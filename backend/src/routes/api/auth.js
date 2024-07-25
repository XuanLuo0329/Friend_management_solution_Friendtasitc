import { Router } from 'express';
import { User, validate } from '#db/user.schema';
import verifyJWT from "#middleware/JWTAuth";
import bcrypt from 'bcrypt';

const router = Router();

router.post('/register', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const user = await User.findOne({ email: req.body.email });
    if (user) return res.status(409).json({ message: 'User with given email already exists!' });

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    await new User({ ...req.body, password: hashPassword }).save();
    res.status(201).send();
});

router.post('/login', async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(401).send({ message: 'Invalid Email or Password' });

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(401).send({ message: 'Invalid Email or Password' });

    const token = user.generateAuthToken();
    res.status(200).json({ token: token });
});

router.get('/verifyToken', verifyJWT(), (req, res) => {
    res.status(200).send();
});

export default router;
import { Router } from 'express';
import authRoute from './userAuth.route';
import octoRoute from './octoPrintWrapper.route';
import healthRoute from './printerHealth.route';

const router = Router();

// Combine all route modules
router.use('/auth', authRoute);
router.use('/printer', octoRoute);
router.get('/status', (req, res) => {
    console.log("server is live");
    res.status(200).json({'message': "server is live"});
})
router.use('/printer', healthRoute);
// router.use('/users', userRoutes); // Routes for user-related operations
// router.use('/products', productRoutes); // Routes for products

export default router;

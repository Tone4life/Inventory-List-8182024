import express from 'express';
import csrf from 'csurf';

const router = express.Router();
const csrfProtection = csrf({ cookie: true });

const customParamRegex = /^[a-zA-Z0-9_]+$/;

router.get('/:customParam', csrfProtection, (req, res) => {
    res.cookie('XSRF-TOKEN', req.csrfToken());
    const { customParam } = req.params;

    if (!customParamRegex.test(customParam)) {
        return res.status(400).send('Invalid parameter');
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Exceptional Movers Inventory List</title>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
            <link rel="stylesheet" href="style.css">
            <script src="https://maps.googleapis.com/maps/api/js?key=${apiKey}"></script>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
        </head>
        <body>
            <div class="container">
                <h1 class="text-center text-danger">Household Goods Moving Inventory List</h1>
                <div class="main-content">
                    <div class="left-side">
                        <div class="step">
                            <h2>Step 1: Personal Information</h2>
                            <div class="form-group">
                                <label for="clientName">Name:</label>
                                <input type="text" id="clientName" name="clientName" class="form-control">
                                <span id="clientName-error" class="error-message"></span>
                            </div>
                            <div class="form-group">
                                <label for="origin">Origin Address <i class="fas fa-info-circle"></i></label>
                                <input type="text" id="origin" name="origin" class="form-control">
                                <span id="origin-error" class="error-message"></span>
                            </div>
                            <div class="form-group">
                                <label for="destination">Destination Address:</label>
                                <input type="text" id="destination" name="destination" class="form-control">
                                <span id="destination-error" class="error-message"></span>
                            </div>
                            <div class="form-group">
                                <label for="clientEmail">Email:</label>
                                <input type="email" id="clientEmail" name="clientEmail" class="form-control">
                                <span id="email-error" class="error-message"></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.6/dist/umd/popper.min.js"></script>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.min.js"></script>
        </body>
        </html>
    `);
});

export default router;

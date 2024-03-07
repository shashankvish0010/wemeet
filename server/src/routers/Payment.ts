import express from 'express'
const router = express.Router()
import Stripe from 'stripe';

const stripe = new Stripe('sk_test_51OZfGTSDLOYDoEuJJrmO9Spf2IQ8PbZtTYb2btyDESNNu1H4Ro5Cc1x32QRBG4QVVX4um77wAO9IobaQ5rdwHQHQ00Iy82r1mv')
router.post('/checkout/plan', async (req, res) => {
    var { plan_price, plan_name } = req.body;
    try {
        const product = await stripe.products.create({
            name: plan_name
        });
        if(product){
            var price = await stripe.prices.create({
                product: `${product.id}`,
                unit_amount: plan_price * 100,
                currency: 'usd'
            })
        
        if(price.id){
            const session = await stripe.checkout.sessions.create({
                mode: "payment",
                payment_method_types: ["card"],
                    line_items: [
                        {
                            price: `${price.id}`,
                            quantity: 1
                        }
                    ],
                success_url: 'http://localhost:5173/success',
                cancel_url: 'http://localhost:5173/cancel',
            })            
            res.json({ success: true, url: session.url })
        }
    }
    } catch (error) {
        console.log(error);
    }
})

module.exports = router
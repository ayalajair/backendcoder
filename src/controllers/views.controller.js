const { validationResult } = require('express-validator')
const { productsService, cartsService, usersService } = require('../service')

class ViewsController {
    
    showProducts = async (req,res)=>{
        // Verificar si el usuario ha iniciado sesión
        let user = req.user

        // Redirigir al usuario a la página de inicio de sesión si no está autenticado
        if (!user) {
            res.redirect('/')
        }
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res
            .status(400)
            .send({message: 'Error en los parametros de entrada', errors});
        }
        const {
            limit = 10,
            page = 1, 
            priceSort = null, 
            category = null, 
            availability = null
        } = req.query
        
        const filter = {}
        if (category) {
            filter.category = category
        }
        if (availability) {
            filter.availability = availability
        }

        let sort = null

        if (priceSort === 'asc') {
            sort = { price: 1 }
        }
        if (priceSort === 'desc') {
            sort = { price: -1 }
        }

        let productList = await productsService.getAll(limit, page, sort, filter)
        
        user = await usersService.getUserByEmail(req.user.email)

        let data = {
            dataProducts: productList,
            dataUser: user,
            style: 'home.css',
        }

        res.render('products', data)
    }

    showCart = async (req, res) => {
        let { cid } = req.params
        let cart = await cartsService.getCartById(cid)
        let data = {
            dataCart: cart,
        }
        res.render('cart', data)
    }

    showRealTime = async (req, res) => {
        let limit = req.query.limit
        let productList = await productsService.getAll(limit)
        res.render('realTimeProducts',productList)
    }

    showChat = (req, res) => {
        res.render('chat',{})
        }

    showLogin = async (req, res) => {
        let user = req.user
        if (!user) {
            return res.render('login',{
                style: 'home.css'
            })            
        }
        return res.redirect('/products')
    }

    showRegister = async (req, res) => {
        res.render('register',{
            style: 'home.css'
        })
    }

    showForgotPassword = async (req, res) => {
        res.render('forgotPassword',{
            style: 'home.css'
        })
    }

    showResetPassword = async (req, res) => {
        let {token} = req.params
        console.log(token)
        let data = {
            token: token,
            style: 'home.css',
        }
        res.render('resetPassword', data)

    }
}

module.exports = new ViewsController()
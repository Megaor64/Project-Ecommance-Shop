import Product from "../models/productSchema.js"

const createProduct = async (req, res, next) => {
    try {
        if (req.file) {
            const result = await uploadToCloudinary(req.file.buffer, "movies")
            req.body.imageUrl = result.secure_url
            req.body.imagePublicId = result.public_id
        }
        const product = await Product.create({
            name: req.body.name,
            description: req.body.description ?? '',
            price: req.body.price,
            category: req.body.category ?? '',
            stock: req.body.stock ?? 0,
            isActive: req.body.isActive !== false,
        })
        res.status(201).json({
            status: 201,
            message: "Product created succesfuly",
            data: product
        })
    }
    catch (error) {
        next(error),
            res.status(400).json({
                status: 400,
                message: "Can't create",
                data: null
            })
    }
}

const listOfProducts = async (req, res, next) => {
    try {
        const product = await Product.find({ isActive: true }).sort({ createdAt: -1 });
        res.status(200).json({
            status: 200,
            message: "These are all the products",
            data: product
        })
    } catch (error) {
        next(error)
        res.status(400).json({
            status: 400,
            message: "Didn't found the products",
            data: null
        })
    }
}
const getProductById = async (req, res, next) => {
    try {
        const { id } = req.params
        const product = await Product.findOne({ _id: id })
        if (!product.isActive) {
            return res.status(404).json({
                status: 404,
                message: "Product not found",
                data: null
            })
          }
      
        res.status(200).json({
            status: 200,
            message: "Got the product",
            data: product
        })
    } catch (error) {
        next(error)
        res.status(400).json({
            status: 400,
            message: "Product not found",
            data: null
        })
    }
}
const updateProduct = async (req, res, next) => {
    try {
        const { id } = req.params
        const product = await Product.findByIdAndUpdate(id, req.body)
        res.status(200).json({
            status: 200,
            message: `Updated product with id: ${id}`,
            data: product
        })
    } catch (error) {
        next(error)
        res.status(400).json({
            status: 400,
            message: "Falied updating",
            data: null
        })
    }
}
const deleteProduct = async (req, res, next) => {
    try {
        await Product.findByIdAndDelete(req.params.id)
        res.status(200).json({
            status: 200,
            message: `Deleted product with id: ${req.params.id}`,
            data: null
        })
    } catch (error) {
        next(error)
        res.status(400).json({
            status: 400,
            message: "Falied deleting product",
            data: null
        })
    }
}

export {
    createProduct,
    listOfProducts,
    getProductById,
    updateProduct,
    deleteProduct
}
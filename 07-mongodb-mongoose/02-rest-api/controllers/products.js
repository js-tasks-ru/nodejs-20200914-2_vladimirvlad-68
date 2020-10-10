module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
    const subcategory = ctx.request.query.subcategory;

    if (!subcategory) {
        return next();
    }

    const products = await Product.find({ subcategory: subcategory });

    ctx.body = {products: products};
};

module.exports.productList = async function productList(ctx, next) {
    const products = await Product.find({});
    ctx.body = {products};
};

module.exports.productById = async function productById(ctx, next) {
    const productId = ctx.params.id;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        ctx.throw(400);
    }

    const product = await Product.findById(productId);

    if (!product) {
        ctx.throw(404);
    }

    ctx.body = {
        product,
    };
    return next();
};


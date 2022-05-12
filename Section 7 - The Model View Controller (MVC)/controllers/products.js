const products = [];

exports.getAddProduct = (req, res, next) => {
  // res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
  res.render("add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true,
  });
};

exports.postAddProduct = (req, res, next) => {
  products.push({ title: req.body.title });
  res.redirect("/");
};

exports.getProducts = (req, res, next) => {
  // console.log('shop.js', adminData.products);
  // res.sendFile(path.join(rootDir, 'views', 'shop.html'));

  // this will use the default template engine declared in the app.js file
  // we don't have to construct a path to the folder since we defined that all views are in the views folder
  // the second argument can be the data that we would like to pass to the template
  res.render("shop", {
    products: products,
    pageTitle: "My Shop",
    path: "/",
    hasProducts: products.length > 0,
    activeShop: true,
    productCSS: true,
  });
};

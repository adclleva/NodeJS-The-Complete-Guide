const fs = require("fs"); // core node module
const path = require("path"); // we use this path module so we can accomodate all operating systems

const PDFDocument = require("pdfkit");

const Product = require("../models/product");
const Order = require("../models/order");

const ITEMS_PER_PAGE = 1;

exports.getProducts = (req, res, next) => {
  // we set the query param within the view and converted to a num
  const page = +req.query.page || 1; // if query param is undefined, it defaults to 1

  let totalItems;

  Product.find()
    .countDocuments()
    .then((productsCount) => {
      totalItems = productsCount;

      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE) // skips the items of the previous pages
        .limit(ITEMS_PER_PAGE); // limits the amount of data presented
    })
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "Products",
        path: "/products",
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems, //  next page logic
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
      });
    })
    .catch((err) => {
      // *** an express way of resolving errors
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product.title,
        path: "/products",
      });
    })
    .catch((err) => {
      // *** an express way of resolving errors
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getIndex = (req, res, next) => {
  // we set the query param within the view and converted to a num
  const page = +req.query.page || 1; // if query param is undefined, it defaults to 1

  let totalItems;

  Product.find()
    .countDocuments()
    .then((productsCount) => {
      totalItems = productsCount;

      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE) // skips the items of the previous pages
        .limit(ITEMS_PER_PAGE); // limits the amount of data presented
    })
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems, //  next page logic
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
      });
    })
    .catch((err) => {
      // *** an express way of resolving errors
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .execPopulate()
    .then((user) => {
      const products = user.cart.items;
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: products,
      });
    })
    .catch((err) => {
      // *** an express way of resolving errors
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      console.log(result);
      res.redirect("/cart");
    })
    .catch((err) => {
      // *** an express way of resolving errors
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .removeFromCart(prodId)
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => {
      // *** an express way of resolving errors
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .execPopulate()
    .then((user) => {
      const products = user.cart.items.map((i) => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user,
        },
        products: products,
      });
      return order.save();
    })
    .then((result) => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => {
      // *** an express way of resolving errors
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.user._id })
    .then((orders) => {
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders: orders,
      });
    })
    .catch((err) => {
      // *** an express way of resolving errors
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;

  Order.findById(orderId)
    .then((order) => {
      // order validation
      if (!order) {
        return next(new Error("No order found."));
      }

      // userId match validation
      if (order.user.userId.toString() !== req.user._id.toString()) {
        return next(new Error("Unauthorized"));
      }

      const invoiceName = "invoice-" + orderId + ".pdf";
      const invoicePath = path.join("data", "invoices", invoiceName);

      const pdfDocument = new PDFDocument(); // this is a readable stream

      res.setHeader("Content-Type", "application/pdf"); // this enables us to open the file within the browser
      res.setHeader("Content-Disposition", `inline; filename="${invoiceName}"`); // defines how the content should be served to the client

      pdfDocument.pipe(fs.createWriteStream(invoicePath));
      pdfDocument.pipe(res);

      pdfDocument.fontSize(26).text("Invoice", {
        underline: true,
      });

      pdfDocument.text("------------------------");

      let totalPrice = 0;

      order.products.forEach((prod) => {
        totalPrice += prod.quantity * prod.product.price;
        pdfDocument.fontSize(14).text(`${prod.product.title} - ${prod.quantity} x $${prod.product.price}`);
      });

      pdfDocument.text("------------------------");
      pdfDocument.fontSize(20).text(`Total Price: $${totalPrice}`);
      pdfDocument.end(); // to tell node that we are done writing to the stream

      // *** for bigger files, fs.readFile() may not be a good option and we should be streaming our response data
      // fs.readFile(invoicePath, (err, data) => {
      //   if (err) {
      //     return next(err); // run the default middlewar error handler
      //   }

      //   res.setHeader("Content-Type", "application/pdf"); // this enables us to open the file within the browser

      //   res.setHeader("Content-Disposition", `inline; filename="${invoiceName}"`); // defines how the content should be served to the client

      //data will be in a form of a buffer
      //   res.send(data);
      // });

      // *** example below is for reading static files from our project
      // const file = fs.createReadStream(invoicePath);

      // res.setHeader("Content-Type", "application/pdf"); // this enables us to open the file within the browser
      // res.setHeader("Content-Disposition", `inline; filename="${invoiceName}"`); // defines how the content should be served to the client

      /**
       * the response will be steamded to the browser and will contain the data and the data will basically be
       * downloaded by the browser step by step for large files, which is good because node never has to pre-load all the
       * data into memory but streams it into the client on the fly and stored into one chunk of data.
       * we work with the chunks and the buffers basically gives us access to these chunks and
       * we forward them to the browser which is able to concatenate the incoming data pieces into the final file
       */
      // file.pipe(res);
    })
    .catch((err) => {
      // *** an express way of resolving errors
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

const express = require("express");
const async = require("hbs/lib/async");
const router = express.Router();
const adminHelper = require("../helpers/admin-helpers");
const path = require("path");
const flash = require("connect-flash");
const admin = require("../models/admin");
// const { redirect } = require("express/lib/response");
const verifyadmin = (req, res, next) => {
  if (req.session.admin) {
    next();
  } else {
    res.redirect("/admin");
  }
};

/* GET home page. */
router.get("/", function (req, res, next) {

  res.render("admin/admin-login", {
    err: req.session.adminloggErr,
    admin,
    layout: false,
  });
  req.session.adminloggErr = null;
});
// router.get('/', function(req, res, next) {
//   if(req.session.adminlogIn){
//     res.redirect('admin/adminDashboard')
//   }else{
//     res.render('admin/admin-login', {"loginErr":req.session.adminLoginErr,admin:true,layout:false});
//     req.session.adminLoginErr=false
//   }

// });
router.post("/adminLogin", (req, res) => {
  adminHelper
    .doadminlogin(req.body)
    .then((response) => {
      req.session.adminlogin = true;
      req.session.admin = response.admin;
      res.redirect("/admin/adminDashboard");
    })
    .catch((err) => {
      req.session.adminloggErr = err.msg;
      res.redirect("/admin");
    });
});

router.get("/adminDashboard", verifyadmin, (req, res, next) => {
  const adminvalue = req.session.admin;
  res.render("admin/admin-dashboard", {
    admin: true,
    adminvalue,
    layout: 'adminlayout',
  });
});

router.get("/manage-user", function (req, res) {
  adminHelper.getAllUsers().then((userinfo) => {
    console.log(userinfo);
    res.render("admin/manage-user", { layout: false, userinfo });
  });
});
router.get("/blockUser/:id", (req, res) => {
  const userId = req.params.id;
  adminHelper.blockUser(userId).then((response) => {
    res.redirect("/admin/manage-user");
  });
});
router.get("/unblockUser/:id", (req, res) => {
  const userId = req.params.id;
  adminHelper.unblockUser(userId).then((response) => {
    res.redirect("/admin/manage-user");
  });
});

router.get("/productDetails", async (req, res) => {
  const products = await adminHelper.getallproducts();
  console.log(products);
  const alert = req.flash("msg");
  res.render("admin/products-manege", { alert, products, layout: false });
});

router.get("/addcategory", (req, res) => {
  adminHelper.getallcategory().then((allcategory) => {
    console.log(allcategory);
    res.render("admin/add_category", {
      allcategory,
      layout: false,
      err1: req.session.loge,
      err2: req.session.loggE,
    });
    req.session.loge = null;
    req.session.loggE = null;
  });
});
router.post("/addcategory", (req, res) => {
  console.log(req.body);
  adminHelper
    .addcategory(req.body)
    .then((Response) => {
      res.redirect("/admin/addcategory");
    })
    .catch((error) => {
      req.session.loggE = error.msg;
      res.redirect("/admin/addcategory");
    });
});
router.post("/addsubcategory", (req, res) => {
  console.log(req.body);
  adminHelper
    .addsubcategory(req.body)
    .then((Response) => {
      res.redirect("/admin/addcategory");
    })
    .catch((err) => {
      req.session.loge = err.msg;
      res.redirect("/admin/addcategory");
    }); 
});
router.get("/add_product", async (req, res) => {
  const category = await adminHelper.getallcategory();
  const subcategory = await adminHelper.getallsubcategory();
  res.render("admin/add_products", {
    category,
    subcategory,
    admin: true,
    layout: false,
  });
});

router.post("/addProduct", adminHelper.upload.single("image"), (req, res) => {
  console.log("add product");
  adminHelper.addProduct(req.body, req.file).then((Response) => {
    console.log("added");
    console.log(Response); 
    res.redirect("/admin/productDetails");
  }).catch((error)=>{

  })
});
router.get("/deleteProduct/:id", (req, res) => {
  console.log(req.params.id);
  const proId = req.params.id;
  adminHelper.deleteProduct(proId).then((response) => {
    req.session.removedProduct = response;
    // req.flash('msg', 'Product Deleted successfully!')
    res.redirect("/admin/productDetails");
  });
  console.log(proId);
});
router.get("/editProduct/:id", async (req, res) => {
  let product = await adminHelper.getProductDetails(req.params.id);
  console.log(product);
  const category = await adminHelper.getallcategory();
  const subcategory = await adminHelper.getallsubcategory();
  console.log("got all details");
  console.log(product.bookName);
  res.render("admin/editProduct", {
    subcategory,
    category,
    product,
    admin: true,
    layout: false,
  });
});
router.post(
  "/editProduct/:id",
  adminHelper.upload.single("image"),
  async (req, res) => {
    let imageData = await adminHelper.getProductDetails();
    let main_img = req.file ? req.file.filename : imageData[0];
    console.log(main_img);
    await adminHelper
      .updateProduct(req.params.id, req.body, main_img)
      .then((response) => {
        console.log("succes");
        req.flash("msg", response.updateProduct.bookName, response.msg);
        res.redirect("/admin/productDetails");
      });
  }       
);
router.get("/order-manegement", (req, res) => {
  console.log("fsjh");
  adminHelper.allorders().then((response) => {
    //console.log(response);
    const allorders = response;
    res.render("admin/order_manage", { allorders, admin: true, layout: false });
  });
});
router.get("/viewOrderProducts/:id", (req, res) => {
  adminHelper.orderdetails(req.params.id).then((response) => {
   
    const order = response;
    res.render("admin/OrderDetails", { admin: true, order ,layout: false});
  });
});
router.post("/changeOrderStatus", (req, res) => {
  console.log("haiiiii")
  console.log(req.body);
  console.log("uyujkl;;");
  adminHelper.changeOrderStatus(req.body).then((response) => {
    res.redirect("/admin/order-manegement");
  });
});
router.get('/coupon-manegement',(req,res)=>{
  adminHelper.getAllCoupons().then((response)=>{
    console.log(response);
    const AllCoupons=response
    res.render('admin/coupen_manage',{AllCoupons,layout:false})
  }) 
})  

router.get("/deletecoupon/:id", (req, res) => {
  console.log(req.params.id);
  const proId = req.params.id;
  adminHelper.Deletecoupon(proId).then((response) => {
    req.session.removedProduct = response;
    res.redirect("/admin/coupon-manegement");
  });
  console.log(proId);
});

router.get('/addcoupon',(req,res)=>{
  
  res.render('admin/addcoupon',{layout:false})
})
router.post('/AddCoupon',(req,res)=>{
  adminHelper.AddCoupon(req.body).then(()=>{
    res.redirect('/admin/coupon-manegement')
  })
}) 

router.get("/adminlogout", (req, res) => {
  req.session.destroy();
  res.redirect("/admin");
});
module.exports = router;

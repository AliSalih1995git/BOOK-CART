const db = require("../config/connection");

const bcrypt = require("bcrypt");

const adminDataModel = require("../models/admin");
const category = require("../models/category");
const Sub_Category = require("../models/sub_category");
const userDataModel = require("../models/user");
const multer = require("multer");
const products = require("../models/products");
const ordermodel = require("../models/order");
const couponmodel = require("../models/Coupen");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/upload");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "--" + file.originalname);
  },
});
let upload = multer({
  storage: storage,
});

module.exports = {
  doadminlogin: (adminDataa) => {
    console.log(adminDataa);
    return new Promise(async (resolve, reject) => {
      let response = {};
      const admin = await adminDataModel.findOne({ email: adminDataa.email });

      if (admin) {
        console.log("admin Email true");
        bcrypt.compare(adminDataa.password, admin.password).then((result) => {
          if (result) {
            console.log("admin login true");
            response.admin = admin;
            response.status = true;
            resolve(response);
          } else {
            console.log("login error");
            reject({
              status: false,
              msg: "Your username or password is incorrect",
            });
          }
        });
      } else {
        console.log("Login Failed");
        reject({
          status: false,
          msg: "Your username or password is incorrect",
        });
      }
    });
  },
  getAllUsers: () => {
    return new Promise(async (resolve, reject) => {
      let userinfo = await userDataModel.find().lean();
      resolve(userinfo);
    });
  },
  blockUser: (userId) => {
    return new Promise(async (resolve, reject) => {
      const user = await userDataModel.findByIdAndUpdate(
        { _id: userId },
        { $set: { block: true } },
        { upsert: true }
      );
      resolve(user);
    });
  },
  unblockUser: (userId) => {
    return new Promise(async (resolve, reject) => {
      const user = await userDataModel.findByIdAndUpdate(
        { _id: userId },
        { $set: { block: false } },
        { upsert: true }
      );
      resolve(user);
    });
  },

  addcategory: (data) => {
    return new Promise(async (resolve, reject) => {
      const categoryname = data.category;
      console.log(data.category);
      const categorydata = await category.findOne({
        categoryName: categoryname,
      });
      if (categorydata) {
        reject({ status: false, msg: "category already taken" });
      } else {
        const addcategory = await new category({
          categoryName: categoryname,
        });
        await addcategory.save();
        resolve(addcategory);
      }
    });
  },
  getallcategory: () => {
    return new Promise(async (resolve, reject) => {
      const allcategory = await category.find({}).lean();
      resolve(allcategory);
    });
  },
  addsubcategory: (Data) => {
    console.log("ddddddddddddddddddddddddddddddddddddd");
    console.log(Data);
    return new Promise(async (resolve, reject) => {
      const sub_categoryname = Data.Subcategory;
      const sub_categorydata = await Sub_Category.findOne({
        Sub_category: sub_categoryname,
        category:Data._id
      });
      const categorydata = await category.findOne({
        categoryName: Data.category,
      });
      if (sub_categorydata) {
        reject({ status: false, msg: "Sub category already taiken" });
      } else {
        const addsubcategory = await new Sub_Category({
          Sub_category: sub_categoryname,
          category: categorydata._id,
        });
        await addsubcategory.save(async (err, result) => {
          if (err) {
            reject({ msg: "sub category not added" });
          } else {
            resolve({ result, msg: "subcategory" });
          }
        });
      }
    });
  },
  getallsubcategory: () => {
    return new Promise(async (resolve, reject) => {
      const allsubcategory = await Sub_Category.find({}).lean();
      resolve(allsubcategory);
    });
  },
  getallSubcategory: () => {
    return new Promise(async (resolve, reject) => {
      const allsubcategory = await Sub_Category.find({}).limit(4).lean();
      resolve(allsubcategory);
    });
  },

  upload,
  addProduct: (productData, file) => {
    console.log(file);
    return new Promise(async (resolve, reject) => {
      Mrp = parseInt(productData.Mrp)
      Prize = (Mrp) - (Mrp*productData.Discount*0.01).toFixed(0)
      console.log(Prize);
      
      const sub_categorydata = await Sub_Category.findOne({
        Sub_category: productData.subcategory,
      });
      const categorydata = await category.findOne({
        categoryName: productData.category,
      });
      console.log(productData);

      const newproduct = await new products({
        bookName: productData.bookName,
        author: productData.author,
        description: productData.description,
        category: categorydata._id,
        sub_cateogry: sub_categorydata._id,
        mrp: productData.Mrp,
        Discount: productData.Discount,
        price: Prize,
        stock: productData.stock,
        image: file.filename,
      });
      await newproduct.save(async(err,res)=>{
        if(err){
          
        }
        resolve({data:res, msg:"Success"});
      })
        console.log("da");
        
      
      console.log(newproduct);
    });
  },
  getallproducts: () => {
    return new Promise(async (resolve, reject) => {
      const allproducts = products.find({}).populate('category').populate('sub_cateogry').sort([['_id', -1]]).limit(15).lean();
      resolve(allproducts);
    });
  },
  moreProduct:()=>{
    return new Promise(async(resolve,reject)=>{
      const moreProducts=products.find({}).populate('image.[0]').skip(8).limit(10).lean();
      resolve(moreProducts)
    })
  },
  deleteProduct: (proId) => {
    return new Promise(async (resolve, reject) => {
      const removedProduct = await products.findByIdAndDelete({ _id: proId });
      resolve(removedProduct);
    });
  },
  getProductDetails: (proId) => {
    return new Promise(async (resolve, reject) => {
      const productDetails = await products
        .findOne({ _id: proId }).populate('category').populate('sub_cateogry')
        .lean()
        .then((productDetails) => {
          resolve(productDetails);
          
        });
    });
  },
  updateProduct: (proId, data, file) => {
    return new Promise(async (resolve, reject) => {

      console.log("GGDdgdsg");
      console.log(file + "hello");
      console.log(data);
      Mrp = parseInt(data.Mrp)
      Prize = (Mrp) - (Mrp*data.Discount*0.01).toFixed(0) 
      const sub_categorydata = await Sub_Category.findOne({
        Sub_category: data.subcategory,
      });
      const categorydata = await category.findOne({
        categoryName: data.category,
      });
      console.log(categorydata + "category data");
      console.log(file.filename);
      const updateProduct = await products.findByIdAndUpdate(
        { _id: proId },
        {
          $set: {
            bookName: data.bookName,
            author: data.author,
            description: data.description,
            category: categorydata._id,
            sub_cateogry: sub_categorydata._id,
            mrp: data.Mrp,
            price: Prize,
            Discount: data.Discount,
            stock: data.stock,
            image: file,
          },
        }
      );
      resolve({ updateProduct, msg: "You added product successfully!" });
    });
  },

  ProductDetails: (proId) => {
    return new Promise(async (resolve, reject) => {
      const productDetails = await products
        .findOne({ _id: proId })
        .lean()
        .then((productDetails) => {
          resolve(productDetails);
          console.log(productDetails);
        });
    });
  },
  getproductdetalis: (proId) => {
    return new Promise(async (resolve, reject) => {
      const singleproduct = await products
        .findOne({ _id: proId })
        .lean()
        .then((singleproduct) => {
          resolve(singleproduct);
        });
    });
  },
  allorders: () => {
    return new Promise(async (resolve, reject) => {
      const allorders = await ordermodel
        .find({})
        .populate("product.pro_id").sort([['ordered_on', -1]])
        .lean();
      // console.log(allorders.userId);
      resolve(allorders);
    });
  },
  orderdetails: (orderID) => {
    return new Promise(async (resolve, reject) => {
      const orderdetails = await ordermodel
        .findOne({ _id: orderID })
        .populate("product.pro_id")
        .lean();
      resolve(orderdetails);
    });
  },
  changeOrderStatus: (data) => {
    console.log(data);
    return new Promise(async (resolve, reject) => {
      const state = await ordermodel.findOneAndUpdate(
        { _id: data.orderId, "product.pro_id": data.proId },
        {
          $set: {
            "product.$.status": data.orderStatus,
          },
        }
      );
      console.log(state);
      resolve();
    });
  },

  AddCoupon:(data)=>{ 
    console.log(data);
    return new Promise(async(resolve,reject)=>{
      const newCoupon=new couponmodel({
        couponName:data.couponName,
        couponCode:data.CoupoCode,
        limit:data.Limit,
        expirationTime:data.ExpireDate,
        discount:data.discount
      })
      await newCoupon.save();
      resolve()
    })
  },

  getAllCoupons:()=>{
    console.log("kasjfkjk");
    return new Promise (async(resolve,reject)=>{
      const AllCoupons=await couponmodel.find({}).lean()
      resolve(AllCoupons)
    })
  },
  Deletecoupon:(id)=>{
    console.log("idd");
    return new Promise(async (resolve,reject)=>{
      const removeCoupon= await couponmodel.findByIdAndDelete({ _id: id });
      resolve(removeCoupon)
    })
  }





};

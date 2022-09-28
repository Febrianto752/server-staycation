const Category = require("../models/Category");
const Bank = require("../models/Bank");
const fs = require("fs-extra");
const path = require("path");
const Item = require("../models/Item");
const Image = require("../models/Image");

module.exports = {
  viewDashboard: (req, res) => {
    res.render("admin/dashboard/index", {
      title: "dashboard",
      dataTables: false,
    });
  },
  viewCategory: async (req, res) => {
    try {
      const categories = await Category.find();
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      res.render("admin/category/index", {
        title: "category",
        dataTables: true,
        categories,
        alert,
      });
    } catch (error) {
      res.render("admin/category/index");
    }
  },
  addCategory: async (req, res) => {
    try {
      const { name } = req.body;
      await Category.create({ name });
      req.flash("alertMessage", "Success Add Category");
      req.flash("alertStatus", "success");
      res.redirect("/admin/category");
    } catch (error) {
      req.flash("alertMessage", `${$error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/category");
    }
  },
  updateCategory: async (req, res) => {
    try {
      const { id, name } = req.body;
      const category = await Category.findOne({ _id: id });
      category.name = name;
      await category.save();
      req.flash("alertMessage", "Succesfully to updated data");
      req.flash("alertStatus", "success");
      res.redirect("/admin/category");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/category");
    }
  },
  deleteCategory: async (req, res) => {
    const { id } = req.params;
    const category = Category.findOne({ _id: id });
    await category.remove();
    req.flash("alertMessage", "Succesfully to delete data");
    req.flash("alertStatus", "success");
    res.redirect("/admin/category");
  },
  viewBank: async (req, res) => {
    try {
      const banks = await Bank.find();
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      res.render("admin/bank/index", {
        title: "bank",
        dataTables: true,
        banks,
        alert,
      });
    } catch (error) {
      const alertMessage = req.flash("alertMessage", `${error.message}`);
      const alertStatus = req.flash("alertStatus", "danger");
      const alert = { message: alertMessage, status: alertStatus };
      res.render("admin/bank/index", {
        title: "bank",
        dataTables: true,
        alert,
      });
    }
  },
  addBank: async (req, res) => {
    try {
      const { bankName, accountNumber, accountHolder } = req.body;
      await Bank.create({
        bankName,
        accountNumber,
        accountHolder,
        imageUrl: `images/${req.file.filename}`,
      });

      req.flash("alertMessage", "Succesfully to add bank");
      req.flash("alertStatus", "success");
      res.redirect("/admin/bank");
    } catch (error) {
      req.flash("alertMessage", "failed to added bank");
      req.flash("alertStatus", "danger");
      res.redirect("/admin/bank");
    }
  },
  updateBank: async (req, res) => {
    try {
      const { id, bankName, accountNumber, accountHolder } = req.body;
      const bank = await Bank.findOne({ _id: id });
      let imageUrl = null;
      if (req.file === undefined) {
        imageUrl = bank.imageUrl;
      } else if (req.file) {
        imageUrl = `images/${req.file.filename}`;
        fs.unlink(path.join(`public/${bank.imageUrl}`));
      }
      bank.bankName = bankName;
      bank.accountNumber = accountNumber;
      bank.accountHolder = accountHolder;
      bank.imageUrl = imageUrl;
      bank.save();

      req.flash("alertMessage", "Succesfully to update bank");
      req.flash("alertStatus", "success");
      res.redirect("/admin/bank");
    } catch (error) {
      req.flash("alertMessage", "failed to update bank");
      req.flash("alertStatus", "danger");
      res.redirect("/admin/bank");
    }
  },
  deleteBank: async (req, res) => {
    try {
      const { id } = req.params;
      const bank = await Bank.findOne({ _id: id });
      fs.unlink(path.join(`public/${bank.imageUrl}`));
      await bank.remove();
      req.flash("alertMessage", "Succesfully to delete bank");
      req.flash("alertStatus", "success");
      res.redirect("/admin/bank");
    } catch (error) {
      req.flash("alertMessage", "Failed to delete data");
      req.flash("alertStatus", "danger");
      res.redirect("/admin/bank");
    }
  },
  viewItem: async (req, res) => {
    try {
      const items = await Item.find()
        .populate({
          path: "imageIds",
          select: "id imageUrl",
        })
        .populate({ path: "categoryId", select: "id name" });

      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      const categories = await Category.find();
      res.render("admin/item/index", {
        title: "item",
        dataTables: true,
        alert,
        categories,
        items,
        action: "view",
      });
    } catch (error) {
      const alertMessage = req.flash("alertMessage", `${error.message}`);
      const alertStatus = req.flash("alertStatus", "danger");
      const alert = { message: alertMessage, status: alertStatus };
      res.render("admin/item/index", {
        title: "item",
        dataTables: true,
        alert,
      });
    }
  },
  addItem: async (req, res) => {
    try {
      const {
        title,
        price,
        city,
        category: categoryId,
        description,
      } = req.body;
      const category = await Category.findOne({ _id: categoryId });
      const newItem = {
        categoryId: category._id,
        title,
        price,
        city,
        description,
      };
      const item = await Item.create(newItem);
      category.itemIds.push({ _id: item._id });
      await category.save();
      for (let i = 0; i < req.files.length; i++) {
        const imageSave = await Image.create({
          imageUrl: `images/${req.files[i].filename}`,
        });
        item.imageIds.push({ _id: imageSave._id });
      }
      await item.save();

      req.flash("alertMessage", "Succesfully to add item");
      req.flash("alertStatus", "success");
      res.redirect("/admin/item");
    } catch (error) {
      req.flash("alertMessage", "Failed to add item");
      req.flash("alertStatus", "danger");
      res.redirect("/admin/item");
    }
  },
  showImageItem: async (req, res) => {
    try {
      const { id } = req.params;
      const items = await Item.findOne({ _id: id }).populate({
        path: "imageIds",
        select: "id imageUrl",
      });

      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      res.render("admin/item/index", {
        title: "Staycation | images item",
        dataTables: true,
        alert,
        items,
        action: "show images",
      });
    } catch (error) {
      const alertMessage = req.flash("alertMessage", `${error.message}`);
      const alertStatus = req.flash("alertStatus", "danger");
      const alert = { message: alertMessage, status: alertStatus };
      res.render("admin/item/index", {
        title: "item",
        dataTables: true,
        alert,
      });
    }
  },
  editItem: async (req, res) => {
    try {
      const { id } = req.params;
      const item = await Item.findOne({ _id: id })
        .populate({
          path: "imageIds",
          select: "id imageUrl",
        })
        .populate({ path: "categoryId", select: "_id name" });

      const categories = await Category.find();
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      res.render("admin/item/index", {
        title: "edit item",
        item,
        categories,
        action: "edit item",
        alert,
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/item");
    }
  },
  updateItem: async (req, res) => {
    try {
      const { id, title, price, country, city, category, description } =
        req.body;
      const item = await Item.findOne({ _id: id }).populate({
        path: "imageIds",
        select: "_id imageUrl",
      });

      if (req.files.length > 0) {
        const oldImageIds = item.imageIds;
        item.imageIds = [];

        for (let i = 0; i < req.files.length; i++) {
          const image = await Image.create({
            imageUrl: `images/${req.files[i].filename}`,
          });
          item.imageIds.push({ _id: image._id });
        }

        item.title = title;
        item.price = price;
        item.country = country;
        item.city = city;
        item.categoryId = category;
        item.description = description;
        item.save();

        // menghapus file old image item
        for (let i = 0; i < oldImageIds.length; i++) {
          await Image.deleteOne({ _id: oldImageIds[i]._id });
          fs.unlink(path.join(`public/${oldImageIds[i].imageUrl}`));
        }
      } else {
        item.title = title;
        item.price = price;
        item.country = country;
        item.city = city;
        item.categoryId = category;
        item.description = description;
        item.save();
      }
      req.flash("alertMessage", "Succesfully to update item");
      req.flash("alertStatus", "success");
      res.redirect("/admin/item");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/item");
    }
  },
  viewBooking: (req, res) => {
    res.render("admin/booking/index", { title: "booking", dataTables: true });
  },
};

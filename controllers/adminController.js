const Category = require("../models/Category");
const Bank = require("../models/Bank");
const fs = require("fs-extra");
const path = require("path");

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
      const categoryById = await Category.findOne({ _id: id });
      categoryById.name = name;
      await categoryById.save();
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
    const categoryById = Category.findOne({ _id: id });
    await categoryById.remove();
    req.flash("alertMessage", "Succesfully to deleted data");
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
      console.log(req.file);
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
      const bankById = await Bank.findOne({ _id: id });
      let imageUrl = null;
      if (req.file === undefined) {
        imageUrl = bankById.imageUrl;
      } else if (req.file) {
        imageUrl = `images/${req.file.filename}`;
        fs.unlink(path.join(`public/${bankById.imageUrl}`));
      }
      bankById.bankName = bankName;
      bankById.accountNumber = accountNumber;
      bankById.accountHolder = accountHolder;
      bankById.imageUrl = imageUrl;
      bankById.save();

      req.flash("alertMessage", "Succesfully to update bank");
      req.flash("alertStatus", "success");
      res.redirect("/admin/bank");
    } catch (error) {
      req.flash("alertMessage", "failed to update bank");
      req.flash("alertStatus", "danger");
      res.redirect("/admin/bank");
    }
  },
  viewItem: (req, res) => {
    res.render("admin/item/index", { title: "item", dataTables: true });
  },
  viewBooking: (req, res) => {
    res.render("admin/booking/index", { title: "booking", dataTables: true });
  },
};

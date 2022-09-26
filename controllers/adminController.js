const Category = require("../models/Category");

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
      res.redirect("/admin/category");
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
  viewBank: (req, res) => {
    res.render("admin/bank/index", { title: "bank", dataTables: true });
  },
  viewItem: (req, res) => {
    res.render("admin/item/index", { title: "item", dataTables: true });
  },
  viewBooking: (req, res) => {
    res.render("admin/booking/index", { title: "booking", dataTables: true });
  },
};

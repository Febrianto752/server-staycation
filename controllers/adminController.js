const Category = require("../models/Category");

module.exports = {
  viewDashboard: (req, res) => {
    res.render("admin/dashboard/index", {
      title: "dashboard",
      dataTables: false,
    });
  },
  viewCategory: async (req, res) => {
    const categories = await Category.find();
    res.render("admin/category/index", {
      title: "category",
      dataTables: true,
      categories,
    });
  },
  addCategory: async (req, res) => {
    const { name } = req.body;
    await Category.create({ name });

    res.redirect("/admin/category");
  },
  updateCategory: async (req, res) => {
    const { id, name } = req.body;
    const categoryById = await Category.findOne({ _id: id });
    categoryById.name = name;
    await categoryById.save();
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

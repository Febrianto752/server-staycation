module.exports = {
  viewDashboard: (req, res) => {
    res.render("admin/dashboard/index", {
      title: "dashboard",
      dataTables: false,
    });
  },
  viewCategory: (req, res) => {
    res.render("admin/category/index", { title: "category", dataTables: true });
  },
  viewBank: (req, res) => {
    res.render("admin/bank/index", { title: "bank", dataTables: true });
  },
  viewItem: (req, res) => {
    res.render("admin/item/index", { title: "item", dataTables: true });
  },
};

module.exports = {
  viewDashboard: (req, res) => {
    res.render("admin/dashboard/index");
  },
  viewCategory: (req, res) => {
    res.render("admin/category/index");
  },
};

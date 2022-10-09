const router = require("express").Router();
const adminController = require("../controllers/adminController");
const { upload, uploadMultiple } = require("../middlewares/multer");

router.get("/dashboard", adminController.viewDashboard);
// Category routes
router.get("/category", adminController.viewCategory);
router.post("/category", adminController.addCategory);
router.put("/category", adminController.updateCategory);
router.delete("/category/:id", adminController.deleteCategory);
// Bank Routes
router.get("/bank", adminController.viewBank);
router.post("/bank", upload, adminController.addBank);
router.put("/bank", upload, adminController.updateBank);
router.delete("/bank/:id", adminController.deleteBank);
// Item Routes
router.get("/item", adminController.viewItem);
router.get("/item/:id/show-images", adminController.showImageItem);
router.get("/item/:id/edit", adminController.editItem);
router.post("/item", uploadMultiple, adminController.addItem);
router.put("/item/:id", uploadMultiple, adminController.updateItem);
router.delete("/item/:id", adminController.deleteItem);
// Detail Item
router.get("/item/:id", adminController.viewDetailItem);
// Booking Routes
router.get("/booking", adminController.viewBooking);

module.exports = router;

const express = require("express");
const axios = require("axios");
const Repair = require("../models/Repair");

const router = express.Router();
const IFIXIT_API_BASE = "https://www.ifixit.com/api/2.0";

// Fetch repair guides from iFixit API
const fetchRepairGuides = async (deviceName) => {
  try {
    const response = await axios.get(
      `${IFIXIT_API_BASE}/guides?query=${deviceName}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching repair guides:", error.message);
    throw error;
  }
};

// Fetch repair guides for a device
router.get("/repair/:device", async (req, res) => {
  const { device } = req.params;

  try {
    const guides = await fetchRepairGuides(device);
    res.json(guides);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch repair guides" });
  }
});

// Save repair guides for a device
router.post("/save/:device", async (req, res) => {
  const { device } = req.params;

  try {
    const guides = await fetchRepairGuides(device);

    for (const guide of guides) {
      await Repair.create({
        issue: guide.title,
        device,
        guideUrl: `https://www.ifixit.com/Guide/${guide.guideid}`,
        difficulty: guide.difficulty || "Unknown",
        timeRequired: guide.time_required || "Unknown",
      });
    }

    res.json({ message: "Repair guides saved successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to save repair guides" });
  }
});

module.exports = router;

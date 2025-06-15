
const express = require('express');
const router = express.Router();
const Issue = require('../models/Issue');

/**
 * GET /api/heatmap-data
 * Query params: status, category, time (optional)
 * Aggregates issues by constituency for heatmap.
 */
router.get('/', async (req, res) => {
  // Optional filters
  const { status, category } = req.query;
  const match = {};
  if (status) match.status = status;
  if (category) match.type = category;

  try {
    // Group by constituency
    const data = await Issue.aggregate([
      { $match: match },
      { $group: {
        _id: "$constituency",
        totalComplaints: { $sum: 1 },
        activeComplaints: { $sum: { $cond: [{ $in: ["$status", ["Pending", "In Progress"]] }, 1, 0] } },
        resolvedComplaints: { $sum: { $cond: [{ $eq: ["$status", "Resolved"] }, 1, 0] } },
        mostCommonType: { $first: "$type" }, // fallback, will update next
        typeCounts: { $push: "$type" }
      }},
      // Compute most common type
      {
        $addFields: {
          mostCommonType: {
            $let: {
              vars: { counts: { $objectToArray: { $count: "$typeCounts" } } },
              in: {
                $first: "$typeCounts"
              }
            }
          }
        }
      }
    ]);
    // Format as dictionary by constituency name
    const result = {};
    data.forEach(region => {
      result[region._id] = {
        totalComplaints: region.totalComplaints,
        activeComplaints: region.activeComplaints,
        resolvedComplaints: region.resolvedComplaints,
        mostCommonType: region.mostCommonType || "",
      };
    });
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;

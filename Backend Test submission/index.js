const express = require("express");
const mongoose = require("mongoose");
const { nanoid } = require("nanoid");
const Url = require("./models/Url");
const Log = require("../logging middleware/logger");
const axios = require("axios");
const app = express();

app.use(express.json());

mongoose.connect("mongodb://localhost:27017/url-shortener", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => Log("backend", "info", "db", "MongoDB connected"))
  .catch((err) => Log("backend", "fatal", "db", `MongoDB connection failed: ${err.message}`));

app.post("/shorturls", async (req, res) => {
  const { originalUrl, validTill } = req.body;

  if (!originalUrl) {
    Log("backend", "warn", "handler", "originalUrl missing in request body");
    return res.status(400).json({ error: "originalUrl is required" });
  }

  const shortCode = nanoid(6);
  const expiryDate = validTill ? new Date(validTill) : new Date(Date.now() + 30 * 60000); // default 30 mins

  try {
    const newUrl = new Url({
      originalUrl,
      shortCode,
      validTill: expiryDate,
      createdAt: new Date(),
      clickCount: 0,
      clicks: [],
    });

    await newUrl.save();
    Log("backend", "info", "shortener", `Shortened URL created with code ${shortCode}`);

    res.status(201).json({
      shortUrl: `http://localhost:5050/${shortCode}`,
      expiry: newUrl.validTill,
    });
  } catch (err) {
    Log("backend", "error", "handler", `Error creating short URL: ${err.message}`);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/:shortCode", async (req, res) => {
  try {
    const urlDoc = await Url.findOne({ shortCode: req.params.shortCode });
    if (!urlDoc) {
      Log("backend", "warn", "redirect", `Short code ${req.params.shortCode} not found`);
      return res.status(404).json({ error: "Short URL not found" });
    }

    if (urlDoc.validTill < new Date()) {
      Log("backend", "info", "redirect", `URL expired for code ${req.params.shortCode}`);
      return res.status(410).json({ error: "URL expired" });
    }

    const clickInfo = {
      timestamp: new Date(),
      referrer: req.get("referer") || "direct",
      ip: req.ip,
      userAgent: req.get("user-agent") || "unknown",
    };

    urlDoc.clicks.push(clickInfo);
    urlDoc.clickCount++;
    await urlDoc.save();

    Log("backend", "info", "redirect", `Redirecting shortCode ${req.params.shortCode}`);
    console.log("backend", "info", "redirect", `Redirecting shortCode ${req.params.shortCode}`);
    res.redirect(urlDoc.originalUrl);
  } catch (err) {
    Log("backend", "error", "redirect", `Failed to redirect: ${err.message}`);
    res.status(500).json({ error: "Redirection failed" });
  }
});

app.get("/shorturls/:shortCode", async (req, res) => {
  try {
    const urlDoc = await Url.findOne({ shortCode: req.params.shortCode });
    if (!urlDoc) {
      Log("backend", "warn", "stats", `Shortcode ${req.params.shortCode} not found for stats`);
      return res.status(404).json({ error: "Short URL not found" });
    }

    res.json({
      originalUrl: urlDoc.originalUrl,
      createdAt: urlDoc.createdAt,
      validTill: urlDoc.validTill,
      clickCount: urlDoc.clickCount,
      clicks: urlDoc.clicks,
    });
  } catch (err) {
    Log("backend", "error", "stats", `Error fetching stats: ${err.message}`);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

app.listen(5050, () => {
  Log("backend", "info", "server", "Server running at http://localhost:5050");
  console.log("Server running at http://localhost:5050");
});

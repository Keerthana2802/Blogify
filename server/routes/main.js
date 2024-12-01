const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

/**
 * GET /
 * Home
 **/
router.get("", async (req, res) => {
  try {
    const locals = {
      title: "My Blog",
      description:
        "Simple Blog Website created using NodeJs,ExpressJs & MongoDB",
    };

    let perPage = 6;
    let page = req.query.page || 1;

    const data = await Post.aggregate([{ $sort: { createdAt: -1 } }])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();

    const count = await Post.countDocuments().exec();
    const nextPage = parseInt(page) + 1;
    const hasNextPage = nextPage <= Math.ceil(count / perPage);

    res.render("index", {
      locals,
      data,
      current: page,
      nextPage: hasNextPage ? nextPage : null,
      currentRoute: "/",
    });
  } catch (error) {
    console.log(error);
  }
});

/**
 * GET /
 * Post :id
 **/
router.get("/post/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Post.findById(id);

    const locals = {
      title: data.title,
      description:
        "Simple Blog Website created using NodeJs,ExpressJs & MongoDB",
    };

    res.render("post", { locals, data, currentRoute: `/post/${id}` });
  } catch (error) {
    console.log(error);
  }
});

/**
 * POST /
 * Post - searchTerm
 **/
router.post("/search", async (req, res) => {
  try {
    const locals = {
      title: "Search",
      description:
        "Simple Blog Website created using NodeJs,ExpressJs & MongoDB",
    };

    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");
    const data = await Post.find({
      $or: [
        { title: { $regex: searchNoSpecialChar, $options: "i" } },
        { body: { $regex: searchNoSpecialChar, $options: "i" } },
      ],
    });

    res.render("search", {
      locals,
      data,
      currentRoute: "/search",
    });
  } catch (error) {
    console.log(error);
  }
});

// About
router.get("/about", (req, res) => {
  res.render("about", {
    currentRoute: "/about",
  });
});

// Contact us
router.get("/contact", (req, res) => {
  res.render("contact", {
    currentRoute: "/contact",
  });
});

module.exports = router;

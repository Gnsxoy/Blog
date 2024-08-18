const {
  handleError,
  setListPage,
  getCollectionTotal
} = require("./../utils");
const Blog = require("../models/Blog");
const BAT = require("../models/BlogAndTag");
const Tag = require("../models/Tag");
const mongoose = require('mongoose');

module.exports = (router) => {
  /**
   * @route POST /api/tag/create
   * @desc Gnsxoy 创建标签
   * @access ~public
   * @params Tag.Schema
   */
  router.post("/tag/create", async (ctx, next) => {
    const tagData = ctx.request.body;
    const newTag = new Tag({
      ...tagData,
      id: new mongoose.Types.ObjectId().toString() // 生成新的 ObjectId 并赋值给 id
    });
    try {
      await newTag.save()
    } catch (error) {
      handleError(error, ctx);
    }
  });

  /**
   * @route GET /api/tag/detail
   * @desc Gnsxoy 标签详情
   * @access ~public
   * @params id-tagID
   */
  router.get("/tag/detail", async (ctx, next) => {
    const { id } = ctx.query;
    try {
      const data = await Tag.findOne({ id }, { _id: 0 });

      if (data) {
        ctx.body = { data };
      } else {
        ctx.body = {
          code: 404,
          status: 'error',
          data: null,
          message: '标签未找到'
        };
      }
    } catch (error) {
      handleError(error, ctx);
    }
  });

  /**
   * @route DELETE /api/tag/remove
   * @desc Gnsxoy 删除对应标签 (如果标签对应下有文章不可删除)
   * @access ~public
   * @params id-blogID
   */
  router.delete("/tag/remove", async (ctx, next) => {
    const { id } = ctx.request.body;
    try {
      const blogList = await BAT.find({ tagID: id });
      if (!blogList.length) {
        // 😯 - 这里期望的是使用 _id 来查询并且进行删除的，如果使用 自定义id 则不可使用该方法。
        // await Tag.findByIdAndRemove({ id });
        const result = await Tag.findOneAndDelete({ id });
        if (!result) {
          ctx.body = {
            code: 404,
            status: 'error',
            data: null,
            message: '标签未找到'
          };
        }
      } else {
        ctx.status = 400;
        ctx.body = {
          code: 400,
          status: 'error',
          data: null,
          message: '该标签下面还有文章，不可删除。'
        };
      }
    } catch (error) {
      handleError(error, ctx);
    }
  });

  /**
   * @route PUT /api/tag/update
   * @desc Gnsxoy 更新 对应标签
   * @access ~public
   * @params id-tagID && Tag.Schema
   */
  router.put("/tag/update", async (ctx, next) => {
    const tagData = ctx.request.body;

    const id = tagData.id;
    Reflect.deleteProperty(tagData, "id");
    try {
      await Tag.updateOne({ id }, { $set: tagData });
    } catch (error) {
      handleError(error, ctx);
    }
  });

  /**
   * @route GET /api/tag/list
   * @desc Gnsxoy 标签列表 - 查询对应
   * @access ~public
   * @params search-tagName
   */
  router.get("/tag/list", async (ctx, next) => {
    const { search = "", pageNo = 1, pageSize, showAll = false } = ctx.query;
    const searchReg = new RegExp(search, "i");
    const queryParams = { name: { $regex: searchReg } };

    try {
      const total = await getCollectionTotal(Tag, queryParams);
      const taglist = await setListPage(Tag, queryParams, { pageNo, pageSize });
      const blogTotal = await getCollectionTotal(BAT, {});

      const list = showAll
        ? [
            {
              id: "all",
              color: "#f50",
              fontColor: "#fff",
              count: blogTotal,
              name: "Show All",
            },
            ...taglist,
          ]
        : taglist;

      ctx.body = {
        data: {
          list,
          total,
        }
      };
    } catch (error) {
      handleError(error, ctx);
    }
  });

  /**
   * @route GET /api/tag/blog_list
   * @desc Gnsxoy 查询标签对应的博客列表
   * @access ~public
   * @params search-tagID
   */
  router.get("/tag/blog_list", async (ctx, next) => {
    const { tagID = "", pageNo = 1, pageSize = 30 } = ctx.query;
    const queryParams = tagID ? { tagID } : {};

    try {
      const total = await getCollectionTotal(BAT, queryParams);
      const blogAcclist = await setListPage(BAT, queryParams, {
        pageNo,
        pageSize,
      });
      blogIdlist = blogAcclist.map((_blog) => _blog.blogID);
      const blogList = await Blog.find({
        id: {
          $in: [...blogIdlist],
        },
      }).sort({
        isTop: -1,
        updateDate: -1,
      });
      const list = blogList.map((_blog) => {
        _blog = _blog.toObject();
        delete _blog.body;
        return _blog;
      });

      ctx.body = {
        data: {
          list,
          total
        }
      };
    } catch (error) {
      handleError(error, ctx);
    }
  });
};

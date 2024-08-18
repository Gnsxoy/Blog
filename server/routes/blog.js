const {
  objIDToStr,
  handleError,
  setListPage,
  updateIncOrSub,
  getCollectionTotal,
} = require("./../utils");
const Blog = require("../models/Blog");
const BAT = require("../models/BlogAndTag");
const Tag = require("../models/Tag");
const mongoose = require('mongoose');

module.exports = (router) => {
  /**
   * @route POST /api/blog/create
   * @desc Gnsxoy 创建博客
   * @access ~public
   * @params Blog.Schema
   */
  router.post("/blog/create", async (ctx, next) => {
    const blogData = ctx.request.body;
    const newBlog = new Blog({
      ...blogData,
      id: new mongoose.Types.ObjectId().toString() // 生成新的 ObjectId 并赋值给 id
    });
    try {
      const blog = await newBlog.save();
      const { tagID } = blogData;
      const { id: blogID } = blog;
      const newBAT = new BAT({ blogID, tagID });
      if (tagID) await updateIncOrSub(Tag, tagID, { count: 1 });
      await newBAT.save();

    } catch (error) {
      handleError(error, ctx);
    }
  });

  /**
   * @route GET /api/blog/detail
   * @desc Gnsxoy 博客详情
   * @access ~public
   * @params id-blogID
   */
  router.get("/blog/detail", async (ctx, next) => {
    const { id } = ctx.query;
    try {
      const _blogItem = await Blog.findOne({ id }, { _id: 0 });
      if (_blogItem) {
        const _tagInfo = await Tag.findOne({
          id: _blogItem.tagID,
        });
        const blogItem = _blogItem.toObject();
        const tagInfo = _tagInfo.toObject();
  
        ctx.body = {
          data: {
            ...blogItem,
            tagInfo,
          }
        };
      } else {
        ctx.body = {
          code: 404,
          status: 'error',
          data: null,
          message: '博客未找到'
        };
      }
    } catch (error) {
      handleError(error, ctx);
    }
  });

  /**
   * @route PUT /api/blog/update
   * @desc Gnsxoy 更新 对应博客
   * @access ~public
   * @params id-blogID && Blog.Schema
   */
  router.put("/blog/update", async (ctx, next) => {
    const updateTime = +new Date();
    const blogData = ctx.request.body;

    const id = blogData.id;
    Reflect.deleteProperty(blogData, "id");
    blogData.updateDate = updateTime;
    await Blog.updateOne(
      { id },
      {
        $set: blogData,
      }
    )
      .then(async (blog) => {
        const { tagID } = blogData; // 即将要更新的 tagID
        const { tagID: BATItemTagID = "" } = await BAT.findOne({ blogID: id }); // 旧 tagID
        if (BATItemTagID !== tagID) {
          await BAT.updateOne({ blogID: id }, { $set: { blogID: id, tagID } });
          await updateIncOrSub(Tag, tagID, { count: 1 });
          await updateIncOrSub(Tag, BATItemTagID, { count: -1 });
        };
      })
      .catch((err) => {
        handleError(error, ctx);
      });
  });

  /**
   * @route DELETE /api/blog/remove
   * @desc Gnsxoy 删除对应博客
   * @access ~public
   * @params id-blogID
   */
  router.delete("/blog/remove", async (ctx, next) => {
    const { id } = ctx.request.body;
    try {
      await Blog.findOneAndDelete({ id });
      const { tagID } = await BAT.findOne({ blogID: id });
      await BAT.deleteOne({ blogID: id });
      if (tagID) await updateIncOrSub(Tag, tagID, { count: -1 });
    } catch (error) {
      handleError(error, ctx);
    }
  });

  /**
   * @route GET /api/blog/list
   * @desc Gnsxoy 博客列表 - 查询对应
   * @access ~public
   * @params search-blog标题
   */
  router.get("/blog/list", async (ctx, next) => {
    const { search = "", pageNo = 1, pageSize } = ctx.query;
    const searchReg = new RegExp(search, "i");
    const queryParams = { title: { $regex: searchReg } };

    try {
      const total = await getCollectionTotal(Blog, queryParams);
      const blogList = await setListPage(Blog, queryParams, {
        pageNo,
        pageSize,
        orderBy: {
          isTop: -1,
          updateDate: -1,
        },
      });
      const tagIdList = new Set(blogList.map((_blog) => _blog.tagID));
      const tagList = await Tag.find({
        id: {
          $in: [...tagIdList],
        },
      });
      const list = blogList.map((_blog) => {
        const tagInfo = tagList.find(
          ({ id }) => id === _blog.tagID
        );
        const _blogItem = _blog.toObject();
        _blogItem.tagInfo = tagInfo;
        delete _blogItem.body;
        return _blogItem;
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

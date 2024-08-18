const fs = require("fs");
const path = require("path");
const WeChatSVG = '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1722840943735" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="843" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200"><path d="M337.387283 341.82659c-17.757225 0-35.514451 11.83815-35.514451 29.595375s17.757225 29.595376 35.514451 29.595376 29.595376-11.83815 29.595376-29.595376c0-18.49711-11.83815-29.595376-29.595376-29.595375zM577.849711 513.479769c-11.83815 0-22.936416 12.578035-22.936416 23.6763 0 12.578035 11.83815 23.676301 22.936416 23.676301 17.757225 0 29.595376-11.83815 29.595376-23.676301s-11.83815-23.676301-29.595376-23.6763zM501.641618 401.017341c17.757225 0 29.595376-12.578035 29.595376-29.595376 0-17.757225-11.83815-29.595376-29.595376-29.595375s-35.514451 11.83815-35.51445 29.595375 17.757225 29.595376 35.51445 29.595376zM706.589595 513.479769c-11.83815 0-22.936416 12.578035-22.936416 23.6763 0 12.578035 11.83815 23.676301 22.936416 23.676301 17.757225 0 29.595376-11.83815 29.595376-23.676301s-11.83815-23.676301-29.595376-23.6763z" fill="#28C445" p-id="844"></path><path d="M510.520231 2.959538C228.624277 2.959538 0 231.583815 0 513.479769s228.624277 510.520231 510.520231 510.520231 510.520231-228.624277 510.520231-510.520231-228.624277-510.520231-510.520231-510.520231zM413.595376 644.439306c-29.595376 0-53.271676-5.919075-81.387284-12.578034l-81.387283 41.433526 22.936416-71.768786c-58.450867-41.433526-93.965318-95.445087-93.965317-159.815029 0-113.202312 105.803468-201.988439 233.803468-201.98844 114.682081 0 216.046243 71.028902 236.023121 166.473989-7.398844-0.739884-14.797688-1.479769-22.196532-1.479769-110.982659 1.479769-198.289017 85.086705-198.289017 188.67052 0 17.017341 2.959538 33.294798 7.398844 49.572255-7.398844 0.739884-15.537572 1.479769-22.936416 1.479768z m346.265896 82.867052l17.757225 59.190752-63.630058-35.514451c-22.936416 5.919075-46.612717 11.83815-70.289017 11.83815-111.722543 0-199.768786-76.947977-199.768786-172.393063-0.739884-94.705202 87.306358-171.653179 198.289017-171.65318 105.803468 0 199.028902 77.687861 199.028902 172.393064 0 53.271676-34.774566 100.624277-81.387283 136.138728z" fill="#28C445" p-id="845"></path></svg>';

/**
 * 去掉 .md 后缀
 * @author guolin
 * @param {*} fileName
 * @e.g {*} removeSuffix(index.md) => index
 */
const removeSuffix = (fileName) => {
  return fileName.replace(".md", "");
};

/**
 * @description 生成首字母大写的文件夹名称
 * @author guolin
 * @param {*} fileName
 * @e.g {*} genFileRuleName(js) => Js
 */
const genFileRuleName = (fileName) => {
  const name = fileName[0].toUpperCase() + fileName.substr(1);
  return name;
};

// 当前 markdown 的存储文件夹名称
const curMdFileName = "docs";
const buildConfig = () => {
  const mdDirPath = path.resolve(__dirname, `./../../${curMdFileName}`);
  const dirs = fs.readdirSync(mdDirPath); // 读取 docs 下的所有文件夹
  const navbarList = buildNavbar(dirs);
  const sidebarList = buildSidebar(dirs, mdDirPath);
  const socialLinks = buildSocialLinks();
  const configTemPath = path.resolve(__dirname, './configureTemplate.ts');

  const configTemText = fs
    .readFileSync(configTemPath, "utf-8")
    .replace("sidebar: [],", `sidebar: ${JSON.stringify(sidebarList, null, 4)},`)
    .replace("nav: [],", `nav: ${JSON.stringify(navbarList, null, 4)},`)
    .replace("socialLinks: [],", `socialLinks: ${JSON.stringify(socialLinks, null, 4)},`);

  const targetConfigPath = path.resolve(__dirname, './../config.mts');
  fs.writeFile(
    targetConfigPath, configTemText, { encoding: "utf-8" },
    (err) => {
      if (err) console.log("write configFile err: ", err);
    }
  );
};

/**
 * 构建 SocialLinks
 */
const buildSocialLinks = () => {
  const GITHUB_URI = "https://github.com/gnsxoy";
  const WECHAT_URI = "https://www.gnsxoy.com/qr-code/wx/";
  const _socialLinks = [
    { icon: 'github', link: GITHUB_URI },
    { icon: { svg: WeChatSVG }, link: WECHAT_URI },
  ];

  return _socialLinks;
};

/**
 * 构建 Nav
 */
const buildNavbar = (dirs) => {
  // 当前固定 引导坐标为 1 (数组下标)
  const GUIDE_INDEX = 1;
  const GITEE_URI = "https://gitee.com/gnsxoy";
  const WEIBO_URI = "https://weibo.com/u/5494631895";
  const _navbarList = [
    { text: "Home", link: "/" },
    {
      text: "Menu",
      items: [],
    },
    {
      text: "More",
      items: [
        { text: "Gitee「 码云 」", link: GITEE_URI, target: "_blank" },
        { text: "Weibo「 微博 」", link: WEIBO_URI, target: "_blank" },
      ],
    },
  ];
  dirs.forEach((_dirName) => {
    if (_dirName === ".DS_Store") return false;
    const _currentPathModel = {
      text: genFileRuleName(_dirName),
      link: `/${curMdFileName}/${_dirName}/`,
      target: ''
    };
    _navbarList[GUIDE_INDEX].items.push(_currentPathModel);
  });
  return _navbarList;
};

/**
 * 构建 Sidebar
 */
const buildSidebar = (dirs, mdDirPath) => {
  const _sidebarList = [
    {
      text: "Home",
      link: "/",
      collapsed: false,
    },
  ];
  const genSideBarItem = (_fileDirs, curPath, flag) => {
    return _fileDirs
      .map((_dir) => {
        if (~["index.md", ".DS_Store"].indexOf(_dir)) return false;
        const itemLinkPath = `${curPath}/${_dir}`;
        const _currentPathModel = {
          text: removeSuffix(genFileRuleName(_dir)),
          link: removeSuffix(itemLinkPath + `${!flag ? "/index" : ""}`),
          collapsed: false,
          items: []
        };
        const childDirPath = `${mdDirPath}/${_dir}`;
        if (!/\.md$/g.test(childDirPath)) {
          const childDirs = fs.readdirSync(childDirPath);
          if (childDirs && Array.isArray(childDirs) && childDirs.length) {
            if (!_currentPathModel.items) _currentPathModel.items = [];
            _currentPathModel.collapsed = true;
            _currentPathModel.items.push(
              ...genSideBarItem(childDirs, itemLinkPath, true)
            );
          }
        }
        return _currentPathModel;
      })
      .filter((_file) => _file);
  };
  _sidebarList.push(...genSideBarItem(dirs, `/${curMdFileName}`, false));
  return _sidebarList;
};

buildConfig();


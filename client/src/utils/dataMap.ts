export enum NavTag {
  Home = 'Home',
  Catalogue = 'Catalogue',
  About = 'About',
};

export interface INavItem {
  title: string;
  tag: NavTag;
  link: string;
};

export const navList: INavItem[] = [
  {
    title: "首页", tag: NavTag.Home, link: "/home",
  },
  {
    title: "目录", tag: NavTag.Catalogue, link: "/catalogue",
  },
  {
    title: "关于我", tag: NavTag.About, link: "/about",
  },
];

export interface ITagItem {
  id: string;
  name: string;
  color: string;
  fontColor: string;
  count?: string | number;
};

export interface IBlogItem {
  id: string;
  title: string;
  body: string;
  tagID: string;
  desc?: string;
  isTop?: boolean;
  createDate?: Date;
  updateDate?: Date;
};

export interface IBlogAndTagItem extends IBlogItem {
  tagInfo?: ITagItem;
};

export interface IHeaderItemModel {
  title: string;
  desc: string;
  img: string;
  tag?: string;
  tagColor?: string;
  tagFontColor?: string;
};

// 暂存
export const tagColorMap: string[] = [
  "magenta", "red", "volcano", "orange", "gold", "lime", "green", "cyan",
  "blue", "geekblue", "purple",
];

// 用于存储已显示过的错误消息路径
export const displayedErrors: Set<string> = new Set();

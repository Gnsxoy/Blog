import { observable, action, makeObservable } from "mobx";
import homeBG from "i@/home_bg.jpg";
import catalogueBG from "i@/catalogue_bg.jpg";
import aboutBG from "i@/about_bg.jpg";
import { NavTag, IHeaderItemModel } from "u@/dataMap";

type ExtendedNavTag = NavTag | 'BlogDetail' | 'NoMatch';
export default class SApp {
  constructor() {
    makeObservable(this);
  };

  @observable siteTag = "Gnsxoy";
  @observable loading = false;
  @observable activeTag = sessionStorage.getItem("activeTag") || NavTag.Home;
  @observable searchVal = "";
  @observable headerEl = {
    title: this.siteTag,
    desc: "Keep on going never give up",
    img: homeBG,
    tag: "",
    tagColor: "",
    tagFontColor: "#fff",
  };

  @action CHANGE_LOADING: (status: boolean) => void = (status) => {
    this.loading = status;
  };
  @action CHANGE_ACTIVE_TAG: (tag: string) => void = (tag) => {
    this.activeTag = tag;
  };
  @action CHANGE_SEARCH_VAL: (val: string) => void = (val) => {
    this.searchVal = val;
  };
  @action CHANGE_HEADER_EL: (
    headerTag: ExtendedNavTag,
    headerModel?: IHeaderItemModel
  ) => void = (headerTag, headerModel) => {
    const dispathNavFun: {
      [key in NavTag]: IHeaderItemModel
    } = {
      [NavTag.Home]: {
        title: this.siteTag,
        desc: "Keep on going never give up",
        img: homeBG,
      },
      [NavTag.Catalogue]: {
        title: "Catalogue",
        desc: "Here is the information you need",
        img: catalogueBG,
      },
      [NavTag.About]: {
        title: "About",
        desc: "Hi，⁽⁽ଘ( ˊᵕˋ )ଓ",
        img: aboutBG,
      },
    };

    const hasTag = Object.values(NavTag).includes(headerTag as NavTag);
    headerModel = hasTag ? dispathNavFun[headerTag as NavTag] : headerModel;
    this.headerEl = {
      ...this.headerEl,
      tag: '',
      ...headerModel,
    };
  };
}
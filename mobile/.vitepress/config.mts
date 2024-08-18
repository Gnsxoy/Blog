import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Gnsxoy",
  description: "这里是 Gnsxoy 的个人博客，学习记录，技术分享。",
  base: "/",
  themeConfig: {
    logo: '/avatar.jpg',
    search: {
      provider: 'local'
    },
    footer: {
      message: "Powered by Vitepress",
      copyright: 'Copyright © 2024 <a href="https://github.com/gnsxoy">Gnsxoy</a>'
    },

    // https://vitepress.dev/reference/default-theme-config
    nav: [
    {
        "text": "Home",
        "link": "/"
    },
    {
        "text": "Menu",
        "items": [
            {
                "text": "JS",
                "link": "/docs/JS/",
                "target": ""
            },
            {
                "text": "LeetCode",
                "link": "/docs/LeetCode/",
                "target": ""
            },
            {
                "text": "随笔",
                "link": "/docs/随笔/",
                "target": ""
            }
        ]
    },
    {
        "text": "More",
        "items": [
            {
                "text": "Gitee「 码云 」",
                "link": "https://gitee.com/gnsxoy",
                "target": "_blank"
            },
            {
                "text": "Weibo「 微博 」",
                "link": "https://weibo.com/u/5494631895",
                "target": "_blank"
            }
        ]
    }
],
    sidebar: [
    {
        "text": "Home",
        "link": "/",
        "collapsed": false
    },
    {
        "text": "JS",
        "link": "/docs/JS/index",
        "collapsed": true,
        "items": [
            {
                "text": "Axios源码解析",
                "link": "/docs/JS/Axios源码解析",
                "collapsed": false,
                "items": []
            },
            {
                "text": "常用函数",
                "link": "/docs/JS/常用函数",
                "collapsed": false,
                "items": []
            },
            {
                "text": "类型转换",
                "link": "/docs/JS/类型转换",
                "collapsed": false,
                "items": []
            }
        ]
    },
    {
        "text": "LeetCode",
        "link": "/docs/LeetCode/index",
        "collapsed": true,
        "items": [
            {
                "text": "*数之和",
                "link": "/docs/LeetCode/*数之和",
                "collapsed": false,
                "items": []
            },
            {
                "text": "反转链表",
                "link": "/docs/LeetCode/反转链表",
                "collapsed": false,
                "items": []
            }
        ]
    },
    {
        "text": "随笔",
        "link": "/docs/随笔/index",
        "collapsed": true,
        "items": [
            {
                "text": "「 记 」Set的一次遍历问题",
                "link": "/docs/随笔/「 记 」Set的一次遍历问题",
                "collapsed": false,
                "items": []
            },
            {
                "text": "「 记 」浅析对象与Map数据结构",
                "link": "/docs/随笔/「 记 」浅析对象与Map数据结构",
                "collapsed": false,
                "items": []
            }
        ]
    }
],
    socialLinks: [
    {
        "icon": "github",
        "link": "https://github.com/gnsxoy"
    },
    {
        "icon": {
            "svg": "<?xml version=\"1.0\" standalone=\"no\"?><!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\"><svg t=\"1722840943735\" class=\"icon\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" p-id=\"843\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" width=\"200\" height=\"200\"><path d=\"M337.387283 341.82659c-17.757225 0-35.514451 11.83815-35.514451 29.595375s17.757225 29.595376 35.514451 29.595376 29.595376-11.83815 29.595376-29.595376c0-18.49711-11.83815-29.595376-29.595376-29.595375zM577.849711 513.479769c-11.83815 0-22.936416 12.578035-22.936416 23.6763 0 12.578035 11.83815 23.676301 22.936416 23.676301 17.757225 0 29.595376-11.83815 29.595376-23.676301s-11.83815-23.676301-29.595376-23.6763zM501.641618 401.017341c17.757225 0 29.595376-12.578035 29.595376-29.595376 0-17.757225-11.83815-29.595376-29.595376-29.595375s-35.514451 11.83815-35.51445 29.595375 17.757225 29.595376 35.51445 29.595376zM706.589595 513.479769c-11.83815 0-22.936416 12.578035-22.936416 23.6763 0 12.578035 11.83815 23.676301 22.936416 23.676301 17.757225 0 29.595376-11.83815 29.595376-23.676301s-11.83815-23.676301-29.595376-23.6763z\" fill=\"#28C445\" p-id=\"844\"></path><path d=\"M510.520231 2.959538C228.624277 2.959538 0 231.583815 0 513.479769s228.624277 510.520231 510.520231 510.520231 510.520231-228.624277 510.520231-510.520231-228.624277-510.520231-510.520231-510.520231zM413.595376 644.439306c-29.595376 0-53.271676-5.919075-81.387284-12.578034l-81.387283 41.433526 22.936416-71.768786c-58.450867-41.433526-93.965318-95.445087-93.965317-159.815029 0-113.202312 105.803468-201.988439 233.803468-201.98844 114.682081 0 216.046243 71.028902 236.023121 166.473989-7.398844-0.739884-14.797688-1.479769-22.196532-1.479769-110.982659 1.479769-198.289017 85.086705-198.289017 188.67052 0 17.017341 2.959538 33.294798 7.398844 49.572255-7.398844 0.739884-15.537572 1.479769-22.936416 1.479768z m346.265896 82.867052l17.757225 59.190752-63.630058-35.514451c-22.936416 5.919075-46.612717 11.83815-70.289017 11.83815-111.722543 0-199.768786-76.947977-199.768786-172.393063-0.739884-94.705202 87.306358-171.653179 198.289017-171.65318 105.803468 0 199.028902 77.687861 199.028902 172.393064 0 53.271676-34.774566 100.624277-81.387283 136.138728z\" fill=\"#28C445\" p-id=\"845\"></path></svg>"
        },
        "link": "https://www.gnsxoy.com/qr-code/wx/"
    }
],
  },
  lastUpdated: true, // 开启最后更新时间
})

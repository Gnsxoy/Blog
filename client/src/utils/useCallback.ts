/**
 * [自定义/系统]Hook，都不可以在普通函数中运行，只能在 其他Hook/组件 中运行。
 */
import {
  useEffect, useLayoutEffect, useRef, useState
} from "react";

/**
 * 自定义 Hook - 防抖
 * 使用该 Hook 可以延迟处理输入值的变化，直到用户停止输入一段时间后再执行相应的操作。
 * @param {T} value 输入的值，可以是任意类型
 * @param {number} delay 延迟执行的毫秒数
 * @returns {T} 防抖后的值，经过一定延迟后的最终值
 */
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // 设置一个定时器
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // 在每次依赖项 value 变化时清除上一个定时器
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * 自定义 Hook - 获取窗口尺寸
 * 使用 useLayoutEffect 监听窗口 resize 事件
 * @returns {Object} 包含当前窗口宽度和高度的对象 { width, height }
 */
export const useWindowSize = (): { width: number; height: number } => {
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useLayoutEffect(() => {
    const handleResize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };

    // 添加 resize 事件监听器
    window.addEventListener('resize', handleResize);
    // 在清理函数中移除事件监听器
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // 依赖项为空数组，表示只在组件挂载和卸载时执行一次

  return size;
};

/**
 * 自定义 Hook - 获取页面滚动位置
 * 使用该 Hook 可以获取当前页面的水平和垂直滚动距离，并在滚动时实时更新。
 * @returns {{ x: number; y: number }} 包含当前页面水平和垂直滚动距离的对象
 */
export const useScrollPosition = (): { x: number; y: number } => {
  const [scrollPosition, setScrollPosition] = useState({ x: window.scrollX, y: window.scrollY });

  useEffect(() => {
    // 定义事件处理函数，更新 scrollPosition 的值为当前页面的滚动距离
    const handleScroll = () => {
      setScrollPosition({ x: window.scrollX, y: window.scrollY });
    };

    // 添加 scroll 事件监听器
    window.addEventListener('scroll', handleScroll);
    // 在清理函数中移除 scroll 事件监听器，避免内存泄漏
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // 依赖项为空数组，表示只在组件挂载和卸载时执行一次

  // 返回包含当前页面水平和垂直滚动距离的对象
  return scrollPosition;
};

/**
 * 自定义 Hook - 初始化加载事件
 * 使用该 Hook 可以在组件初始化加载时执行指定的事件，仅执行一次。
 * @param {Function} callback 初始化加载时执行的回调函数
 */
export const useInitLoad = (callback: () => void): void => {
  useEffect(() => {
    // 执行初始化加载时的回调函数
    callback();
  }, []); // 依赖项为空数组，表示只在组件挂载时执行一次
};

/**
 * 自定义 Hook - 动态设置页面标题
 * 使用该 Hook 可以动态设置页面的标题，并在页面卸载时选择是否保留当前标题。
 * @param {string} title 要设置的页面标题
 * @param {boolean} keepOnUnmount 是否在页面卸载时保留当前标题，默认为 true
 */
export const useDocumentTitle = (title: string, keepOnUnmount = true) => {
  // 使用 useRef 缓存页面加载时的标题
  const oldTitle = useRef(document.title).current;

  // 在传入的 title 变化时更新页面标题
  useEffect(() => {
    document.title = title;
  }, [title]);

  // 在组件卸载时恢复原始标题
  useEffect(() => {
    return () => {
      if (!keepOnUnmount) {
        document.title = oldTitle;
      }
    };
  }, [keepOnUnmount, oldTitle]);
};

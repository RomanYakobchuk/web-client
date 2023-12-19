// import {useCallback, useEffect, useRef} from "react";
//
// const KEY = "useScrollRestoration-store";
//
// interface ScrollInfo {
//     top: number;
//     left: number;
// }
//
// let scrolls: Record<string, ScrollInfo>;
// let storageAvailable = true;
//
// try {
//     scrolls = JSON.parse(sessionStorage.getItem(KEY) ?? "{}");
// } catch (e) {
//     const params = new URLSearchParams(
//         new URL(window.location.href).searchParams
//     );
//     storageAvailable = false;
//     scrolls = JSON.parse(params.get("__scrollInfo") ?? "{}");
// }
//
// /**
//  * Do nothing
//  */
// function noop(): void {
// }
//
// function removeScrollParameter(href: string): string {
//     href = href.replace(/__scrollInfo=[^&]+/gi, "");
//     if (href.endsWith("/?")) return href.slice(0, -2);
//     if (href.endsWith("/")) return href.slice(0, -1);
//     return href;
// }
//
// /**
//  * Custom hook for restoring scroll position based on a unique key. The hook returns a callback function
//  * that should be set on the JSX element's ref attribute to manage scroll restoration.
//  *
//  * @param {string} [key=window.location.href] - A unique key to identify the scroll position, defaults to current URL.
//  * @param {number} [timeout=500] - A timeout after which the scroll will not be restored, defaults to 1/2 a second.
//  * @returns {Function} A callback function to set as the `ref` on a scrollable JSX element.
//  *
//  * @example
//  * const scrollRef = useScrollRestoration();
//  * return <div ref={scrollRef}>Your Content Here</div>;
//  */
//
// export function useScrollRestoration(
//     key: string = window.location.href,
//     timeout: number = 1500
// ): (ref: HTMLElement | null) => void {
//     key = removeScrollParameter(key);
//     const tracked = useRef<HTMLElement | null>(null);
//
//     const updateTimer = useRef<NodeJS.Timeout>();
//     const handler = useRef<Function>(() => {
//     });
//     const cleanUp = useRef<Function>(() => {
//     });
//
//     function disconnect(): void {
//         handler.current();
//         cleanUp.current();
//     }
//
//     function connect(ref: HTMLElement | null): void {
//         try {
//             function store(): void {
//                 if (ref) {
//                     scrolls[key] = {
//                         top: ref.scrollTop,
//                         left: ref.scrollLeft
//                     };
//                     clearTimeout(updateTimer.current);
//                     updateTimer.current = setTimeout(() => {
//                         if (storageAvailable) {
//                             sessionStorage.setItem(KEY, JSON.stringify(scrolls));
//                         } else {
//                             const url = new URL(window.location.href);
//                             const params = new URLSearchParams(url.searchParams);
//                             params.set("__scrollInfo", JSON.stringify(scrolls));
//                             url.search = params.toString();
//                             window.history.replaceState(null, "", url.toString());
//                         }
//                     }, 50);
//                 }
//             }
//
//             disconnect();
//             tracked.current = ref;
//             if (ref) {
//                 ref.addEventListener("scroll", store);
//                 handler.current = () => {
//                     ref.removeEventListener("scroll", store);
//                 };
//
//                 const scrollInfo = scrolls[key];
//                 if (scrollInfo) {
//                     ref.scrollTop = scrollInfo.top;
//                     ref.scrollLeft = scrollInfo.left;
//                     const resizeObserver = new ResizeObserver(() => {
//                         if (
//                             ref.scrollHeight > scrollInfo.top ||
//                             ref.scrollWidth > scrollInfo.left
//                         ) {
//                             ref.scrollTop = scrollInfo.top;
//                             ref.scrollLeft = scrollInfo.left;
//                             cleanUp.current();
//                         }
//                     });
//                     setTimeout(() => cleanUp.current(), timeout);
//
//                     resizeObserver.observe(ref);
//                     cleanUp.current = () => {
//                         resizeObserver.unobserve(ref);
//                         cleanUp.current = noop;
//                     };
//                 }
//             }
//         } catch (e) {
//             console.log(e)
//         }
//     }
//
//     const connectRef = useCallback(connect, [key, timeout]);
//
//     useEffect(() => {
//         if (tracked.current) {
//             const scrollInfo = scrolls[key];
//             if (scrollInfo) {
//                 tracked.current.scrollTop = scrollInfo.top;
//             } else {
//                 tracked.current.scrollTop = 0;
//             }
//             connectRef(tracked.current);
//         }
//         return disconnect;
//     }, [connectRef]);
//
//
//     return connectRef;
// }
import {useCallback, useEffect, useRef} from "react";

const KEY = "useScrollRestoration-store";

interface ScrollInfo {
    top: number;
    left: number;
}

let scrolls: Record<string, ScrollInfo>;
let storageAvailable = true;

try {
    scrolls = JSON.parse(sessionStorage.getItem(KEY) ?? "{}");
} catch (e) {
    const params = new URLSearchParams(
        new URL(window.location.pathname).searchParams
    );
    storageAvailable = false;
    scrolls = JSON.parse(params.get("__scrollInfo") ?? "{}");
}

/**
 * Do nothing
 */
function noop(): void {
}


function removeScrollParameter(href: string): string {
    href = href.replace(/__scrollInfo=[^&]+/gi, "");
    if (href.endsWith("/?")) return href.slice(0, -2);
    if (href.endsWith("/")) return href.slice(0, -1);
    return href;
}

/**
 * Custom hook for restoring scroll position based on a unique key. The hook returns a callback function
 * that should be set on the JSX element's ref attribute to manage scroll restoration.
 *
 * @param {string} [key=window.location.pathname] - A unique key to identify the scroll position, defaults to current URL.
 * @param {number} [timeout=500] - A timeout after which the scroll will not be restored, defaults to 1/2 a second.
 * @returns {Function} A callback function to set as the `ref` on a scrollable JSX element.
 *
 * @example
 * const scrollRef = useScrollRestoration();
 * return <div ref={scrollRef}>Your Content Here</div>;
 */

export function useScrollRestoration(
    key: string = window.location.pathname,
    timeout: number = 1500
): (ref: HTMLElement | null) => void {
    key = removeScrollParameter(key);
    const tracked = useRef<HTMLElement | null>(null);

    const updateTimer = useRef<NodeJS.Timeout>();
    const handler = useRef<Function>(() => {
    });
    const cleanUp = useRef<Function>(() => {
    });

    function disconnect(): void {
        handler.current();
        cleanUp.current();
    }

    function connect(ref: HTMLElement | null): void {
        try {
            function store(): void {
                if (ref) {
                    scrolls[key] = {
                        top: ref.scrollTop,
                        left: ref.scrollLeft
                    };
                    clearTimeout(updateTimer.current);
                    updateTimer.current = setTimeout(() => {
                        if (storageAvailable) {
                            sessionStorage.setItem(KEY, JSON.stringify(scrolls));
                        } else {
                            const url = new URL(window.location.pathname);
                            const params = new URLSearchParams(url.searchParams);
                            params.set("__scrollInfo", JSON.stringify(scrolls));
                            url.search = params.toString();
                            window.history.replaceState(null, "", url.toString());
                        }
                    }, 50);
                }
            }

            disconnect();
            tracked.current = ref;
            if (ref) {
                ref.addEventListener("scroll", store);
                handler.current = () => {
                    ref.removeEventListener("scroll", store);
                };

                const scrollInfo = scrolls[key];
                if (scrollInfo) {
                    ref.scrollTop = scrollInfo.top;
                    ref.scrollLeft = scrollInfo.left;
                    const resizeObserver = new ResizeObserver(() => {
                        if (
                            ref.scrollHeight > scrollInfo.top ||
                            ref.scrollWidth > scrollInfo.left
                        ) {
                            ref.scrollTop = scrollInfo.top;
                            ref.scrollLeft = scrollInfo.left;
                            cleanUp.current();
                        }
                    });
                    setTimeout(() => cleanUp.current(), timeout);

                    resizeObserver.observe(ref);
                    cleanUp.current = () => {
                        resizeObserver.unobserve(ref);
                        cleanUp.current = noop;
                    };
                }
            }
        } catch (e) {
            console.log(e)
        }
    }

    const connectRef = useCallback(connect, [key, timeout]);

    useEffect(() => {
        if (tracked.current) {
            const scrollInfo = scrolls[key];
            if (scrollInfo) {
                setTimeout(() => {
                    if (tracked.current) {
                        tracked.current.scrollTop = scrollInfo.top;
                    }
                }, 100)
            } else {
                tracked.current.scrollTop = 0;
            }
            connectRef(tracked.current);
        }
        return disconnect;
    }, [connectRef]);


    return connectRef;
}
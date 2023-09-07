// chrome.storage.sync.set({
//    blockRules: {
//        whiteList: [
//            "https://www.bilibili.com/list/360996402",
//            "https://www.youtube.com/watch?v=bIDwiTNtvCE",
//        ],
//
//        blackList: [
//            "*://www.bilibili.com/*",
//            "*://www.youtube.com/*",
//            "*://www.zhihu.com/*",
//        ]
//     }
// });

function block() {
    chrome.storage.sync.get(["blockRules"], res => {
        console.log( res );
        chrome.webRequest.onBeforeRequest.addListener(
            function(details) {
                const whiteList = res.blockRules.whiteList;
                const url = new URL(details.url);
                const stripped = url.origin + url.pathname;

                console.log( whiteList, stripped, details.url );
                if( whiteList.includes(stripped) || whiteList.includes(details.url)) {
                    return;
                }

                return {cancel: true};
            },
            {urls: res.blockRules.blackList},
            ["blocking"]
        );
    });
}

block();

chrome.runtime.onMessage.addListener( function(request, sender) {
    block();
});

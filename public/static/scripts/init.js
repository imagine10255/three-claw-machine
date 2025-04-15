


/**
 * 修復Android vh高度會算到 container的解法
 * https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
 */
function fixAndroidVh(){
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);

    window.addEventListener('resize', event => {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }, {passive: false});
}


/**
 * 禁用手機手勢縮放
 */
function disableMobileZoom(){
    document.addEventListener('touchstart', event => {
        if (event.touches.length > 1) {
            event.preventDefault();
        }
    }, {passive: false});

    let lastTouchEnd = 0;
    document.addEventListener('touchend', event => {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
}


window.onload = () => {
    fixAndroidVh();
    disableMobileZoom();
};

import debounce from './debounce';
import Http, { Https, tryAgainMsg } from './http';

// Safari 3.0+ "[object HTMLElementConstructor]"
// const isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));
let isChrome = navigator.userAgent.indexOf('Chrome') > -1;
const isIE = navigator.userAgent.indexOf('MSIE') > -1;
var isSafari = navigator.userAgent.indexOf('Safari') > -1;
const isOpera = navigator.userAgent.toLowerCase().indexOf('op') > -1;
if (isChrome && isSafari) {
	isSafari = false;
}
if (isChrome && isOpera) {
	isChrome = false;
}

const isFirefox = typeof InstallTrigger !== 'undefined';

// Chrome 1 - 79
// const isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);

// Opera 8.0+
// const isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

// Internet Explorer 6-11
// const isIE = /*@cc_on!@*/false || !!document.documentMode;

// Edge 20+
const isEdge = !isIE && !!window.StyleMedia;

// Edge (based on chromium) detection
//const isEdgeChromium = isChrome && (navigator.userAgent.indexOf("Edg") != -1);

// Blink engine detection
const isBlink = (isChrome || isOpera) && !!window.CSS;

export { debounce, Http, Https, tryAgainMsg, isBlink, isChrome, isEdge, isFirefox, isIE, isSafari };
export {
	downloadUserDetails,
	userID,
	userDetails,
	getUserDetails,
	saveUserDetails,
	signOut,
	getLocalStore,
	saveToLocalStore,
} from './auth';

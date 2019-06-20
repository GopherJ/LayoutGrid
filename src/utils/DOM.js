let currentDir = 'auto';

/**
 *
 * @return {boolean}
 */
function hasDocument(){
    return (typeof document !== "undefined");
}

/**
 *
 * @return {boolean}
 */
function hasWindow(){
    return (typeof window !== 'undefined');
}

/**
 *
 * @return {string}
 */
export function getDocumentDir(){
    if(!hasDocument()){
        return currentDir;
    }
    const  direction = (typeof document.dir !== "undefined") ?
        document.dir :
        document.getElementsByTagName("html")[0].getAttribute("dir");
    return direction;
}

/**
 *
 * @param dir
 */
export function setDocumentDir(dir){
    if(!hasDocument){
        currentDir = dir;
        return;
    }

    const html = document.getElementsByTagName("html")[0];
    html.setAttribute("dir", dir);
}

/**
 *
 * @param event
 * @param callback
 */
export function addWindowEventListener(event, callback){
    if(!hasWindow){

        callback();
        return;
    }

    window.addEventListener(event, callback);
}

/**
 *
 * @param event
 * @param callback
 */
export function removeWindowEventListener(event, callback){
    if(!hasWindow){
        return;
    }

    window.removeEventListener(event, callback);
}

/*
 * ADOBE CONFIDENTIAL
 *
 * Copyright 2018 Adobe Systems Incorporated
 * All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Adobe Systems Incorporated and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Adobe Systems Incorporated and its
 * suppliers and may be covered by U.S. and Foreign Patents,
 * patents in process, and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe Systems Incorporated.
 */

/**
 * Selector that identifies the node that contains the WCM mode state
 *
 * @type {string}
 * @private
 */
const WCM_MODE_META_SELECTOR = 'meta[property="cq:wcmmode"]';

/**
 * The editor is in one of the edition modes
 */
const EDIT_MODE = 'edit';

/**
 * The editor is in preview mode
 */
const PREVIEW_MODE = 'preview';
/**
 * Returns if we are in the browser context or not by checking for the 
 * existance of the window object
 *
 * @returns {Boolean} the result of the check of the existance of the window object
 */
function isBrowser() {
    try {
        return typeof window !== 'undefined';
    }catch(e){ 
        return false;
    }
}
/**
 * Returns the current WCM mode
 *
 * <p>Note that the value isn't, as of the date of this writing, updated by the editor</p>
 *
 * @returns {string|undefined}
 *
 * @private
 */
function getWCMMode() {
    if (isBrowser()){
        const wcmModeMeta = document.head.querySelector(WCM_MODE_META_SELECTOR);
        return wcmModeMeta && wcmModeMeta.content;
    }
    return false;
}

/**
 * Helper functions for interacting with the AEM environment
 *
 * @namespace Utils
 */
const Utils = {

    /**
     * Is the app used in the context of the AEM Page editor
     *
     * @returns {boolean}
     */
    isInEditor() {
        const wcmMode = getWCMMode();
        return wcmMode && (EDIT_MODE === wcmMode || PREVIEW_MODE === wcmMode);
    },

    /**
     * Transforms the item data to component properties
     * It will replace ":" with "cq" and convert the name to CameCase
     *
     * @private
     * @param   {Object} item - the item data
     * @returns {Object} the transformed data
     */
    modelToProps(item) {

        if (!item) {
            return {};
        }

        let keys = Object.getOwnPropertyNames(item);
        let props = {};

        keys.forEach((key) => {
            let propKey = key;

            if (propKey.startsWith(":")) {
                // Transformation of internal properties namespaced with [:] to [cq]
                // :myProperty => cqMyProperty
                let tempKey = propKey.substr(1);
                propKey = "cq" + tempKey.substr(0, 1).toUpperCase() + tempKey.substr(1);
            }

            props[propKey] = item[key];
        });

        return props;
    }
};

export default Utils;

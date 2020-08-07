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

import { Model } from '@adobe/cq-spa-page-model-manager';

class NotImplementedError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'NotImplementedError';
    }
}

export { NotImplementedError };

/**
 * Selector that identifies the node that contains the WCM mode state
 *
 * @type {string}
 * @private
 */
const WCM_MODE_META_SELECTOR = 'meta[property="cq:wcmmode"]';

export enum WCMMode {
    /**
     * The editor is in one of the edition modes.
     */
    EDIT = 'edit',

    /**
     * The editor is in preview mode.
     */
    PREVIEW = 'preview',

    /**
     * The editor mode is disabled.
     */
    DISABLED = 'disabled'
}

/**
 * Returns if we are in the browser context or not by checking for the
 * existance of the window object.
 *
 * @returns {Boolean} the result of the check of the existance of the window object
 */
function isBrowser() {
    try {
        return typeof window !== 'undefined';
    } catch (e) {
        return false;
    }
}

/**
 * Returns the current WCM mode.
 *
 * <p>Note that the value isn't, as of the date of this writing, updated by the editor</p>
 *
 * @returns {string|undefined}
 * @private
 */
function getWCMMode(): WCMMode | boolean {
    if (isBrowser()) {
        const wcmModeMeta = document.head.querySelector(WCM_MODE_META_SELECTOR);

        // @ts-ignore
        if (wcmModeMeta && wcmModeMeta.content) {
            // @ts-ignore
            const content: string = wcmModeMeta.content;

            return content as WCMMode;
        }

        return WCMMode.DISABLED;
    }

    return false;
}

/**
 * Helper functions for interacting with the AEM environment.
 */
const Utils = {
    /**
     * Is the app used in the context of the AEM Page editor.
     *
     * @returns {boolean}
     */
    isInEditor() {
        const wcmMode = getWCMMode();

        return wcmMode && ((WCMMode.EDIT === wcmMode) || (WCMMode.PREVIEW === wcmMode));
    },

    /**
     * Transforms the item data to component properties.
     * It will replace ':' with 'cq' and convert the name to CameCase.
     *
     * @private
     * @param {Object} item - the item data
     * @returns {Object} the transformed data
     */
    modelToProps(item: Model) {
        const keys = Object.getOwnPropertyNames(item);
        const props: any = {};

        keys.forEach((key) => {
            let propKey: string = key;

            if (propKey.startsWith(':')) {
                // Transformation of internal properties namespaced with [:] to [cq]
                // :myProperty => cqMyProperty
                const tempKey = propKey.substr(1);

                propKey = 'cq' + tempKey.substr(0, 1).toUpperCase() + tempKey.substr(1);
            }

            // @ts-ignore
            props[propKey] = item[key];
        });

        return props;
    }
};

export default Utils;

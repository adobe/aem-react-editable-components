/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import { normalize as normalizePath } from 'path';
import { Model, ModelManager, PathUtils } from '@adobe/aem-spa-page-model-manager';

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
function isBrowser(): boolean {
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

interface ComponentProps {
    pagePath?: string;
    itemPath?: string;
    cqPath?: string;
    /**
     * Should the component data be retrieved from the aem page model
     * and passed down as props on componentMount
     */
    injectPropsOnInit?: boolean;
    history?: any;
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
    isInEditor(): boolean {
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
    },

    /**
     * Determines the cqPath of a component given its props
     *
     * @private
     * @returns cqPath of the component
     */
    getCQPath(componentProps: ComponentProps): string {
        const {
            pagePath = '', itemPath = '', injectPropsOnInit
        } = componentProps;

        let { cqPath = '' } = componentProps;

        if (injectPropsOnInit && !cqPath) {
            cqPath = (
                itemPath ?
                `${pagePath}/jcr:content/${itemPath}` :
                pagePath
            );

            // Normalize path (replace multiple consecutive slashes with a single one).
            cqPath = normalizePath(cqPath);
        }
        return cqPath;
    },

    fetchModelOnBackNav(componentProps: ComponentProps): void {
        const { cqPath, history } = componentProps;

        window.onpopstate = () => {
            const currentPath = PathUtils.sanitize(history.location.pathname) || '';

            if (cqPath !== currentPath) {
                ModelManager.getData({ path: currentPath });
            }
        }
    },
};

export default Utils;

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
import { AEM_MODE, Model, PathUtils, AuthoringUtils } from '@adobe/aem-spa-page-model-manager';
import { Constants } from './Constants';

/**
 * Returns the current WCM mode based on meta property.
 * @private
 */
function getWCMMode(): AEM_MODE {
    let wcmMode = null;

    if (PathUtils.isBrowser()) {
        const wcmModeMeta = document.head.querySelector(Constants._WCM_MODE_META_SELECTOR);

        wcmMode = wcmModeMeta?.getAttribute('content') as AEM_MODE;
    }

    return wcmMode || AEM_MODE.DISABLED;
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
}

/**
 * Helper functions for interacting with the AEM environment.
 */
const Utils = {
    /**
     * Is the app used in the context of the AEM Page editor.
     */
    isInEditor(): boolean {
        return [ AEM_MODE.EDIT, AEM_MODE.PREVIEW ].includes(getWCMMode()) || AuthoringUtils.isRemoteApp();
    },

    /**
     * Transforms the item data to component properties.
     * It will replace ':' with 'cq' and convert the name to CameCase.
     *
     * @private
     * @param item - the item data
     * @returns the transformed data
     */
    modelToProps(item: Model) {
        const keys = Object.getOwnPropertyNames(item);
        const props: any = {};

        keys.forEach((key) => {
            let propKey: string = key;

            if (propKey.startsWith(':')) {
                propKey = transformToCQ(propKey);
            }

            // @ts-ignore
            props[propKey] = item[key];
        });

        return props;

        /**
         * Transformation of internal properties namespaced with [:] to [cq]
         * :myProperty => cqMyProperty
         * @param propKey
         */
        function transformToCQ(propKey: string) {
            const tempKey = propKey.substr(1);

            return 'cq' + tempKey.substr(0, 1).toUpperCase() + tempKey.substr(1);
        }
    },

    /**
     * Determines the cqPath of a component given its props
     *
     * @private
     * @returns cqPath of the component
     */
    getCQPath(componentProps: ComponentProps): string {
        const { pagePath = '', itemPath = '', injectPropsOnInit } = componentProps;
        let { cqPath = '' } = componentProps;

        if (injectPropsOnInit && !cqPath) {
            cqPath = normalizePath(itemPath ? `${pagePath}/jcr:content/${itemPath}` : pagePath);
        }

        return cqPath;
    }

};

export default Utils;

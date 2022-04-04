/*
 * Copyright 2022 Adobe. All rights reserved.
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
import { Model } from '@adobe/aem-spa-page-model-manager';
import { ModelProps } from '../types/AEMModel';

interface ComponentProps {
  pagePath?: string;
  itemPath?: string;
  cqPath?: string;
}

/**
 * Transformation of internal properties namespaced with [:] to [cq]
 * :myProperty => cqMyProperty
 * @param propKey
 */
function transformToCQ(propKey: string) {
  const tempKey = propKey.substr(1);

  return 'cq' + tempKey.substr(0, 1).toUpperCase() + tempKey.substr(1);
}

/**
 * Helper functions for interacting with the AEM environment.
 */
const Utils = {
  /**
   * Transforms the item data to component properties.
   * It will replace ':' with 'cq' and convert the name to CameCase.
   *
   * @private
   * @param item - the item data
   * @returns the transformed data
   */
  modelToProps(item: Model): ModelProps {
    if (!item || !Object.keys(item).length) {
      return { cqPath: '' };
    }

    const keys = Object.getOwnPropertyNames(item);
    const props: any = {};

    keys.forEach((key: string) => {
      let propKey: string = key;

      if (propKey.startsWith(':')) {
        propKey = transformToCQ(propKey);
      }

      props[propKey] = item[key as keyof Model] || '';
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
    const { pagePath = '', itemPath = '', cqPath = '' } = componentProps;

    if (pagePath && !cqPath) {
      return normalizePath(itemPath ? `${pagePath}/jcr:content/${itemPath}` : pagePath);
    }

    return cqPath;
  },
};

export { Utils };

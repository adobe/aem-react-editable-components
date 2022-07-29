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
import { ModelManager } from '@adobe/aem-spa-page-model-manager';
import { Utils } from '../utils/Utils';
import { sanitizeUrl } from '@braintree/sanitize-url';
import { ModelProps } from '../types/AEMModel';

type RequireAtLeastOne<T> = { [K in keyof T]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<keyof T, K>>> }[keyof T];

export interface Path {
  cqPath: string;
  pagePath: string;
}

export type FetchProps = RequireAtLeastOne<Path> & {
  forceReload?: boolean;
  host?: string;
  options?: {
    headers?: HeadersInit;
  };
  itemPath?: string;
};

/**
 * Fetch the model for a given path from AEM
 *
 * @param {Object} options
 * @param options.cqPath Complete path to component on AEM
 * @param options.pagePath Path to page containing the desired component
 * @param options.itemPath Path to item within the page defined by pagePath
 * @param options.host Host information of the AEM instance if fetch is to be done prior to ModelManager init
 * @param options.options Fetch request options is fetching model using host
 
 * @returns The fetched model transformed into usable props
 */
export async function fetchModel({
  cqPath,
  forceReload = false,
  pagePath,
  itemPath,
  host,
  options,
}: FetchProps): Promise<ModelProps> {
  let model = {},
    data;
  if (cqPath || pagePath) {
    const path = (cqPath && sanitizeUrl(cqPath)) || Utils.getCQPath({ pagePath, itemPath });
    if (host) {
      const hostURL = sanitizeUrl(`${host}/${path}`).replace(/\/+/g, '/');
      const response = await fetch(`${hostURL}.model.json`, options);
      if (response.ok) {
        data = await response.json();
      }
    } else {
      data = await ModelManager.getData({ path, forceReload }).catch((err: Error) => console.error(err));
    }
    if (data && Object.keys(data).length) {
      model = Utils.modelToProps(data);
    }
  }
  return model;
}

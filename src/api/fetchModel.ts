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

type Props = {
  cqPath?: string;
  forceReload?: boolean;
  pagePath?: string;
  itemPath?: string;
  host?: string;
  options?: any;
};

export async function fetchModel({ cqPath, forceReload = false, pagePath, itemPath, host, options }: Props) {
  let model = {},
    data;
  if (cqPath || pagePath) {
    const path = (cqPath && sanitizeUrl(cqPath)) || Utils.getCQPath({ pagePath, itemPath });
    if (host) {
      const response = await fetch(`${host}${path}.model.json`, options);
      if (response.ok) {
        data = await response.json();
      }
    } else {
      data = await ModelManager.getData({ path, forceReload }).catch((err) => console.error(err));
    }
    if (data && Object.keys(data).length) {
      model = Utils.modelToProps(data);
    }
  }
  return model;
}

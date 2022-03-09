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
import { Constants } from '@adobe/aem-spa-page-model-manager';

/**
 * Constants for interacting with AEM components.
 */
export const Properties = Object.freeze({
  /**
   * Name of the data-cq-data-path data attribute.
   */
  DATA_PATH_ATTR: 'data-cq-data-path',
  /**
   * Name of the data-resource-type data attribute.
   */
  DATA_CQ_RESOURCE_TYPE_ATTR: 'data-cq-resource-type',
  /**
   * Event which indicates that content of remote component has been fetched and loaded in the app
   */
  ASYNC_CONTENT_LOADED_EVENT: 'cq-async-content-loaded',
  /**
   * Selector for WCM mode state meta property.
   */
  _WCM_MODE_META_SELECTOR: 'meta[property="cq:wcmmode"]',

  TYPE: Constants.TYPE_PROP,
  ITEMS: Constants.ITEMS_PROP,
  ITEMS_ORDER: Constants.ITEMS_ORDER_PROP,
  PATH: Constants.PATH_PROP,
  CHILDREN: Constants.CHILDREN_PROP,
  HIERARCHY_TYPE: Constants.HIERARCHY_TYPE_PROP,
  JCR_CONTENT: Constants.JCR_CONTENT,
});

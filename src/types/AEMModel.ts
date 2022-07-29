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
import { Model } from '@adobe/aem-spa-page-model-manager';

/**
 * Component that is allowed to be used on the page by the editor.
 */
export type AllowedComponent = {
  path: string;
  title: string;
};

export type AllowedComponentList = {
  /**
   * Should AllowedComponents list be applied.
   */
  applicable: boolean;
  components: AllowedComponent[];
};

export interface PageModel extends Model {
  ':type': string;
  id: string;
  ':path': string;
  ':children'?: { [key: string]: PageModel };
}

export type ModelProps = {
  cqPath?: string;
  cqItems?: { [key: string]: Model };
  cqItemsOrder?: string[];
  cqType?: string;
  cqChildren?: { [key: string]: PageModel };
  appliedCssClassNames?: string;
};

export type ResponsiveGridProps = {
  gridClassNames: string;
  columnClassNames: { [key: string]: string };
  allowedComponents: AllowedComponentList;
  columnCount?: string;
} & ModelProps;

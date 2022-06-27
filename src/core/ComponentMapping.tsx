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

import { ComponentType } from 'react';
import { ComponentMapping } from '@adobe/aem-spa-component-mapping';
import { MappedComponentProperties } from '../types/EditConfig';

/**
 * @private
 */
const wrappedMapFct = ComponentMapping.map;
/**
 * @private
 */
const wrappedGetFct = ComponentMapping.get;

/**
 * Map a React component with the given resource types.
 * If an {@link EditConfig} is provided the component is wrapped to provide editing capabilities on the AEM Page Editor
 *
 * @param resourceTypes List of resource types for which to use the given component.
 * @param component React representation for the given resource types.
 * @param editConfig Configuration object for enabling the edition capabilities.
 * @param config Model configuration object.
 * @returns The resulting decorated Component
 */
ComponentMapping.map = function map<P extends MappedComponentProperties>(
  resourceTypes: string | string[],
  component: ComponentType<P>,
) {
  wrappedMapFct.call(ComponentMapping, resourceTypes, component);
  return component;
};

ComponentMapping.get = wrappedGetFct;

/**
 * @private
 */
type MapperFunction<P extends MappedComponentProperties> = (_component: ComponentType<P>) => ComponentType<P>;

const MapTo = <P extends MappedComponentProperties>(resourceTypes: string | string[]): MapperFunction<P> => {
  const mapper = (component: ComponentType<P>) => ComponentMapping.map(resourceTypes, component);

  return mapper as MapperFunction<P>;
};

export { ComponentMapping, MapTo };

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

import React, { ComponentType } from 'react';
import { ComponentMapping } from '@adobe/aem-spa-component-mapping';
import { EditConfig, withEditable } from './components/EditableComponent';
import { ReloadableModelProperties, withModel } from './components/ModelProvider';
import { withEditorContext } from './EditorContext';

/**
 * @private
 */
const wrappedMapFct = ComponentMapping.map;
/**
 * @private
 */
const wrappedGetFct = ComponentMapping.get;

/**
 * Hold force reload state.
 */
export interface ReloadForceAble {
  /*
   * Should the model cache be ignored when processing the component.
   */
  cqForceReload?: boolean;
}

/**
 * Properties given to every component runtime by the SPA editor.
 */
export interface MappedComponentProperties extends ReloadForceAble {
  isInEditor: boolean;
  cqPath: string;
  appliedCssClassNames?: string;
  aemNoDecoration?: boolean;
}

/**
 * Makes a React component mappable to AEM resourceTypes by adding Model config and AEM editing capabilities to it.
 *
 * @param component React representation for the component
 * @param editConfig Configuration object for enabling the edition capabilities.
 * @param config Model configuration object.
 * @returns The resulting decorated Component
 */
const withMappable = <P extends MappedComponentProperties>(
  component: ComponentType<P>,
  editConfig?: EditConfig<P>,
  config?: ReloadableModelProperties,
): ComponentType<P> => {
  const { injectPropsOnInit = true, forceReload = false, ...rest } = config || {};
  const configToUse: ReloadableModelProperties = { injectPropsOnInit, forceReload, ...rest };
  let innerComponent: ComponentType<P> = component;

  innerComponent = withEditorContext(withModel(withEditable(innerComponent, editConfig), configToUse));

  return innerComponent;
};

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
  editConfig?: EditConfig<P>,
  config?: ReloadableModelProperties,
) {
  const { injectPropsOnInit = false, ...rest } = config || {};
  const innerComponent = withMappable(component, editConfig, { injectPropsOnInit, ...rest });

  wrappedMapFct.call(ComponentMapping, resourceTypes, innerComponent);

  return innerComponent;
};

ComponentMapping.get = wrappedGetFct;

/**
 * @private
 */
type MapperFunction<P extends MappedComponentProperties> = (
  component: ComponentType<P>,
  editConfig?: EditConfig<P>,
) => ComponentType<P>;

const MapTo = <P extends MappedComponentProperties>(resourceTypes: string | string[]): MapperFunction<P> => {
  const mapper = (clazz: ComponentType<P>, config?: EditConfig<P>) => {
    // todo: pass 3rd argument: config
    return ComponentMapping.map(resourceTypes, clazz);
  };

  return mapper as MapperFunction<P>;
};

type MappingContextFunction<P extends MappedComponentProperties> = (props: P) => JSX.Element;

const ComponentMappingContext: React.Context<typeof ComponentMapping> = React.createContext(ComponentMapping);

function withComponentMappingContext<P extends MappedComponentProperties>(
  Component: React.ComponentType<P>,
): MappingContextFunction<P> {
  return function ComponentMappingContextComponent(props: P): JSX.Element {
    return (
      <ComponentMappingContext.Consumer>
        {(componentMapping: ComponentMapping) => <Component {...props} componentMapping={componentMapping} />}
      </ComponentMappingContext.Consumer>
    );
  };
}

export { ComponentMapping, MapTo, withMappable, ComponentMappingContext, withComponentMappingContext };

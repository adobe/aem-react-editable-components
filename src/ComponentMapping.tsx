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
import { ComponentMapping } from '@adobe/cq-spa-component-mapping';
import { EditConfig, withEditable } from './components/EditableComponent';
import { ReloadableModelProperties, withModel } from './components/ModelProvider';
import { withEditorContext } from './EditorContext';

/**
 * Wrapped function
 *
 * @type {function}
 * @private
 */
const wrappedMapFct = ComponentMapping.map;
const wrappedGetFct = ComponentMapping.get;

/**
 * Indicated whether force reload is turned on, forcing the model to be refetched on every MapTo instantiation.
 */
export interface ReloadForceAble {
    cqForceReload?: boolean;
}

/**
 * MappedComponentProperties
 * Properties given to every component runtime by the SPA editor.
 */
export interface MappedComponentProperties extends ReloadForceAble {
    isInEditor: boolean;
    cqPath: string;
}

/**
 * Map a React component with the given resource types.
 * If an {@link EditConfig} is provided the <i>clazz</i> is wrapped to provide edition capabilities on the AEM Page Editor
 *
 * @param {string[]} resourceTypes - list of resource types for which to use the given <i>clazz</i>
 * @param {React.Component} component - class to be instantiated for the given resource types
 * @param {EditConfig} [editConfig] - configuration object for enabling the edition capabilities
 * @param {{}} [config] - general configuration object
 * @param {boolean} [config.forceReload=undefined] - should the model cache be ignored when processing the component
 * @returns {React.Component} - the resulting decorated Class
 */
ComponentMapping.map =
    function map<P extends MappedComponentProperties>(resourceTypes: string | string[], component: any, editConfig?: EditConfig<P>, config?: ReloadableModelProperties) {
        const configToUse: ReloadableModelProperties = config ? config : { forceReload: false };
        let innerComponent: any = component;

        innerComponent = withEditorContext(withModel(withEditable(innerComponent, editConfig), configToUse));
        wrappedMapFct.call(ComponentMapping, resourceTypes, innerComponent);

        return innerComponent;
    };

ComponentMapping.get = wrappedGetFct;

type MapperFunction<P extends MappedComponentProperties> = (component: ComponentType<P>, editConfig?: EditConfig<P>) => void;

const MapTo = <P extends MappedComponentProperties>(resourceTypes: string | string[]): MapperFunction<P> => {
    return (clazz: ComponentType<P>, config?: EditConfig<P>) => {
        // @ts-ignore
        return ComponentMapping.map(resourceTypes, clazz, config);
    };
};

type MappingContextFunction<P extends MappedComponentProperties> = (props: P) => JSX.Element;


const ComponentMappingContext: React.Context<typeof ComponentMapping> = React.createContext(ComponentMapping);

function withComponentMappingContext<P extends MappedComponentProperties>(Component: React.ComponentType<P>): MappingContextFunction<P>{
    return function ComponentMappingContextComponent(props: P): JSX.Element {
        return (
            <ComponentMappingContext.Consumer>
                { (componentMapping: ComponentMapping) => <Component {...props} componentMapping={componentMapping} /> }
            </ComponentMappingContext.Consumer>
        );
    };
}

export { ComponentMapping, MapTo, ComponentMappingContext, withComponentMappingContext };

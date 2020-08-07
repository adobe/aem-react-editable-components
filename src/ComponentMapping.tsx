/*
 * ADOBE CONFIDENTIAL
 *
 * Copyright 2018 Adobe Systems Incorporated
 * All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Adobe Systems Incorporated and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Adobe Systems Incorporated and its
 * suppliers and may be covered by U.S. and Foreign Patents,
 * patents in process, and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe Systems Incorporated.
 */

import { ComponentMapping } from '@adobe/cq-spa-component-mapping';
import React from 'react';
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
    function map(resourceTypes: string[], component: any, editConfig?: EditConfig, config?: ReloadableModelProperties) {
        const configToUse: ReloadableModelProperties = config ? config : { forceReload: false };
        let innerComponent: any = component;

        innerComponent = withEditorContext(withModel(withEditable(innerComponent, editConfig), configToUse));
        wrappedMapFct.call(ComponentMapping, resourceTypes, innerComponent);

        return innerComponent;
    };

ComponentMapping.get = wrappedGetFct;

function MapTo<P extends MappedComponentProperties>(resourceTypes: string | string[]): any {
    return (clazz: React.ComponentType<any>) => {
        return ComponentMapping.map(resourceTypes, clazz);
    };
}

const ComponentMappingContext: React.Context<typeof ComponentMapping> = React.createContext(ComponentMapping);

function withComponentMappingContext(Component: React.ComponentType<any>): any {
    return function ComponentMappingContextComponent(props: any): any {
        return (
            <ComponentMappingContext.Consumer>
                { (componentMapping) => <Component {...props} componentMapping={componentMapping} /> }
            </ComponentMappingContext.Consumer>
        );
    };
}

export { ComponentMapping, MapTo, ComponentMappingContext, withComponentMappingContext };

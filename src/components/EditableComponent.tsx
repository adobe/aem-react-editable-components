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

import React, { Component, ComponentType } from 'react';
import isEqual from 'react-fast-compare';
import { MappedComponentProperties } from '../ComponentMapping';
import { Constants } from '../Constants';
import { ContainerState } from './Container';

/**
 * @protected props - Main properties related to the editing of the component.
 * @protected editProps - Edit properties related to the editing of the component.
 * @protected containerProps - Container properties related to the editing of the component.
 * @protected emptyPlaceholderProps - Properties related to the empty placeholder.
 */
export type EditableComponentRenderingProperties<P extends MappedComponentProperties> = {
    props: Readonly<EditableComponentModel<P>>;
    editProps: Readonly<{ [key: string]: string }>;
    containerProps: Readonly<{ [key: string]: string }>;
    emptyPlaceholderProps: Readonly<{ [key: string]: string }>;
}

/**
 * Configuration object of the withEditable function.
 *
 * @property emptyLabel - Label to be displayed on the overlay when the component is empty
 * @property isEmpty - Callback function to determine if the component is empty
 * @property resourceType - AEM ResourceType to be added as an attribute on the editable component dom
 * @property render - Allows custom editable component rendering.
 */
export interface EditConfig<P extends MappedComponentProperties> {
    emptyLabel?: string;
    isEmpty(props: P): boolean;
    resourceType?: string;
    /**
     * @param props - All the properties available for custom renderers.
     * @param wrappedComponent - The component to be rendered.
     * @param next - Call the next renderer in the chain in case a custom renderer decides to pass the turn.
     */
    render?: (props: Readonly<EditableComponentRenderingProperties<P>>, wrappedComponent: ComponentType<P>, next: () => JSX.Element) => JSX.Element;
}

export interface EditableComponentProperties<P extends MappedComponentProperties>{
    componentProperties: P;
    wrappedComponent: React.ComponentType<P>;
    editConfig: EditConfig<P>;
    containerProps?: { [key: string]: string };
}

type EditableComponentModel<P extends MappedComponentProperties> = EditableComponentProperties<P>;

/**
 * The EditableComponent provides components with editing capabilities.
 */
class EditableComponent<P extends MappedComponentProperties, S extends ContainerState> extends Component<EditableComponentModel<P>, S> {
    constructor(props: EditableComponentModel<P>) {
        super(props);
        this.state = this.propsToState(props);
    }

    public propsToState(props: EditableComponentModel<P>): any {
        // Keep private properties from being passed as state
        /* eslint-disable @typescript-eslint/no-unused-vars */
        const { wrappedComponent, containerProps, editConfig, ...state } = props;

        return state;
    }

    public componentDidUpdate(prevProps: EditableComponentModel<P>) {
        if (!isEqual(prevProps, this.props)) {
            this.setState(this.propsToState(this.props));
        }
    }

    /**
     * Properties related to the editing of the component.
     */
    get editProps(): { [key: string]: string } {
        const eProps: { [key: string]: string } = {};
        const componentProperties: P = this.props.componentProperties;

        if (!componentProperties.isInEditor) {
            return eProps;
        }

        eProps[Constants.DATA_PATH_ATTR] = componentProperties.cqPath;

        if (this.props.editConfig.resourceType) {
            eProps[Constants.DATA_CQ_RESOURCE_TYPE_ATTR] = this.props.editConfig.resourceType;
        }

        return eProps;
    }

    protected get emptyPlaceholderProps() {
        if (!this.useEmptyPlaceholder()) {
            return null;
        }

        return {
            'className': Constants._PLACEHOLDER_CLASS_NAMES,
            'data-emptytext': this.props.editConfig.emptyLabel
        };
    }

    /**
     * Should an empty placeholder be added.
     *
     * @return
     */
    public useEmptyPlaceholder() {
        return this.props.componentProperties.isInEditor
            && (typeof this.props.editConfig.isEmpty === 'function')
            && this.props.editConfig.isEmpty(this.props.componentProperties);
    }

    public render() {
        const WrappedComponent: React.ComponentType<any> = this.props.wrappedComponent;

        const defaultRender = () => (
            <div {...this.editProps} {...this.props.containerProps}>
                <WrappedComponent {...this.state} />
                <div {...this.emptyPlaceholderProps} />
            </div>
        );

        const { render } = this.props?.editConfig;

        if (render) {
            return render({
                // @ts-ignore
                props: this.state,
                // @ts-ignore
                editProps: this.editProps,
                // @ts-ignore
                containerProps: this.props.containerProps,
                // @ts-ignore
                emptyPlaceholderProps: this.emptyPlaceholderProps,
            }, this.props.wrappedComponent, defaultRender);
        }

        return defaultRender();
    }
}

/**
 * Returns a component wrapper that provides editing capabilities to the component.
 *
 * @param WrappedComponent
 * @param editConfig
 */
export function withEditable<P extends MappedComponentProperties>(WrappedComponent: ComponentType<P>, editConfig?: EditConfig<P>) {

    const defaultEditConfig: EditConfig<P> = editConfig ? editConfig : { isEmpty: (props: P) => false };

    return class CompositeEditableComponent extends Component<P> {
        public render(): JSX.Element {
            type TypeToUse = EditableComponentProperties<P> & P;

            const computedProps: TypeToUse = {
                ...this.props,
                componentProperties: this.props,
                editConfig: defaultEditConfig,
                wrappedComponent: WrappedComponent
            };

            return <EditableComponent {...computedProps} />;
        }
    };
}

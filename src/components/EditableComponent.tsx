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
import Constants from '../Constants';
import { ContainerState } from './Container';

/**
 * Class name used to identify the placeholder used to represent an empty component.
 *
 * @private
 */
const PLACEHOLDER_CLASS_NAME = 'cq-placeholder';

/**
 * Configuration object of the withEditable function.
 *
 * @typedef {Object} EditConfig
 * @property {boolean} [emptyLabel] - Label to be displayed on the overlay when the component is empty
 * @property {function} [isEmpty] - Callback function to determine if the component is empty
 */
export interface EditConfig<P extends MappedComponentProperties> {
    emptyLabel?: string;
    isEmpty(props: P): boolean;
}

export interface EditableComponentProperties<P extends MappedComponentProperties>{
    componentProperties: P
    wrappedComponent: React.ComponentType<P>;
    editConfig: EditConfig<P>;
    containerProps?: { [key: string]: string };
}

type EditableComponentModel<P extends MappedComponentProperties> = EditableComponentProperties<P>;

/**
 * The EditableComponent extends components with editing capabilities.
 */
class EditableComponent<P extends MappedComponentProperties, S extends ContainerState> extends Component<EditableComponentModel<P>, S> {
    constructor(props: EditableComponentModel<P>) {
        super(props);
        this.state = this.propsToState(props);
    }

    public propsToState(props: EditableComponentModel<P>): any {
        // Keep private properties from being passed as state
        const { wrappedComponent, containerProps, editConfig, ...state } = props;

        return state;
    }

    public componentDidUpdate(prevProps: EditableComponentModel<P>) {
        if (!isEqual(prevProps, this.props)) {
            this.setState(this.propsToState(this.props));
        }
    }

    /**
     * Properties related to the edition of the component.
     */
    get editProps(): { [key: string]: string } {
        const eProps: { [key: string]: string } = {};

        if (!this.props.componentProperties.isInEditor) {
            return eProps;
        }

        eProps[Constants.DATA_PATH_ATTR] = this.props.componentProperties.cqPath;

        return eProps;
    }

    /**
     * HTMLElement representing the empty placeholder.
     *
     * @return {object}
     */
    get emptyPlaceholderProps() {
        if (!this.useEmptyPlaceholder()) {
            return null;
        }

        return {
            'className': PLACEHOLDER_CLASS_NAME,
            'data-emptytext': this.props.editConfig.emptyLabel
        };
    }

    /**
     * Should an empty placeholder be added.
     *
     * @return {boolean}
     */
    public useEmptyPlaceholder() {
        return this.props.componentProperties.isInEditor
            && (typeof this.props.editConfig.isEmpty === 'function')
            && this.props.editConfig.isEmpty(this.props.componentProperties);
    }

    public render() {
        const WrappedComponent: React.ComponentType<any> = this.props.wrappedComponent;

        return (
            <div {...this.editProps} {...this.props.containerProps}>
                <WrappedComponent {...this.state}/>
                <div {...this.emptyPlaceholderProps}/>
            </div>
        );
    }
}

/**
 * Returns a composition that provides edition capabilities to the component.
 *
 * @param {React.Component} WrappedComponent
 * @param {EditConfig} [editConfig]
 */
export  function  withEditable<P extends MappedComponentProperties>(WrappedComponent: ComponentType<P>, editConfig?: EditConfig<P>) {



    /**
     * If not edit configuration is specified, provide a dummy that always returns false on isEmpty.
     */
    const editConfigToUse: EditConfig<P> = editConfig ? editConfig : {
        isEmpty(props: P): boolean {
            return false;
        }
    };

    /**
     * Wrapping Editable Component
     */
    return class CompositeEditableComponent extends Component<P> {
        public render(): JSX.Element {

            type TypeToUse = EditableComponentProperties<P> & P;

            const computedProps: TypeToUse = {
                ...this.props,
                componentProperties: this.props,
                editConfig: editConfigToUse,
                wrappedComponent: WrappedComponent
            };

            return <EditableComponent {...computedProps} />;
        }
    };
}

export { PLACEHOLDER_CLASS_NAME };

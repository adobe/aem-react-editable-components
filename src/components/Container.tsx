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

import { Model } from '@adobe/aem-spa-page-model-manager';
import React, { Component } from 'react';
import { ComponentMapping, MappedComponentProperties } from '../ComponentMapping';
import { Constants } from '../Constants';
import Utils from '../Utils';
import { ContainerPlaceholder, PlaceHolderModel } from './ContainerPlaceholder';

const CONTAINER_CLASS_NAMES = 'aem-container';
const PLACEHOLDER_CLASS_NAMES = Constants.NEW_SECTION_CLASS_NAMES;

export interface ContainerProperties extends MappedComponentProperties {
    componentMapping?: typeof ComponentMapping;
    cqItems: { [key: string]: Model };
    cqItemsOrder: string[];
}

export interface ContainerState {
    componentMapping: typeof ComponentMapping;
}

/**
 * Container component. Provides access to items.
 */
export class Container<P extends ContainerProperties, S extends ContainerState> extends Component<P, S> {
    public static defaultProps = {
        cqItems: {},
        cqItemsOrder: [],
        cqPath: ''
    };

    constructor(props: P) {
        super(props);

        // @ts-ignore
        this.state = {
            componentMapping: this.props.componentMapping || ComponentMapping
        };
    }

    /**
     * Returns the child components of this Container.
     * It will iterate over all the items and instantiate the child components if a Mapping is found.
     * Instantiation is done my connecting the Component with the data of that item.
     *
     * @returns {Object[]} An array with the components instantiated to JSX
     */
    get childComponents(): JSX.Element[] {
        const childComponents: JSX.Element[] = [];

        if (!this.props.cqItems || !this.props.cqItemsOrder) {
            return childComponents;
        }

        this.props.cqItemsOrder.map((itemKey) => {
            const itemProps = Utils.modelToProps(this.props.cqItems[itemKey]);

            if (itemProps) {
                // @ts-ignore
                const ItemComponent: React.ComponentType<MappedComponentProperties> = this.state.componentMapping.get(itemProps.cqType);

                if (ItemComponent) {
                    childComponents.push(this.connectComponentWithItem(ItemComponent, itemProps, itemKey));
                }
            }
        });

        return childComponents;
    }

    /**
     * Connects a child component with the item data.
     *
     * @param {Component} ChildComponent - the child component
     * @param {Object} itemProps - the item data
     * @param {String} itemKey - the name of the item in map
     * @returns {Object} - the React element constructed by connecting the values of the input with the Component
     */
    public connectComponentWithItem(ChildComponent: React.ComponentType<MappedComponentProperties>, itemProps: any, itemKey: string) {
        const itemPath = this.getItemPath(itemKey);

        return <ChildComponent {...itemProps} key={itemPath} cqPath={itemPath} isInEditor={this.props.isInEditor} containerProps={this.getItemComponentProps(itemProps, itemKey, itemPath)}/>;
    }

    /**
     * Returns the properties to add on a specific child component.
     *
     * @param {Object} item - The item data
     * @param {String} itemKey - The key of the item
     * @param {String} itemPath - The path of the item
     * @returns {Object} - The map of properties to be added
     */
    getItemComponentProps(itemProps?: any, itemKey?: string, itemPath?: string): { [key: string]: string } {
        return {};
    }

    /**
     * Computes the path of the current item.
     *
     * @param {String} itemKey - the key of the item
     * @returns {String} - the computed path
     */
    public getItemPath(itemKey: string) {
        return (this.props && this.props.cqPath) ? (this.props.cqPath + '/' + itemKey) : itemKey;
    }

    /**
     * The properties that will be injected in the root element of the container.
     *
     * @returns {Object} - The map of properties to be added
     */
    get containerProps(): {[key: string]: string} {
        const attrs: { [key: string]: string } = {
            className: CONTAINER_CLASS_NAMES,
        };

        if (this.props.isInEditor) {
            attrs[Constants.DATA_PATH_ATTR] = this.props.cqPath;
        }

        return attrs;
    }

    /**
     * The properties that will go on the placeholder component root element.
     *
     * @returns {Object} - The map of properties to be added
     */
    get placeholderProps(): PlaceHolderModel {
        return {
            cqPath: this.props.cqPath,
            placeholderClassNames: PLACEHOLDER_CLASS_NAMES,
        };
    }

    /**
     * The placeholder component that will be added in editing
     *
     * @returns {Object} React element to be instantiated as a placeholder
     */
    get placeholderComponent() {
        if (!this.props.isInEditor) {
            return null;
        }

        return <ContainerPlaceholder { ...this.placeholderProps }/>;
    }

    public render() {
        return (
            <div {...this.containerProps}>
                { this.childComponents }
                { this.placeholderComponent }
            </div>
        );
    }
}

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

import { Model } from '@adobe/cq-spa-page-model-manager';
import React, { Component } from 'react';
import { ComponentMapping, MappedComponentProperties } from '../ComponentMapping';
import Constants from '../Constants';
import Utils, { NotImplementedError } from '../Utils';
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

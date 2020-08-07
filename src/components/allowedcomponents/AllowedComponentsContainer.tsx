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

import React from 'react';
import { Container, ContainerProperties, ContainerState } from '../Container';
import { AllowedComponentPlaceholderList } from './AllowedComponentsPlaceholderList';

/**
 * Component that is allowed to be used on the page by the editor
 */
export interface AllowedComponent {
    /**
     * Path to the component under apps
     */
    path: string;

    /**
     * Title of the component
     */
    title: string;
}

/**
 * AllowedComponents collection
 */
export interface AllowedComponents {
    applicable: boolean;

    /**
     * List of allowed components
     */
    components: AllowedComponent[];
}

/**
 * Properties for the allowed components container
 */
export interface AllowedComponentsProperties extends ContainerProperties {
    /**
     * List of allowed components for the container
     */
    allowedComponents: AllowedComponents;

    /**
     *  Label to display when there are no allowed components
     */
    _allowedComponentPlaceholderListEmptyLabel?: string;

    /**
     * Title of the placeholder list
     */
    title: string;
}

/**
 *  When applicable, the component exposes a list of allowed components
 *  This is used by the template editor
 */
export class AllowedComponentsContainer<M extends AllowedComponentsProperties, S extends ContainerState> extends Container<M, S> {
    public static defaultProps = {
        // Temporary property until CQ-4265892 is addressed, beware not rely it
        _allowedComponentPlaceholderListEmptyLabel: 'No allowed components',
        cqItems: {},
        cqItemsOrder: [],
        cqPath: ''
    };

    public render() {
        const { allowedComponents, _allowedComponentPlaceholderListEmptyLabel, title, isInEditor } = this.props;

        if (isInEditor && allowedComponents && allowedComponents.applicable) {
            // @ts-ignore
            const emptyLabel: string = _allowedComponentPlaceholderListEmptyLabel ? _allowedComponentPlaceholderListEmptyLabel : AllowedComponentsContainer.defaultProps._allowedComponentPlaceholderListEmptyLabel;

            if (_allowedComponentPlaceholderListEmptyLabel) {
                // @ts-ignore
                return <AllowedComponentPlaceholderList title={title} emptyLabel={emptyLabel} components={allowedComponents.components} placeholderProps={this.placeholderProps} cqPath={this.props.cqPath}/>;
            }
        }

        return super.render();
    }
}

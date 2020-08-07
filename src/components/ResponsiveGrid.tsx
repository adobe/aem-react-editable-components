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

import { MapTo, withComponentMappingContext } from '../ComponentMapping';
import { AllowedComponentsContainer, AllowedComponentsProperties } from './allowedcomponents/AllowedComponentsContainer';
import { ContainerState } from './Container';
import { PlaceHolderModel } from './ContainerPlaceholder';

const PLACEHOLDER_CLASS_NAMES = 'aem-Grid-newComponent';

export interface ResponsiveGridProperties extends AllowedComponentsProperties {
    gridClassNames: string;
    columnClassNames: { [key: string]: string };
}

export class ResponsiveGrid<P extends ResponsiveGridProperties, S extends ContainerState> extends AllowedComponentsContainer<P, S> {
    public static defaultProps = {
        // Temporary property until CQ-4265892 is addressed, beware not rely it
        _allowedComponentPlaceholderListEmptyLabel: 'No allowed components for Layout Container',
        cqItems: {},
        cqItemsOrder: [],
        cqPath: '',
        title: 'Layout Container'
    };

    /**
     * The attributes that will be injected in the root element of the container.
     *
     * @returns {Object} - the attributes of the container
     */
    get containerProps(): { [key: string]: string } {
        const containerProps = super.containerProps;

        containerProps.className = (containerProps.className || '') + ' ' +  this.props.gridClassNames;

        return containerProps;
    }

    /**
     * The properties that will go on the placeholder component root element
     *
     * @returns {Object} - the properties as a map
     */
    get placeholderProps(): PlaceHolderModel  {
        const props = super.placeholderProps;

        props.placeholderClassNames = (props.placeholderClassNames || '') + ' ' +  PLACEHOLDER_CLASS_NAMES;

        return props;
    }

    /**
     * Returns the properties to add on a specific child component
     *
     * @param   {Object} item     The item data
     * @param   {String} itemKey  The key of the item
     * @param   {String} itemPath The path of the item
     * @returns {Object} The map of properties to be added
     */
    getItemComponentProps(item: any, itemKey: string, itemPath: string) {
        const attrs = super.getItemComponentProps(item, itemKey, itemPath);

        attrs.className = attrs.className || '';
        attrs.className += this.props.columnClassNames && this.props.columnClassNames[itemKey] ?  ' ' + this.props.columnClassNames[itemKey] : '';

        return attrs;
    }
}

MapTo('wcm/foundation/components/responsivegrid')(withComponentMappingContext(ResponsiveGrid));

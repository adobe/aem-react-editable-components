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

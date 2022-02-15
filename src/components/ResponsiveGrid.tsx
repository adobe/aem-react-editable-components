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
import { MapTo, withComponentMappingContext } from '../core/ComponentMapping';
import {
  AllowedComponentsContainer,
  AllowedComponentsProperties,
} from './allowedcomponents/AllowedComponentsContainer';
import { ContainerState } from './Container';
import { PlaceHolderModel } from './ContainerPlaceholder';
import { EditConfig } from '../core/EditableComponent';
import { Constants } from '../Constants';

export interface ResponsiveGridProperties extends AllowedComponentsProperties {
  gridClassNames: string;
  columnClassNames: { [key: string]: string };
}

export class ResponsiveGrid<
  P extends ResponsiveGridProperties,
  S extends ContainerState,
> extends AllowedComponentsContainer<P, S> {
  public static defaultProps = {
    _allowedComponentPlaceholderListEmptyLabel: 'No allowed components',
    cqItems: {},
    cqItemsOrder: [],
    cqPath: '',
    title: 'Layout Container',
  };

  get containerProps(): { [key: string]: string } {
    const containerProps = super.containerProps;

    containerProps.className = (containerProps.className || '') + ' ' + this.props.gridClassNames;

    return containerProps;
  }

  get placeholderProps(): PlaceHolderModel {
    const props = super.placeholderProps;

    props.placeholderClassNames =
      (props.placeholderClassNames || '') + ' ' + Constants._RESPONSIVE_GRID_PLACEHOLDER_CLASS_NAMES;

    return props;
  }

  getItemComponentProps(item: any, itemKey: string, itemPath: string): { [key: string]: string } {
    const attrs = super.getItemComponentProps(item, itemKey, itemPath);

    attrs.className = attrs.className || '';
    attrs.className +=
      this.props.columnClassNames && this.props.columnClassNames[itemKey]
        ? ' ' + this.props.columnClassNames[itemKey]
        : '';

    return attrs;
  }
}

/**
 * @private
 */
const config: EditConfig<ResponsiveGridProperties> = {
  isEmpty(props: ResponsiveGridProperties): boolean {
    return props.cqItemsOrder && props.cqItemsOrder.length > 0;
  },
};

MapTo<ResponsiveGridProperties>('wcm/foundation/components/responsivegrid')(
  withComponentMappingContext(ResponsiveGrid),
  config,
);

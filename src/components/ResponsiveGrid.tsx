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
import { AllowedComponentsContainer } from './AllowedComponentsContainer';
import { EditConfig } from '../core/EditableComponent';
import {ModelProps, ResponsiveGridProps} from "../types/AEMModel";
import React from 'react';
import {ClassNames} from "../constants/classnames.constants";

type Props = {
  title?: string;
} & ResponsiveGridProps;

export const ResponsiveGrid = ({
  title = 'Layout Container',
  ...props
}: Props) => {
  const getItemCustomProps = function (itemKey: string, itemProps: ModelProps) {
    const itemCustomProps = {className: ''};
    itemCustomProps.className = props.columnClassNames && props.columnClassNames[itemKey] ? props.columnClassNames[itemKey] : '';
    return itemCustomProps;
  };
  props.getItemCustomProps = getItemCustomProps;
  return (
    <AllowedComponentsContainer
      className={props.gridClassNames + " " + ClassNames.CONTAINER}
      getItemCustomProps={getItemCustomProps}
      placeholderClassNames={ClassNames.RESPONSIVE_GRID_PLACEHOLDER_CLASS_NAMES}
      title={title}
      {...props}
    />
  );
};

/**
 * @private
 */
const config: EditConfig<ResponsiveGridProps> = {
  isEmpty(props: ResponsiveGridProps): boolean {
    return props.cqItemsOrder && props.cqItemsOrder.length > 0;
  },
};

MapTo<ResponsiveGridProps>('wcm/foundation/components/responsivegrid')(
  withComponentMappingContext(ResponsiveGrid),
  config,
);

/*
 * Copyright 2022 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
import React from 'react';
import { AuthoringUtils } from '@adobe/aem-spa-page-model-manager';
import { ComponentMapping } from '@adobe/aem-spa-component-mapping';
import { MapTo } from '../core/ComponentMapping';
import { EditableComponent } from '../core/EditableComponent';
import { Container } from './Container';
import AllowedComponentsContainer from './AllowedComponentsContainer';
import { ResponsiveGridProps } from '../types/AEMModel';
import { Config, MappedComponentProperties } from '../types/EditConfig';
import { ClassNames } from '../constants';

export type ResponsiveGridComponentProps = {
  title?: string;
  isInEditor: boolean;
  componentMapping?: typeof ComponentMapping;
  config?: Config<MappedComponentProperties>;
  customClassName?: string;
  removeDefaultStyles?: boolean;
} & ResponsiveGridProps;

const RESOURCE_TYPE = 'wcm/foundation/components/responsivegrid';

const LayoutContainer = ({
  title = 'Layout Container',
  columnClassNames,
  isInEditor,
  ...props
}: ResponsiveGridComponentProps): JSX.Element => {
  const getItemClassNames = (itemKey: string) => {
    return columnClassNames && columnClassNames[itemKey] ? columnClassNames[itemKey] : '';
  };

  let className = props.customClassName || '';
  if (isInEditor || !props.removeDefaultStyles) {
    className = `${className} ${props.gridClassNames || ''} ${ClassNames.CONTAINER}`;
  }

  const gridProps = {
    ...props,
    className,
    getItemClassNames,
    placeholderClassNames: ClassNames.RESPONSIVE_GRID_PLACEHOLDER_CLASS_NAMES,
    isInEditor,
  };

  return props.allowedComponents?.applicable && isInEditor ? (
    <AllowedComponentsContainer {...gridProps} title={title} />
  ) : (
    <Container {...gridProps} />
  );
};

export const ResponsiveGrid = ({
  isInEditor = AuthoringUtils.isInEditor(),
  ...props
}: ResponsiveGridComponentProps): JSX.Element => {
  const config = {
    isEmpty: (gridProps: ResponsiveGridProps): boolean => {
      return (gridProps.cqItemsOrder && gridProps.cqItemsOrder.length > 0) || false;
    },
    resourceType: RESOURCE_TYPE,
  };

  return (
    <EditableComponent config={config} {...props}>
      <LayoutContainer {...props} isInEditor={isInEditor} />
    </EditableComponent>
  );
};

MapTo<ResponsiveGridComponentProps>(RESOURCE_TYPE)(ResponsiveGrid);

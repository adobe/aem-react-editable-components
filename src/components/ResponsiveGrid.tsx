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
import React from 'react';
import { ComponentMapping } from '@adobe/aem-spa-component-mapping';
import { MapTo, withComponentMappingContext } from '../core/ComponentMapping';
import { AllowedComponentsContainer } from './AllowedComponentsContainer';
import { EditConfig } from '../core/EditableComponent';
import { ResponsiveGridProps } from '../types/AEMModel';
import { ClassNames } from '../constants/classnames.constants';
import { Container } from './Container';

type Props = {
  title?: string;
  isInEditor: boolean;
  componentMapping: typeof ComponentMapping;
} & ResponsiveGridProps;

export const ResponsiveGrid = ({ title = 'Layout Container', columnClassNames, ...props }: Props): JSX.Element => {
  const getItemClassNames = (itemKey: string) => {
    return columnClassNames && columnClassNames[itemKey] ? columnClassNames[itemKey] : '';
  };

  return props.allowedComponents?.applicable && props.isInEditor ? (
    <AllowedComponentsContainer
      className={`${props.gridClassNames} ${ClassNames.CONTAINER}`}
      getItemClassNames={getItemClassNames}
      placeholderClassNames={ClassNames.RESPONSIVE_GRID_PLACEHOLDER_CLASS_NAMES}
      title={title}
      {...props}
    />
  ) : (
    <Container {...props} />
  );
};

const config: EditConfig<Props> = {
  isEmpty(props: ResponsiveGridProps): boolean {
    return (props.cqItemsOrder && props.cqItemsOrder.length > 0) || false;
  },
};

MapTo<Props>('wcm/foundation/components/responsivegrid')(withComponentMappingContext(ResponsiveGrid), config);

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
import React, { ComponentType, ReactElement } from 'react';
import { Utils } from '../utils/Utils';
import { Properties, ClassNames } from '../constants';
import { ModelProps, PageModel } from '../types/AEMModel';
import { ComponentMapping, MapTo } from '../core/ComponentMapping';
import { Config, MappedComponentProperties } from '../types/EditConfig';

export type ContainerProps = {
  className?: string;
  itemPath?: string;
  isPage?: boolean;
  childPages?: JSX.Element;
  getItemClassNames?: (_key: string) => string;
  placeholderClassNames?: string;
  isInEditor: boolean;
  componentMapping?: typeof ComponentMapping;
  removeDefaultStyles?: boolean;
  config?: Config<MappedComponentProperties>;
  components?: { [key: string]: ComponentType<MappedComponentProperties> };
  model?: PageModel;
} & ModelProps;

const getItemPath = (cqPath: string, itemKey: string, isPage = false): string => {
  let itemPath = itemKey;
  if (cqPath) {
    if (isPage) {
      itemPath = `${cqPath}/${Properties.JCR_CONTENT}/${itemKey}`;
    } else {
      itemPath = `${cqPath}/${itemKey}`;
    }
  }
  return itemPath;
};

const ComponentList = ({ cqItemsOrder, cqItems, cqPath = '', getItemClassNames, isPage, ...props }: ContainerProps) => {
  const componentMapping = props.componentMapping || ComponentMapping;
  if (!cqItemsOrder || !cqItems || !cqItemsOrder.length) {
    return <></>;
  }
  const components: Array<ReactElement> = [];
  cqItemsOrder.forEach((itemKey: string) => {
    const itemProps = Utils.modelToProps(cqItems[itemKey]);
    const itemClassNames = (getItemClassNames && getItemClassNames(itemKey)) || '';
    if (itemProps && itemProps.cqType) {
      const ItemComponent: React.ElementType = componentMapping.get(itemProps.cqType);
      const itemPath = getItemPath(cqPath, itemKey, isPage);
      if (ItemComponent) {
        components.push(
          <ItemComponent
            key={itemPath}
            model={itemProps}
            cqPath={itemPath}
            className={itemClassNames}
            removeDefaultStyles={props.removeDefaultStyles}
          />,
        );
      } else {
        console.error('Component not mapped for resourcetype:', itemProps.cqType);
      }
    }
  });
  return <>{components}</>;
};

export const Container = (props: ContainerProps): JSX.Element => {
  const {
    cqPath = '',
    className = '',
    isPage = false,
    isInEditor,
    childPages,
    placeholderClassNames = '',
    components,
    model = {},
  } = props;

  if (components && Object.keys(components).length) {
    for (const resourceType in components) {
      MapTo(resourceType)(components[resourceType]);
    }
  }

  const containerProps =
    (isInEditor && {
      [Properties.DATA_PATH_ATTR]: cqPath,
    }) ||
    {};

  const childComponents = <ComponentList {...model} {...props} />;

  return isInEditor ? (
    <div className={className || ClassNames.CONTAINER} {...containerProps}>
      {childComponents}
      {childPages}
      {!isPage && isInEditor && (
        <div data-cq-data-path={`${cqPath}/*`} className={`${ClassNames.NEW_SECTION} ${placeholderClassNames}`} />
      )}
    </div>
  ) : (
    <div className={className}>
      {childComponents}
      {childPages}
    </div>
  );
};

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
import React, { useState } from 'react';
import { Utils } from '../utils/Utils';
import { Properties, ClassNames } from '../constants';
import { ModelProps } from '../types/AEMModel';
import { ComponentMapping } from '../core/ComponentMapping';

type Props = {
  className?: string;
  itemPath?: string;
  isPage?: boolean;
  childPages?: JSX.Element;
  getItemClassNames?: (_key: string) => string;
  isInEditor: boolean;
  componentMapping: typeof ComponentMapping;
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

const ComponentList = ({ cqItemsOrder, cqItems, cqPath = '', getItemClassNames, isPage, ...props }: Props) => {
  const [componentMapping, setComponentMapping] = useState(() => props.componentMapping || ComponentMapping);
  if (!cqItemsOrder || !cqItems || !cqItemsOrder.length) {
    return <></>;
  }
  const components = cqItemsOrder.map((itemKey: string) => {
    const itemProps = Utils.modelToProps(cqItems[itemKey]);
    const itemClassNames = (getItemClassNames && getItemClassNames(itemKey)) || '';
    if (itemProps && itemProps.cqType) {
      const ItemComponent: React.ElementType = componentMapping.get(itemProps.cqType);
      const itemPath = getItemPath(cqPath, itemKey, isPage);
      return (
        <ItemComponent
          {...itemProps}
          key={itemPath}
          cqPath={itemPath}
          className={`${itemClassNames} ${ClassNames.CONTAINER_CHILD}`}
        />
      );
    }
  });
  return <>{components}</>;
};

// to do: clarify usage of component mapping and define type
export const Container = (props: Props): JSX.Element => {
  const { cqPath = '', className, isPage = false, isInEditor, childPages } = props;

  const containerProps = {
    [Properties.DATA_PATH_ATTR]: cqPath,
  };
  const childComponents = <ComponentList {...props} />;

  // clarify why aemnodecoration is needed when not in editor in the first place
  // shouldnt all aem specific things be removed anyway?
  return isInEditor ? (
    <div className={className || ClassNames.CONTAINER} {...containerProps}>
      {childComponents}
      {childPages}
      {!isPage && <div data-cq-data-path={`${cqPath}/*`} className={ClassNames.NEW_SECTION} />}
    </div>
  ) : (
    <>
      {childComponents}
      {childPages}
    </>
  );
};

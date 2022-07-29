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

import React, { ReactElement } from 'react';
import { Container } from './Container';
import { ClassNames } from '../constants';
import { ModelProps } from '../types/AEMModel';
import { Utils } from '../utils/Utils';
import { ComponentMapping } from '../core/ComponentMapping';
import { EditableComponent } from '../core/EditableComponent';

export type PageProps = {
  isInEditor: boolean;
  componentMapping: typeof ComponentMapping;
  className?: string;
} & ModelProps;

const PageList = ({ cqChildren, ...props }: PageProps): JSX.Element => {
  const componentMapping = props.componentMapping || ComponentMapping;

  if (!cqChildren) {
    return <></>;
  }
  const pages: Array<ReactElement> = [];
  Object.keys(cqChildren).forEach((itemKey) => {
    const itemProps = Utils.modelToProps(cqChildren[itemKey]);
    const { cqPath, cqType } = itemProps;
    if (cqType) {
      const ItemComponent: React.ElementType = componentMapping.get(cqType);
      if (ItemComponent) {
        pages.push(<ItemComponent model={itemProps} key={cqPath} cqPath={cqPath} isInEditor={props.isInEditor} />);
      } else {
        console.error('Component not mapped for resourcetype:', cqType);
      }
    }
  });

  return <>{pages}</>;
};

export const Page = ({ className, ...props }: PageProps): JSX.Element => (
  <EditableComponent {...props}>
    <Container
      className={`${ClassNames.PAGE} ${className || ''}`}
      isPage={true}
      childPages={<PageList {...props} />}
      {...props}
    />
  </EditableComponent>
);

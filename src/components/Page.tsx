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

import React, { useState } from 'react';
import { Container } from './Container';
import { ClassNames } from '../constants';
import { ModelProps } from '../types/AEMModel';
import { Utils } from '../utils/Utils';
import { ComponentMapping } from '../core/ComponentMapping';

type Props = {
  isInEditor: boolean;
  componentMapping: typeof ComponentMapping;
} & ModelProps;

const PageList = ({ cqChildren, ...props }: Props): JSX.Element => {
  const [componentMapping, setComponentMapping] = useState(() => props.componentMapping || ComponentMapping);

  if (!cqChildren) {
    return <></>;
  }

  const pages = Object.keys(cqChildren).map((itemKey) => {
    const itemProps = Utils.modelToProps(cqChildren[itemKey]);
    const { cqPath, cqType } = itemProps;
    if (cqType) {
      const ItemComponent: React.ElementType = componentMapping.get(cqType);
      return <ItemComponent {...itemProps} key={cqPath} cqPath={cqPath} />;
    }
  });

  return <>{pages}</>;
};

export const Page = (props: Props): JSX.Element => (
  <Container className={ClassNames.PAGE} isPage={true} childPages={<PageList {...props} />} {...props} />
);

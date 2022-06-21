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
import { AllowedComponentList, ModelProps } from '../types/AEMModel';
import { ClassNames, Texts } from '../constants';

type Props = {
  allowedComponents: AllowedComponentList;
  className: string;
  placeholderClassNames?: string;
  title: string;
  getItemClassNames?: (_key: string) => string;
} & ModelProps;

/**
 * Represents allowed components container in AEM.
 */
const AllowedComponentsContainer = (props: Props): JSX.Element => {
  const { placeholderClassNames = '', allowedComponents, title } = props;
  const { components } = allowedComponents;
  const emptyLabel = Texts.EMPTY_LABEL;
  const listLabel = components && components.length > 0 ? title : emptyLabel;

  return (
    <div className={`${ClassNames.ALLOWED_LIST_PLACEHOLDER} ${ClassNames.NEW_SECTION} ${placeholderClassNames}`}>
      <div data-text={listLabel} className={ClassNames.ALLOWED_COMPONENT_TITLE} />
      {components.map((component) => (
        <div
          data-cq-data-path={component.path}
          key={component.path}
          data-emptytext={emptyLabel}
          className={ClassNames.ALLOWED_COMPONENT_PLACEHOLDER}
        />
      ))}
    </div>
  );
};

export default AllowedComponentsContainer;

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
import { AllowedComponent } from '../../api/AEMModel';
import { AllowedComponentPlaceholder } from './AllowedComponentsPlaceholder';
import { ClassNames } from '../../constants/classnames.constants';

type Props = {
  title: string;
  emptyLabel: string;
  components: AllowedComponent[];
};

/**
 * List of placeholders of the Allowed Component Container.
 */
export const AllowedComponentPlaceholderList = (props: Props) => {
  const { components, title, emptyLabel } = props;
  const listLabel = components && components.length > 0 ? title : emptyLabel;

  return (
    <div className={ClassNames.ALLOWED_LIST_PLACEHOLDER + ' ' + ClassNames.NEW_SECTION}>
      <div data-text={listLabel} className={ClassNames.ALLOWED_COMPONENT_TITLE} />
      {
        components.map((component) => {
          const { path, title } = component;
          return <AllowedComponentPlaceholder key={path} path={path} emptyLabel={title} />
        })
      }
    </div>
  );
};

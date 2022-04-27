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
import { render, screen } from '@testing-library/react';
import AllowedComponentsContainer from '../../src/components/AllowedComponentsContainer';
import { AllowedComponentList } from '../../src/types/AEMModel';

describe('AllowedComponentsContainer ->', () => {
  const DEFAULT_TITLE = 'Layout Container';
  const ALLOWED_PLACEHOLDER_SELECTOR = '.aem-AllowedComponent--list';
  const ALLOWED_COMPONENT_TITLE_SELECTOR = '.aem-AllowedComponent--title';
  const ALLOWED_COMPONENT_PLACEHOLDER_SELECTOR = '.aem-AllowedComponent--component.cq-placeholder.placeholder';
  const COMPONENT_TEXT_PATH = '/content/page/jcr:content/root/text';
  const COMPONENT_TEXT_TITLE = 'Text';
  const COMPONENT_IMAGE_PATH = '/content/page/jcr:content/root/image';
  const COMPONENT_IMAGE_TITLE = 'Image';

  const ALLOWED_COMPONENTS_EMPTY_DATA: AllowedComponentList = {
    applicable: true,
    components: [],
  };

  const ALLOWED_COMPONENTS_DATA: AllowedComponentList = {
    applicable: true,
    components: [
      {
        path: COMPONENT_TEXT_PATH,
        title: COMPONENT_TEXT_TITLE,
      },
      {
        path: COMPONENT_IMAGE_PATH,
        title: COMPONENT_IMAGE_TITLE,
      },
    ],
  };

  function generateAllowedComponentsContainer(allowedComponents: AllowedComponentList, title?: string): JSX.Element {
    const props = {
      title: title || '',
      allowedComponents: allowedComponents,
      cqPath: '',
    };
    return (
      <div data-testid="testcontainer">
        <AllowedComponentsContainer className="" {...props} />
      </div>
    );
  }

  describe('applicable ->', () => {
    it('should be applicable with an empty list of allowed components', () => {
      render(generateAllowedComponentsContainer(ALLOWED_COMPONENTS_EMPTY_DATA));
      const node = screen.getByTestId('testcontainer');
      const allowedComponentsContainer = node.querySelector(ALLOWED_PLACEHOLDER_SELECTOR);
      expect(allowedComponentsContainer).toBeDefined();
      const allowedComponentsTitle = allowedComponentsContainer.querySelector(
        ALLOWED_COMPONENT_TITLE_SELECTOR,
      ) as HTMLElement;
      expect(allowedComponentsTitle).toBeDefined();
      expect(allowedComponentsTitle.dataset.text).toEqual('No allowed components');
      expect(allowedComponentsContainer.querySelector(ALLOWED_COMPONENT_PLACEHOLDER_SELECTOR)).toBeFalsy();
    });

    it('should be applicable with a list of allowed components', () => {
      render(generateAllowedComponentsContainer(ALLOWED_COMPONENTS_DATA, DEFAULT_TITLE));
      const node = screen.getByTestId('testcontainer');
      const allowedComponentsContainer = node.querySelector(ALLOWED_PLACEHOLDER_SELECTOR);
      expect(allowedComponentsContainer).toBeDefined();
      const allowedComponentsTitle = allowedComponentsContainer.querySelector(
        ALLOWED_COMPONENT_TITLE_SELECTOR,
      ) as HTMLElement;
      expect(allowedComponentsTitle).toBeDefined();
      expect(allowedComponentsTitle.dataset.text).toEqual(DEFAULT_TITLE);
      expect(allowedComponentsContainer.querySelectorAll(ALLOWED_COMPONENT_PLACEHOLDER_SELECTOR).length).toEqual(2);
    });
  });
});

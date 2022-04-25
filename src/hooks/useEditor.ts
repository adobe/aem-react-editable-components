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
import { Dispatch, useCallback } from 'react';
import { PathUtils } from '@adobe/aem-spa-page-model-manager';
import { ModelProps } from '../types/AEMModel';
import { useModel } from './useModel';
import { Events } from '../constants';

type Props = {
  path?: string;
  forceReload?: boolean;
  isInEditor?: boolean;
  pagePath?: string;
  setModel: Dispatch<ModelProps>;
};

// Editor specific logic could be placed here
export const useEditor = () => {
  const { fetchModel } = useModel();

  const updateModel = useCallback(
    ({ path, forceReload, pagePath, setModel, isInEditor }: Props) => {
      fetchModel({ cqPath: path, forceReload, pagePath })?.then((data: ModelProps | void) => {
        if (data && Object.keys(data).length) {
          setModel(data);
          if (isInEditor && pagePath) {
            PathUtils.dispatchGlobalCustomEvent(Events.ASYNC_CONTENT_LOADED_EVENT, {});
          }
        }
      });
    },
    [fetchModel],
  );

  return { updateModel };
};

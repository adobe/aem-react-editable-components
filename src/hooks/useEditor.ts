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
import { Events } from '../constants';
import { fetchModel } from '../api/fetchModel';

type Props = {
  path: string;
  forceReload?: boolean;
  isInEditor?: boolean;
  pagePath?: string;
  setModel: Dispatch<ModelProps>;
};

export const useEditor = () => {
  const updateModel = useCallback(async ({ path, forceReload, pagePath, setModel, isInEditor }: Props) => {
    const model = await fetchModel({ cqPath: path, forceReload, pagePath }).catch((err) => console.error(err));
    if (model && Object.keys(model).length) {
      setModel(model);
      if (isInEditor && pagePath) {
        PathUtils.dispatchGlobalCustomEvent(Events.ASYNC_CONTENT_LOADED_EVENT, {});
      }
    }
  }, []);

  return { updateModel };
};

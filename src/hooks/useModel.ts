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
import { useCallback } from 'react';
import { Model, ModelManager } from '@adobe/aem-spa-page-model-manager';
import { Utils } from '../utils/Utils';
import { ModelProps } from '../types/AEMModel';

type Props = {
  cqPath?: string;
  forceReload?: boolean;
  pagePath?: string;
  itemPath?: string;
};

// Model specific logic could be placed here
export const useModel = (): { fetchModel: (_arg: Props) => Promise<void | ModelProps> | undefined } => {
  const fetchModel = useCallback(({ cqPath, forceReload = false, pagePath, itemPath }: Props) => {
    if (!cqPath && !pagePath) {
      return;
    }
    return ModelManager.getData({ path: cqPath || Utils.getCQPath({ pagePath, itemPath }), forceReload })
      .then((data: Model) => {
        if (data && Object.keys(data).length) {
          return Utils.modelToProps(data);
        }
        return {};
      })
      .catch((err) => console.error(err));
  }, []);

  return { fetchModel };
};

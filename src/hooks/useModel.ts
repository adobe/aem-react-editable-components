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

import { Model, ModelManager, PathUtils } from "@adobe/aem-spa-page-model-manager";
import { Events } from "../constants/events.constants";
import { Utils } from "../types";

type PathObj = {
  cqPath?: string;
  pagePath?: string;
  itemPath?: string;
};

// Editor specific logic could be placed here
export const useModel = () => {
  const initializeModel = (props: PathObj, isInEditor = false, forceReload = false) => {
    const { fetchModel } = useModel();
    
    const path = Utils.getCQPath(props); //check if injectprops is needed after refactoring and update util accordingly
    ModelManager.addListener(path, fetchModel);
    return fetchModel(props, forceReload)
      .then(data => {
        if (isInEditor && props.pagePath) {
          PathUtils.dispatchGlobalCustomEvent(Events.ASYNC_CONTENT_LOADED_EVENT, {});
        }
        return data;
      })
      // Following logic for standalone items or highest level in 2.0 only. Figure how to do this in a simpler way
        // Use an extra prop like injectprops as already done?
        // or would checking for pagepath do as it should not be available for children
        // if(isInEditor() && injectPropsOnInit) { 
        //   PathUtils.dispatchGlobalCustomEvent(Constants.ASYNC_CONTENT_LOADED_EVENT, {});
        // }
      .catch(err => console.error(err));      
}

  const fetchModel = (componentProps: PathObj, forceReload = false) => {
    const path = componentProps.cqPath || Utils.getCQPath(componentProps); //check if injectprops is needed after refactoring and update util accordingly
    return ModelManager.getData({ path, forceReload })
      .then((data: Model) => Utils.modelToProps(data))
      .catch(err => console.error(err));
  }; 

  return {
    fetchModel,
    initializeModel
  };
};
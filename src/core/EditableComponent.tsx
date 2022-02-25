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

import React, { useEffect, useState } from 'react';
import { ClassNames } from '../constants/classnames.constants';
import { AuthoringUtils } from '@adobe/aem-spa-page-model-manager';
import { Properties } from '../constants/properties.constants';
import { ModelProps } from '../types/AEMModel';
import { useModel } from '../hooks/useModel';

interface EditConfig {
  emptyLabel?: string;
  isEmpty?: (props: any) => boolean;
  resourceType?: string;
  forceReload?: boolean;
};

type Props = {
  children: React.ComponentType<ModelProps>;
  editConfig: EditConfig;
  className?: string;
  userModel?: ModelProps;
} & ModelProps;

export const EditableComponent = ({ 
  editConfig = { isEmpty: ({}) => false, emptyLabel:"", forceReload: false },
  children,
  userModel,
  appliedCssClassNames,
  className,
  ...props
}: Props) => {
  const { initializeModel } = useModel();
  const isInEditor = AuthoringUtils.isInEditor();
  const [model, setModel] = useState(() => userModel || initializeModel(props, isInEditor, editConfig.forceReload));
  const WrappedComponent = children;
  // if user has passed in a model by default initialize to this
  // set standard of what this should look like - the model fetched as is or the transformed 
  // one we use and will return via hook with : updated to cq?
  //see what is defined as containerprops originally - that can also be removed from model state

  // How does this fit in?
  //   useEffect(() => {
//     ModelManager.addListener(cqPath, this.updateData);
//     return () => {
//       ModelManager.removeListener(cqPath, this.updateData);
//     }
// }, []);


useEffect(() => {
    // just for understanding.find optimized way for doing this comparison
    if(model !== props) {
      setModel(props);  
    }
  }, [model])
  
  return isInEditor ? (
    <div 
      {...{
        [Properties.DATA_PATH_ATTR]: props.cqPath,
        [Properties.DATA_CQ_RESOURCE_TYPE_ATTR]: editConfig.resourceType || "",
      }}
      className={`${className || ''} ${appliedCssClassNames || ''}`}>
      <WrappedComponent {...model} />
      {
        editConfig.isEmpty && editConfig.isEmpty(props) && 
        <div className={ClassNames.DEFAULT_PLACEHOLDER} data-emptytext={editConfig.emptyLabel} />
      }
    </div>
  ) : (
    <WrappedComponent {...model} />
  );
};
   
    // if(!model) {
    //   const { fetchModel } = useModel();
    //   fetchModel({ cqPath, pagePath, itemPath }, forceReload)
    //     .then((data) => {
    //       setModel(data);
          // Following logic for standalone items or highest level in 2.0 only. Figure how to do this in a simpler way
          // Use an extra prop like injectprops as already done?
          // or would checking for pagepath do as it should not be available for children
          // if(isInEditor() && injectPropsOnInit) { 
          //   PathUtils.dispatchGlobalCustomEvent(Constants.ASYNC_CONTENT_LOADED_EVENT, {});
          // }
        // })
    //     .catch(err => console.error(err));      
    // } else {
    //   const { updateStore } = useStore();
    //   updateStore(model);
    // }
  
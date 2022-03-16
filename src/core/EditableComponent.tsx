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

import React, { ReactNode, useEffect, useState } from 'react';
import { MappedComponentProperties } from './ComponentMapping';
import { ClassNames } from '../constants/classnames.constants';
import { Properties } from '../constants/properties.constants';
import Utils from '../utils/Utils';
import { useModel } from '../hooks/useModel';
import { ModelManager } from '@adobe/aem-spa-page-model-manager';
import { PageModel } from '../types/AEMModel';

export interface Config<P extends MappedComponentProperties> {
  emptyLabel?: string;
  isEmpty(_props: P): boolean;
  resourceType?: string;
  forceReload?: boolean;
}

type Props = {
  config?: Config<MappedComponentProperties>;
  children?: ReactNode;
  className?: string;
  appliedCssClassNames?: string;
  containerProps?: { className?: string };
  model?: PageModel;
  pagePath?: string;
  itemPath?: string;
} & MappedComponentProperties;

const Placeholder = ({ config, ...props }: Props) => {
  const { emptyLabel = '', isEmpty } = config || {};
  if (!(typeof isEmpty === 'function' && isEmpty(props))) {
    return null;
  }
  return <div className={ClassNames.DEFAULT_PLACEHOLDER} data-emptytext={emptyLabel}></div>;
};

const addPropsToComponent = (component: ReactNode, props: MappedComponentProperties) => {
  if (React.isValidElement(component)) {
    return React.cloneElement(component, props);
  }
  return component;
};

export const EditableComponent = ({
  config,
  children,
  model: userModel,
  cqPath,
  pagePath,
  itemPath,
  ...props
}: Props): JSX.Element => {
  const { fetchModel } = useModel();
  const { forceReload } = config || {};
  const path = Utils.getCQPath({ cqPath, pagePath, itemPath });
  const [model, setModel] = useState(() => userModel || {});

  useEffect(() => {
    const updateModel = () => fetchModel(path, setModel, forceReload, pagePath);
    ModelManager.addListener(path, updateModel);
    updateModel();

    return () => {
      ModelManager.removeListener(path, updateModel);
    };
  }, [path, fetchModel, forceReload, pagePath]);

  const componentProps = {
    cqPath: path,
    ...props,
    ...model,
  };

  return props.isInEditor ? (
    <div
      className={`${props.className || ''} ${props.containerProps?.className || ''} ${
        props.appliedCssClassNames || ''
      }`}
      {...{
        [Properties.DATA_PATH_ATTR]: path,
        [Properties.DATA_CQ_RESOURCE_TYPE_ATTR]: config?.resourceType || '',
      }}
    >
      {addPropsToComponent(children, componentProps)}
      <Placeholder config={config} {...componentProps} />
    </div>
  ) : (
    <>{addPropsToComponent(children, componentProps)}</>
  );
};

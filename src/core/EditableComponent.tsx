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
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* @ts-ignore */
import React, { ReactNode, useEffect, useState } from 'react';
import { MappedComponentProperties } from './ComponentMapping';
import { ClassNames, Properties } from '../constants';
import { Utils } from '../utils/Utils';
import { useModel } from '../hooks/useModel';
import { AuthoringUtils, ModelManager } from '@adobe/aem-spa-page-model-manager';
import { PageModel } from '../types/AEMModel';

export interface Config<P extends MappedComponentProperties> {
  emptyLabel?: string;
  isEmpty(_props: P): boolean;
  resourceType?: string;
  forceReload?: boolean;
}

export type Props = {
  config?: Config<MappedComponentProperties>;
  children?: ReactNode;
  className?: string;
  appliedCssClassNames?: string;
  containerProps?: { className?: string };
  model?: PageModel;
  pagePath?: string;
  itemPath?: string;
  removeAEMStyles?: boolean;
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
  const isInEditor = props.isInEditor || AuthoringUtils.isInEditor();

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
    ...model,
  };

  const dataAttr =
    (isInEditor && {
      [Properties.DATA_PATH_ATTR]: path,
      [Properties.DATA_CQ_RESOURCE_TYPE_ATTR]: config?.resourceType || '',
    }) ||
    {};

  const className = `${props.className || ''} ${props.containerProps?.className || ''} ${
    props.appliedCssClassNames || ''
  }`.trim();

  const updatedComponent = addPropsToComponent(children, pagePath ? componentProps : model);
  return isInEditor || (!props.removeAEMStyles && className) ? (
    <div className={className} {...dataAttr}>
      {updatedComponent}
      {isInEditor && <Placeholder config={config} {...componentProps} />}
    </div>
  ) : (
    <>{updatedComponent}</>
  );
};

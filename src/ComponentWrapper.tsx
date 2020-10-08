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

import {EditConfig, withEditable} from "./components/EditableComponent";
import { withEditorContext} from "./EditorContext";
import {ReloadableModelProperties, withModel} from "./components/ModelProvider";
import React from "react";
import {MappedComponentProperties} from "./ComponentMapping";

/**
 * Wraps a React component with the edition capabilities and model data
 * If an {@link EditConfig} is provided the <i>clazz</i> is wrapped to provide edition capabilities on the AEM Page Editor
 *
 * @param {React.Component} component - class to be instantiated for the given resource types
 * @param {EditConfig} [editConfig] - configuration object for enabling the edition capabilities
 * @param {ReloadableModelProperties} modelConfig - configuration object of the withModel function.
 * @returns {any}
 */
export const WrapAsAEMEditableComponent = <P extends MappedComponentProperties>(
        component: React.ComponentType<any>, editConfig?: EditConfig<P>, modelConfig?: ReloadableModelProperties
): any => {
    const { injectPropsOnInit = true, forceReload = false } = modelConfig || {};
    return withEditorContext(withModel(withEditable(component, editConfig), {injectPropsOnInit, forceReload}))
};

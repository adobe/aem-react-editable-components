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
import Utils from '../utils/Utils';
import { useEditor } from '../hooks/useEditor';
import { ClassNames } from '../constants/classnames.constants';
import { Properties } from '../constants/properties.constants';
import { ModelProps } from '../types/AEMModel';

type PlaceholderProps = {
    cqPath: string;
};

const ComponentList = ({ cqItems = {}, cqItemsOrder = [], cqPath = "", componentMapping }: ModelProps) => {
    if (!cqItems || !cqItemsOrder) {
        return <></>;
    }
    const components = cqItemsOrder.map((itemKey: string) => {
        const itemProps = Utils.modelToProps(cqItems[itemKey]);
        if (itemProps) {
            const ItemComponent = componentMapping.get(itemProps.cqType);
            const itemPath = cqPath ? `${cqPath}/${itemKey}` : itemKey;
            return (
                <ItemComponent
                    {...itemProps}
                    key={itemPath}
                    cqPath={itemPath}
                />
            )
        }
    });
    return <>{components}</>;
};

const ContainerPlaceholder = ({ cqPath }: PlaceholderProps) => (
    <div 
        data-cq-data-path={`${cqPath}/*`} 
        className={ClassNames.NEW_SECTION} 
    />
);

// to do: clarify usage of component mapping and define type
export const Container = (props: ModelProps) => {
    const { cqPath = "" } = props;
    const { isInEditor } = useEditor();
    const containerProps = {
        [Properties.DATA_PATH_ATTR]: cqPath
    };

    // clarify why aemnodecoration is needed when not in editor in the first place
    // shouldnt all aem specific things be removed anyway?
    return isInEditor() ? (
        <div className={ClassNames.CONTAINER} {...containerProps}>
            <ComponentList {...props} />
            <ContainerPlaceholder cqPath={cqPath} />
        </div>
    ) : <ComponentList {...props} />;
};

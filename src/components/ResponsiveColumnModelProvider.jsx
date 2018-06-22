/*
 * ADOBE CONFIDENTIAL
 *
 * Copyright 2018 Adobe Systems Incorporated
 * All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Adobe Systems Incorporated and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Adobe Systems Incorporated and its
 * suppliers and may be covered by U.S. and Foreign Patents,
 * patents in process, and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe Systems Incorporated.
 */
import ModelProvider from './ModelProvider';

const RESPONSIVE_COLUMN_CLASS_NAME_PATTERN = /aem-GridColumn([^ ])*/g;

/**
 * Model provider specific to the components identified as responsive columns
 *
 * @class
 * @extends ModelProvider
 * @memberOf components
 */
class ResponsiveColumnModelProvider extends ModelProvider {

    /**
     * @inheritDoc
     */
    decorateChildElement(element) {
        super.decorateChildElement(element);

        if (!element || !this.state.cqModel || !this.state.cqModel.columnClassNames) {
            return;
        }

        // Remove all the column class names
        element.className = element.className.replace(RESPONSIVE_COLUMN_CLASS_NAME_PATTERN, '');

        let columnClassNames = this.state.cqModel.columnClassNames.split(' ');

        columnClassNames.forEach(className => {
            if (!element.classList.contains(className)) {
                element.classList.add(className);
            }
        });
    }
}

export default ResponsiveColumnModelProvider;
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

/**
 * Does the provided element matches the given selector
 *
 * @param el to be tested
 * @param selector selector to be found
 */
function matches(el: any, selector: any) {
    return (el.matches
            || el.matchesSelector
            || el.msMatchesSelector
            || el.mozMatchesSelector
            || el.webkitMatchesSelector
            || el.oMatchesSelector)
        .call(el, selector);
}

/**
 * Generic observe function
 *
 * @param verify function which verify the processed object
 * @param callback function to be called when the verification succeed
 */
function observe(verify: any, callback: any) {
    return function(mutationsList: any) {
        for (const mutation of mutationsList) {
            if (verify(mutation)) {
                callback && callback();
                break;
            }
        }
    };
}

/**
 * Generic observe function
 *
 * @param process function in charge of providing an object to the verify function
 * @param verify function which verify the processed object
 * @param callback function to be called when the verification succeed
 */
function observeProcess(process: any, verify: any, callback: any) {
    return function (mutationsList: any) {
        const result = {};

        for (const mutation of mutationsList) {
            process(mutation, result);
        }

        verify(result);
        callback();
    };
}

/**
 * Returns a camel case string based on the provided dash separated attribute name
 *
 * @param attributeName
 */
function extractDataAttributeName(attributeName: any) {
    if (!attributeName) {
        return;
    }

    // Transforms the dash separated name into a camel case variable name
    const tokens = attributeName.split('-');

    // get rid of the data token
    if (attributeName.startsWith('data-')) {
        tokens.shift();
    }

    for (let i = 1, length = tokens.length; i < length; i++) {
        const token = tokens[i];

        tokens[i] = token.substr(0, 1).toUpperCase() + token.substr(1);
    }

    return tokens.join('');
}

/**
 * Returns a MutationObserver instance where a verify condition can be provided. When the condition is satisfied the callback function is called
 *
 * @param verify function which verify the processed object
 * @param callback function to be called when the verification succeed
 */
export function getVerifyObserver(verify: any, callback: any) {
    return new MutationObserver(observe(verify, callback));
}

/**
 * Observers if the provided map of data attributes is available on one of the target element of the list of mutations
 *
 * @param attributes map of attributes and value to be found on the target element
 * @param selector selector for querying a specific element
 * @param callback function to be called when the verification succeed
 */
/* eslint-disable no-prototype-builtins */
export function getDataAttributesObserver(attributes: any, selector: any, callback: any) {
    const process = function (mutation: any, resultMap: any) {
        resultMap = resultMap || {};

        if (mutation.type !== 'attributes') {
            return;
        }

        for (const attributeName in attributes) {
            if (mutation.attributeName === attributeName) {
                if (!selector || matches(mutation.target, selector)) {
                    if (attributes.hasOwnProperty(attributeName)) {
                        const dataAttributeName = extractDataAttributeName(attributeName);
                        resultMap[attributeName] = mutation.target.dataset[dataAttributeName];
                    }
                }
            }
        }
    };

    const verify = function (resultMap: any) {
        for (const attributeName in attributes) {
            if (attributes.hasOwnProperty(attributeName)) {
                expect(resultMap[attributeName]).to.equal(attributes[attributeName]);
            }
        }
    };

    return new MutationObserver(observeProcess(process, verify, callback));
}

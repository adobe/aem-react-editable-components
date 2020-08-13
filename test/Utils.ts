/**
 * Does the provided element matches the given selector
 *
 * @param {HTMLElement} el      - element to be tested
 * @param {string} selector     - selector to be found
 * @returns {*}
 */
function matches(el, selector) {
    return (el.matches || el.matchesSelector || el.msMatchesSelector || el.mozMatchesSelector || el.webkitMatchesSelector || el.oMatchesSelector).call(el, selector);
}

/**
 * Generic observe function
 *
 * @param {function} verify     - function which verify the processed object
 * @param {function} callback   - function to be called when the verification succeed
 * @returns {Function}
 */
function observe(verify, callback) {
    return function (mutationsList) {
        for (const mutation of mutationsList) {
            if (verify(mutation)) {
                callback && callback();
                break;
            }
        }
    }
}

/**
 * Generic observe function
 *
 * @param {function} process    - function in charge of providing an object to the verify function
 * @param {function} verify     - function which verify the processed object
 * @param {function} callback   - function to be called when the verification succeed
 * @returns {Function}
 */
function observeProcess(process, verify, callback) {
    return function (mutationsList) {
        const result = {};

        for (const mutation of mutationsList) {
            process(mutation, result);
        }

        verify(result);
        callback();
    }
}

/**
 * Returns a camel case string based on the provided dash separated attribute name
 *
 * @param attributeName
 * @returns {string|undefined}
 */
function extractDataAttributeName(attributeName) {
    if (!attributeName) {
        return;
    }

    // Transforms the dash separated name into a camel case variable name
    const tokens = attributeName.split("-");

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
 * @param {function} verify     - function which verify the processed object
 * @param {function} callback   - function to be called when the verification succeed
 * @returns {MutationObserver}
 */
export function getVerifyObserver(verify, callback) {
    return new MutationObserver(observe(verify, callback));
}

/**
 * Observers if the provided map of data attributes is available on one of the target element of the list of mutations
 *
 * @param {{}} attributes           - map of attributes and value to be found on the target element
 * @param {string} [selector]       - selector for querying a specific element
 * @param {function} callback       - function to be called when the verification succeed
 * @returns {MutationObserver}
 */
export function getDataAttributesObserver(attributes, selector, callback) {
    const process = function (mutation, resultMap) {
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

    const verify = function (resultMap) {
        for (const attributeName in attributes) {
            if (attributes.hasOwnProperty(attributeName)) {
                expect(resultMap[attributeName]).to.equal(attributes[attributeName]);
            }
        }
    };

    return new MutationObserver(observeProcess(process, verify, callback));
}

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {getVerifyObserver} from '../Utils';
import { MapTo, PageModelManager } from '../../index';
import Container from '../../dist/components/Container';

describe('Container ->', () => {

    const CONTAINER_RESOURCE_TYPE = 'item/container';
    const ITEM_CHILD_RESOURCE_TYPE = 'item/child';
    const PAGE_RESOURCE_TYPE = 'component/page';
    const ROOT_CLASS_NAME = 'root-class';
    const CONTAINER_CLASS_NAME = 'container-class';
    const ITEM_CLASS_NAME = 'item-class';
    const PAGE_CLASS_NAME = 'page-class';
    const CHILD_ITEM_TITLE_1 = 'Child 1';
    const CHILD_ITEM_TITLE_2 = 'Child 2';

    const ITEM_MODEL = {
        ":type": ITEM_CHILD_RESOURCE_TYPE,
        "title": CHILD_ITEM_TITLE_1
    };

    const ITEM_MODEL_2 = {
        ":type": ITEM_CHILD_RESOURCE_TYPE,
        "title": CHILD_ITEM_TITLE_2
    };

    const CHILD_PAGE_MODEL_1 = {
        ":type": PAGE_RESOURCE_TYPE,
        ":itemsOrder": ["child02"],
        ":items": {
            "child02": ITEM_MODEL_2
        },
        ":pagePath": "/content/site/page1",
        ":pageTitle": "Page 1",
        ":pages": {}
    };

    const CHILD_PAGE_INJECT_MODEL = {
        ":type": PAGE_RESOURCE_TYPE,
        ":pagePath": "/content/inject/page",
        ":pageTitle": "Injected Page",
        ":pages": {}
    };

    const PAGE_CONTAINER_MODEL = {
        ":itemsOrder": ["child01"],
        ":items": {
            "child01": ITEM_MODEL
        },
        ":type": PAGE_RESOURCE_TYPE,
        ":pagePath": "/content/site",
        ":pageTitle": "Site",
        ":pages": {
            "/content/site/page1": CHILD_PAGE_MODEL_1,
            "/content/inject/page": CHILD_PAGE_INJECT_MODEL
        }
    };

    class TestContainer extends Container {

        render() {
            return <div className={CONTAINER_CLASS_NAME}>{this.innerContent}</div>;
        }
    }

    class ComponentChild extends Component {

        render() {
            return <div className={ITEM_CLASS_NAME}>{this.props.cq_model && this.props.cq_model.title}</div>;
        }
    }
    class Page extends Container {

        render() {
            return <div className={PAGE_CLASS_NAME}>{this.innerContent}</div>;
        }
    }

    let MappedContainer;

    let observer;

    let observerConfig = { attributes: true, subtree: true, childList: true };

    let rootNode;

    let sandbox = sinon.createSandbox();

    beforeEach(() => {
        sandbox.stub(PageModelManager, 'getData')
            .withArgs({pagePath: '', dataPath: '', forceReload: undefined}).resolves(PAGE_CONTAINER_MODEL)
            .withArgs({pagePath: '/content/site', dataPath: 'child01', forceReload: undefined}).resolves(ITEM_MODEL)
            .withArgs({pagePath: '/content/site/page1', dataPath: '', forceReload: undefined}).resolves(CHILD_PAGE_MODEL_1)
            .withArgs({pagePath: '/content/site/page1', dataPath: 'child02', forceReload: undefined}).resolves(ITEM_MODEL_2)
            .withArgs({pagePath: '/content/inject/page', dataPath: '', forceReload: undefined}).resolves(CHILD_PAGE_INJECT_MODEL);

        rootNode = document.createElement('div');
        rootNode.className = ROOT_CLASS_NAME;
        document.body.appendChild(rootNode);

        MappedContainer = MapTo(CONTAINER_RESOURCE_TYPE)(TestContainer);
        MapTo(ITEM_CHILD_RESOURCE_TYPE)(ComponentChild);
        MapTo(PAGE_RESOURCE_TYPE)(Page);
    });

    afterEach(() => {
        if (observer) {
            observer.disconnect();
        }

        sandbox.restore();

        if (rootNode) {
            document.body.appendChild(rootNode);
            rootNode = undefined;
        }
    });

    describe('dynamic inclusion ->', () => {

        it('should dynamically include items and pages', done => {
            observer = getVerifyObserver(function (mutation) {
                // should add the navigation component
                if (mutation.type !== 'childList' || !mutation.addedNodes || mutation.addedNodes.length < 0){
                    return false;
                }

                const items = rootNode.querySelectorAll('.' + ITEM_CLASS_NAME);
                const pages = rootNode.querySelectorAll('.' + PAGE_CLASS_NAME);

                if (!items || items.length < 2 || CHILD_ITEM_TITLE_1 !== items[0].innerText || CHILD_ITEM_TITLE_2 !== items[1].innerText) {
                    return false;
                }

                // Expected number of child pages
                if (!pages || pages.length < 2) {
                    return false;
                }

                return true;
            }, done);

            observer.observe(rootNode, observerConfig);

            ReactDOM.render(<MappedContainer></MappedContainer>, rootNode);

            // Provoke update
            ReactDOM.render(<MappedContainer date={Date.now()}></MappedContainer>, rootNode);
        });

    });

});

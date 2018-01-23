import { edit } from '../../index';

describe('TextEdit', () => {

    describe('isEmpty ->', () => {

        it('should have the right label', () => {
            assert.isTrue('Text' === edit.TextEdit.emptyLabel);
        });

        it('should be empty when there is no text', () => {
            let context = {
                props: {
                    cq_model: {}
                }
            };

            assert.isTrue(edit.TextEdit.isEmpty.bind(context)());
        });

        it('should be empty when text is empty', () => {
            let context = {
                props: {
                    cq_model: {
                        text: ''
                    }
                }
            };

            assert.isTrue(edit.TextEdit.isEmpty.bind(context)());
        });

        it('should be empty when text is empty after trim', () => {
            let context = {
                props: {
                    cq_model: {
                        text: '  '
                    }
                }
            };

            assert.isTrue(edit.TextEdit.isEmpty.bind(context)());
        });

        it('should not be empty when text filled', () => {
            let context = {
                props: {
                    cq_model: {
                        text: 'test'
                    }
                }
            };

            assert.isFalse(edit.TextEdit.isEmpty.bind(context)());
        });

    });

});

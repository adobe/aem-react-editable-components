import { edit } from '../../index';

describe('TextEdit', () => {

    describe('isEmpty ->', () => {

        it('should have the right label', done => {
            let textEdit = new edit.TextEdit();

            if ('Text' === textEdit.emptyLabel) {
                done();
            }
        });

        it('should be empty when there is no text', done => {
            let textEdit = new edit.TextEdit();

            textEdit.props = {
                cq_model: {}
            };

            if (textEdit.isEmpty()) {
                done();
            }
        });

        it('should be empty when text is empty', done => {
            let textEdit = new edit.TextEdit();

            textEdit.props = {
                cq_model: {
                    text: ''
                }
            };

            if (textEdit.isEmpty()) {
                done();
            }
        });

        it('should be empty when text is empty after trim', done => {
            let textEdit = new edit.TextEdit();

            textEdit.props = {
                cq_model: {
                    text: '  '
                }
            };

            if (textEdit.isEmpty()) {
                done();
            }
        });

        it('should not be empty when text filled', done => {
            let textEdit = new edit.TextEdit();

            textEdit.props = {
                cq_model: {
                    text: 'test'
                }
            };

            if (!textEdit.isEmpty()) {
                done();
            }
        });

    });

});

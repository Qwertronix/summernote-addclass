/**
 * 
 * copyright 2016 creativeprogramming.it di Stefano Gargiulo
 * email: info@creativeprogramming.it
 * accepting tips at https://www.paypal.me/creativedotit 
 * license: MIT
 * 
 */
(function (factory) {
    /* global define */
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node/CommonJS
        module.exports = factory(require('jquery'));
    } else {
        // Browser globals
        factory(window.jQuery);
    }
}(function ($) {

    // Extends plugins for adding hello.
    //  - plugin is external module for customizing.
    $.extend($.summernote.plugins, {
        /**
         * @param {Object} context - context object has status of editor.
         */
        'addtemplate': function (context) {
            var self = this;
            if (typeof context.options.addtemplate === 'undefined') {
                context.options.addtemplate = {};
            }
            if (typeof context.options.addtemplate.classTags === 'undefined') {
                context.options.addtemplate.classTags = ["jumbotron", "lead","img-rounded","img-circle", "img-responsive","btn", "btn btn-success","btn btn-danger","text-muted", "text-primary", "text-warning", "text-danger", "text-success", "table-bordered", "table-responsive", "alert", "alert alert-success", "alert alert-info", "alert alert-warning", "alert alert-danger", "visible-sm", "hidden-xs", "hidden-md", "hidden-lg", "hidden-print"];
                //  console.log("Please define your summernote.options.addtemplate.classTags array");
            }
            if (typeof context.options.addtemplate.htmlTemplates === 'undefined') {
                context.options.addtemplate.htmlTemplates = [{title: 'Card', before:'<div class="card" style="width: 18rem;"><div class="card-body"><h5 class="card-title">Card title</h5><h6 class="card-subtitle mb-2 text-muted">Card subtitle</h6><p class="card-text">', defaultContent:'Some quick example text to build on the card title and make up the bulk of the card\'s content.', after:'</p><a href="#" class="card-link">Card link</a></div></div>',}];
            }
            if (typeof context.options.addtemplate.icon === 'undefined') {
                context.options.addtemplate.icon = 'class="fa fa-css3"'
            }
            // ui has renders to build ui elements.
            //  - you can create a button with `ui.button`
            var ui = $.summernote.ui;

            addStyleString(".scrollable-menu-addtemplate {height: auto; max-height: 200px; max-width:300px; overflow-x: hidden;}");

            context.memo('button.addtemplate', function () {
                var classtags = context.options.addtemplate.classTags.map(function (item) {
                    if (typeof item === 'string') {
                        item = {tag: "div", title: item, value: item};
                    }
                    item.option = 'class';
                });
                var htmlTemplates = context.options.addtemplate.htmlTemplates.filter(function (item) {
                    return typeof item === 'object' && item.hasOwnProperty('title') && (item.hasOwnProperty('before') || item.hasOwnProperty('after'));
                }).map(function (item) {
                    item.value = item.title
                    item.option = 'html'
                    item.tag = 'div'
                    if (!item.hasOwnProperty('before')) {
                        item.before = ''
                    }
                    if (!item.hasOwnProperty('after')) {
                        item.after = ''
                    }
                    if (!item.hasOwnProperty('defaultContent')) {
                        item.defaultContent = ''
                    }
                });
                var previewItems = classtags.concat(htmlTemplates);
                return ui.buttonGroup([
                    ui.button({
                        className: 'dropdown-toggle',
                        contents: '<i ' + context.options.addtemplate.icon + '\/>',
                        //ui.icon(context.options.icons.magic) + ' ' + ui.icon(context.options.icons.caret, 'span'),
                        tooltip: 'Toggle CSS class or add template', //lang.style.style,
                        data: {
                            toggle: 'dropdown'
                        }
                    }),
                    ui.dropdown({
                        className: 'dropdown-style scrollable-menu-addtemplate',
                        items: previewItems,
                        template: function (item) {
                            var tag = item.tag || 'div';
                            var title = item.title || 'UNKNOWN';
                            var style = item.style ? ' style="' + item.style + '" ' : '';
                            var cssclass = item.value ? ' class="' + item.value + '" ' : '';

                            if (item.type === 'class') {
                                return '<' + tag + ' ' + style + cssclass + '>' + title + '</' + tag + '>';
                            } else if (item.type === 'html') {
                                return '<i class="far fa-file-code"></i><' + tag + ' ' + style + cssclass + '>' + title + '</' + tag + '>';
                            } else {
                                return '<div' + style + cssclass + '>' + title + '</div>';
                            }
                        },
                        click: function (event, namespace, value) {

                            event.preventDefault();
                            value = value || $(event.target).closest('[data-value]').data('value');
                            var option = $(event.target).closest('[data-option]').data('option');

                            var $node = $(context.invoke("restoreTarget"))
                            if ($node.length==0){
                                $node = $(document.getSelection().focusNode.parentElement, ".note-editable");
                            }
                            
                            if (typeof context.options.addtemplate !== 'undefined' && typeof context.options.addtemplate.debug !== 'undefined' && context.options.addtemplate.debug) {
                                console.debug(context.invoke("restoreTarget"), $node, "toggling class: " + value, window.getSelection());
                            }

                            if (option === 'class') {
                                $node.toggleClass(value)
                            }
                            if (option === 'html') {
                                let template = htmlTemplates.find(item => {
                                    return item.title === value;
                                })
                                if ($node.html() == '') {
                                    $node.html(template.defaultContent)
                                }
                                $node.before(template.before)
                                $node.after(template.after)
                            }

                        }
                    })
                ]).render();
            });

            function addStyleString(str) {
                var node = document.createElement('style');
                node.innerHTML = str;
                document.body.appendChild(node);
            }

            // This events will be attached when editor is initialized.
            this.events = {
                // This will be called after modules are initialized.
                'summernote.init': function (we, e) {
                    //console.log('summernote initialized', we, e);
                },
                // This will be called when user releases a key on editable.
                'summernote.keyup': function (we, e) {
                    //  console.log('summernote keyup', we, e);
                }
            };

            // This method will be called when editor is initialized by $('..').summernote();
            // You can create elements for plugin
            this.initialize = function () {

            };

            // This methods will be called when editor is destroyed by $('..').summernote('destroy');
            // You should remove elements on `initialize`.
            this.destroy = function () {
                /*  this.$panel.remove();
                 this.$panel = null; */
            };
        }
    });
}));

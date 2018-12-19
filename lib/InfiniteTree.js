'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _infiniteTree = require('infinite-tree');

var _infiniteTree2 = _interopRequireDefault(_infiniteTree);

var _reactTinyVirtualList = require('react-tiny-virtual-list');

var _reactTinyVirtualList2 = _interopRequireDefault(_reactTinyVirtualList);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var lcfirst = function lcfirst(str) {
    str += '';
    return str.charAt(0).toLowerCase() + str.substr(1);
};

var _class = function (_Component) {
    _inherits(_class, _Component);

    function _class() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, _class);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = _class.__proto__ || Object.getPrototypeOf(_class)).call.apply(_ref, [this].concat(args))), _this), _this.tree = null, _this.state = {
            nodes: []
        }, _this.eventHandlers = {
            onContentWillUpdate: null,
            onContentDidUpdate: null,
            onOpenNode: null,
            onCloseNode: null,
            onSelectNode: null,
            onWillOpenNode: null,
            onWillCloseNode: null,
            onWillSelectNode: null
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(_class, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            var _this2 = this;

            var _props = this.props,
                children = _props.children,
                className = _props.className,
                style = _props.style,
                options = _objectWithoutProperties(_props, ['children', 'className', 'style']);

            if (options.el !== undefined) {
                delete options.el;
            }

            options.rowRenderer = function () {
                return '';
            };

            this.tree = new _infiniteTree2.default(options);

            // Filters nodes.
            // https://github.com/cheton/infinite-tree/wiki/Functions:-Tree#filterpredicate-options
            var treeFilter = this.tree.filter.bind(this.tree);
            this.tree.filter = function () {
                setTimeout(function () {
                    _this2.virtualList.recomputeSizes(0);
                }, 0);
                return treeFilter.apply(undefined, arguments);
            };

            // Unfilter nodes.
            // https://github.com/cheton/infinite-tree/wiki/Functions:-Tree#unfilter
            var treeUnfilter = this.tree.unfilter.bind(this.tree);
            this.tree.unfilter = function () {
                setTimeout(function () {
                    _this2.virtualList.recomputeSizes(0);
                }, 0);
                return treeUnfilter.apply(undefined, arguments);
            };

            // Sets the current scroll position to this node.
            // @param {Node} node The Node object.
            // @return {boolean} Returns true on success, false otherwise.
            this.tree.scrollToNode = function (node) {
                if (!_this2.tree || !_this2.virtualList) {
                    return false;
                }

                var nodeIndex = _this2.tree.nodes.indexOf(node);
                if (nodeIndex < 0) {
                    return false;
                }

                var offset = _this2.virtualList.getOffsetForIndex(nodeIndex);
                _this2.virtualList.scrollTo(offset);

                return true;
            };

            // Gets (or sets) the current vertical position of the scroll bar.
            // @param {number} [value] If the value is specified, indicates the new position to set the scroll bar to.
            // @return {number} Returns the vertical scroll position.
            this.tree.scrollTop = function (value) {
                if (!_this2.tree || !_this2.virtualList) {
                    return;
                }

                if (value !== undefined) {
                    _this2.virtualList.scrollTo(Number(value));
                }

                return _this2.virtualList.getNodeOffset();
            };

            // Updates the tree.
            this.tree.update = function () {
                _this2.tree.emit('contentWillUpdate');
                _this2.setState(function (state) {
                    return {
                        nodes: _this2.tree.nodes
                    };
                }, function () {
                    _this2.tree.emit('contentDidUpdate');
                });
            };

            Object.keys(this.eventHandlers).forEach(function (key) {
                if (!_this2.props[key]) {
                    return;
                }

                var eventName = lcfirst(key.substr(2)); // e.g. onContentWillUpdate -> contentWillUpdate
                _this2.eventHandlers[key] = _this2.props[key];
                _this2.tree.on(eventName, _this2.eventHandlers[key]);
            });
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            var _this3 = this;

            Object.keys(this.eventHandlers).forEach(function (key) {
                if (!_this3.eventHandlers[key]) {
                    return;
                }

                var eventName = lcfirst(key.substr(2)); // e.g. onUpdate -> update
                _this3.tree.removeListener(eventName, _this3.eventHandlers[key]);
                _this3.eventHandlers[key] = null;
            });

            this.tree.destroy();
            this.tree = null;
        }
    }, {
        key: 'render',
        value: function render() {
            var _this4 = this;

            var _props2 = this.props,
                autoOpen = _props2.autoOpen,
                selectable = _props2.selectable,
                tabIndex = _props2.tabIndex,
                data = _props2.data,
                width = _props2.width,
                height = _props2.height,
                rowHeight = _props2.rowHeight,
                rowRenderer = _props2.rowRenderer,
                shouldLoadNodes = _props2.shouldLoadNodes,
                loadNodes = _props2.loadNodes,
                shouldSelectNode = _props2.shouldSelectNode,
                scrollOffset = _props2.scrollOffset,
                scrollToIndex = _props2.scrollToIndex,
                onScroll = _props2.onScroll,
                onContentWillUpdate = _props2.onContentWillUpdate,
                onContentDidUpdate = _props2.onContentDidUpdate,
                onOpenNode = _props2.onOpenNode,
                onCloseNode = _props2.onCloseNode,
                onSelectNode = _props2.onSelectNode,
                onWillOpenNode = _props2.onWillOpenNode,
                onWillCloseNode = _props2.onWillCloseNode,
                onWillSelectNode = _props2.onWillSelectNode,
                style = _props2.style,
                children = _props2.children,
                props = _objectWithoutProperties(_props2, ['autoOpen', 'selectable', 'tabIndex', 'data', 'width', 'height', 'rowHeight', 'rowRenderer', 'shouldLoadNodes', 'loadNodes', 'shouldSelectNode', 'scrollOffset', 'scrollToIndex', 'onScroll', 'onContentWillUpdate', 'onContentDidUpdate', 'onOpenNode', 'onCloseNode', 'onSelectNode', 'onWillOpenNode', 'onWillCloseNode', 'onWillSelectNode', 'style', 'children']);

            var render = typeof children === 'function' ? children : rowRenderer;

            var count = this.tree ? this.tree.nodes.length : 0;

            // VirtualList
            var virtualListProps = {};
            if (scrollOffset !== undefined && count > 0) {
                virtualListProps.scrollOffset = scrollOffset;
            }
            if (scrollToIndex !== undefined && scrollToIndex >= 0 && scrollToIndex < count) {
                virtualListProps.scrollToIndex = scrollToIndex;
            }
            if (typeof onScroll === 'function') {
                virtualListProps.onScroll = onScroll;
            }

            return _react2.default.createElement(
                'div',
                _extends({}, props, {
                    style: _extends({
                        outline: 'none'
                    }, style),
                    tabIndex: tabIndex
                }),
                _react2.default.createElement(_reactTinyVirtualList2.default, _extends({
                    ref: function ref(node) {
                        _this4.virtualList = node;
                    },
                    width: width,
                    height: height,
                    itemCount: count,
                    itemSize: function itemSize(index) {
                        var node = _this4.tree.nodes[index];
                        if (node && node.state.filtered === false) {
                            return 0;
                        }

                        if (typeof rowHeight === 'function') {
                            return rowHeight({
                                node: _this4.tree.nodes[index],
                                tree: _this4.tree
                            });
                        }

                        return rowHeight; // Number or Array
                    },
                    renderItem: function renderItem(_ref2) {
                        var index = _ref2.index,
                            style = _ref2.style;

                        var row = null;

                        if (typeof render === 'function') {
                            var node = _this4.tree.nodes[index];
                            if (node && node.state.filtered !== false) {
                                row = render({
                                    node: _this4.tree.nodes[index],
                                    tree: _this4.tree
                                });
                            }
                        }

                        return _react2.default.createElement(
                            'div',
                            { key: index, style: style },
                            row
                        );
                    }
                }, virtualListProps))
            );
        }
    }]);

    return _class;
}(_react.Component);

_class.displayName = 'InfiniteTree';
_class.propTypes = {
    // Whether to open all nodes when tree is loaded.
    autoOpen: _propTypes2.default.bool,

    // Whether or not a node is selectable in the tree.
    selectable: _propTypes2.default.bool,

    // Specifies the tab order to make tree focusable.
    tabIndex: _propTypes2.default.number,

    // Tree data structure, or a collection of tree data structures.
    data: _propTypes2.default.oneOfType([_propTypes2.default.array, _propTypes2.default.object]),

    // Width of the tree.
    width: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number]).isRequired,

    // Height of the tree.
    height: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number]).isRequired,

    // Either a fixed height, an array containing the heights of all the rows, or a function that returns the height of a row given its index: `(index: number): number`
    rowHeight: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.array, _propTypes2.default.func]).isRequired,

    // A row renderer for rendering a tree node.
    rowRenderer: _propTypes2.default.func,

    // Loads nodes on demand.
    loadNodes: _propTypes2.default.func,

    // Provides a function to determine if a node can be selected or deselected. The function must return `true` or `false`. This function will not take effect if `selectable` is not `true`.
    shouldSelectNode: _propTypes2.default.func,

    // Controls the scroll offset.
    scrollOffset: _propTypes2.default.number,

    // Node index to scroll to.
    scrollToIndex: _propTypes2.default.number,

    // Callback invoked whenever the scroll offset changes.
    onScroll: _propTypes2.default.func,

    // Callback invoked before updating the tree.
    onContentWillUpdate: _propTypes2.default.func,

    // Callback invoked when the tree is updated.
    onContentDidUpdate: _propTypes2.default.func,

    // Callback invoked when a node is opened.
    onOpenNode: _propTypes2.default.func,

    // Callback invoked when a node is closed.
    onCloseNode: _propTypes2.default.func,

    // Callback invoked when a node is selected or deselected.
    onSelectNode: _propTypes2.default.func,

    // Callback invoked before opening a node.
    onWillOpenNode: _propTypes2.default.func,

    // Callback invoked before closing a node.
    onWillCloseNode: _propTypes2.default.func,

    // Callback invoked before selecting or deselecting a node.
    onWillSelectNode: _propTypes2.default.func
};
_class.defaultProps = {
    autoOpen: false,
    selectable: true,
    tabIndex: 0,
    data: [],
    width: '100%'
};
exports.default = _class;
;
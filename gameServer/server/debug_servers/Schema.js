"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var spec_1 = require("./spec");
var encode = require("./encoding/encode");
var decode = require("./encoding/decode");
var ArraySchema_1 = require("./types/ArraySchema");
var MapSchema_1 = require("./types/MapSchema");
var ChangeTree_1 = require("./ChangeTree");
var EventEmitter_1 = require("./events/EventEmitter");
var EncodeSchemaError = /** @class */ (function (_super) {
    __extends(EncodeSchemaError, _super);
    function EncodeSchemaError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return EncodeSchemaError;
}(Error));
function assertType(value, type, klass, field) {
    var typeofTarget;
    var allowNull = false;
    switch (type) {
        case "number":
        case "int8":
        case "uint8":
        case "int16":
        case "uint16":
        case "int32":
        case "uint32":
        case "int64":
        case "uint64":
        case "float32":
        case "float64":
            typeofTarget = "number";
            if (isNaN(value)) {
                console.log("trying to encode \"NaN\" in " + klass.constructor.name + "#" + field);
            }
            break;
        case "string":
            typeofTarget = "string";
            allowNull = true;
            break;
        case "boolean":
            // boolean is always encoded as true/false based on truthiness
            return;
    }
    if (typeof (value) !== typeofTarget && (!allowNull || (allowNull && value !== null))) {
        var foundValue = "'" + JSON.stringify(value) + "'" + (value && value.constructor && " (" + value.constructor.name + ")");
        throw new EncodeSchemaError("a '" + typeofTarget + "' was expected, but " + foundValue + " was provided in " + klass.constructor.name + "#" + field);
    }
}
function assertInstanceType(value, type, klass, field) {
    if (!(value instanceof type)) {
        throw new EncodeSchemaError("a '" + type.name + "' was expected, but '" + value.constructor.name + "' was provided in " + klass.constructor.name + "#" + field);
    }
}
function encodePrimitiveType(type, bytes, value, klass, field) {
    assertType(value, type, klass, field);
    var encodeFunc = encode[type];
    if (encodeFunc) {
        encodeFunc(bytes, value);
    }
    else {
        throw new EncodeSchemaError("a '" + type + "' was expected, but " + value + " was provided in " + klass.constructor.name + "#" + field);
    }
}
function decodePrimitiveType(type, bytes, it) {
    return decode[type](bytes, it);
}
/**
 * Schema encoder / decoder
 */
var Schema = /** @class */ (function () {
    // allow inherited classes to have a constructor
    function Schema() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        // fix enumerability of fields for end-user
        Object.defineProperties(this, {
            $changes: {
                value: new ChangeTree_1.ChangeTree(this._indexes),
                enumerable: false,
                writable: true
            },
            $listeners: {
                value: {},
                enumerable: false,
                writable: true
            },
        });
        var descriptors = this._descriptors;
        if (descriptors) {
            Object.defineProperties(this, descriptors);
        }
    }
    Schema.onError = function (e) {
        console.error(e);
    };
    Object.defineProperty(Schema.prototype, "_schema", {
        get: function () { return this.constructor._schema; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Schema.prototype, "_descriptors", {
        get: function () { return this.constructor._descriptors; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Schema.prototype, "_indexes", {
        get: function () { return this.constructor._indexes; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Schema.prototype, "_fieldsByIndex", {
        get: function () { return this.constructor._fieldsByIndex; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Schema.prototype, "_filters", {
        get: function () { return this.constructor._filters; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Schema.prototype, "_deprecated", {
        get: function () { return this.constructor._deprecated; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Schema.prototype, "$changed", {
        get: function () { return this.$changes.changed; },
        enumerable: true,
        configurable: true
    });
    Schema.prototype.listen = function (attr, callback) {
        var _this = this;
        if (!this.$listeners[attr]) {
            this.$listeners[attr] = new EventEmitter_1.EventEmitter();
        }
        this.$listeners[attr].register(callback);
        // return un-register callback.
        return function () {
            return _this.$listeners[attr].remove(callback);
        };
    };
    Schema.prototype.decode = function (bytes, it) {
        if (it === void 0) { it = { offset: 0 }; }
        var changes = [];
        var schema = this._schema;
        var fieldsByIndex = this._fieldsByIndex;
        var totalBytes = bytes.length;
        // skip TYPE_ID of existing instances
        if (bytes[it.offset] === spec_1.TYPE_ID) {
            it.offset += 2;
        }
        var _loop_1 = function () {
            var isNil = decode.nilCheck(bytes, it) && ++it.offset;
            var index = bytes[it.offset++];
            if (index === spec_1.END_OF_STRUCTURE) {
                return "break";
            }
            var field = fieldsByIndex[index];
            var _field = "_" + field;
            var type = schema[field];
            var value = void 0;
            var hasChange = false;
            if (!field) {
                return "continue";
            }
            else if (isNil) {
                value = null;
                hasChange = true;
            }
            else if (type._schema) {
                value = this_1[_field] || this_1.createTypeInstance(bytes, it, type);
                value.decode(bytes, it);
                hasChange = true;
            }
            else if (Array.isArray(type)) {
                type = type[0];
                var valueRef_1 = this_1[_field] || new ArraySchema_1.ArraySchema();
                value = valueRef_1.clone(true);
                var newLength_1 = decode.number(bytes, it);
                var numChanges = Math.min(decode.number(bytes, it), newLength_1);
                var hasRemoval = (value.length > newLength_1);
                hasChange = (numChanges > 0) || hasRemoval;
                // FIXME: this may not be reliable. possibly need to encode this variable during serialization
                var hasIndexChange = false;
                // ensure current array has the same length as encoded one
                if (hasRemoval) {
                    // decrease removed items from number of changes.
                    // no need to iterate through them, as they're going to be removed.
                    Array.prototype.splice.call(value, newLength_1).forEach(function (itemRemoved, i) {
                        if (itemRemoved && itemRemoved.onRemove) {
                            try {
                                itemRemoved.onRemove();
                            }
                            catch (e) {
                                Schema.onError(e);
                            }
                        }
                        if (valueRef_1.onRemove) {
                            try {
                                valueRef_1.onRemove(itemRemoved, newLength_1 + i);
                            }
                            catch (e) {
                                Schema.onError(e);
                            }
                        }
                    });
                }
                for (var i = 0; i < numChanges; i++) {
                    var newIndex = decode.number(bytes, it);
                    var indexChangedFrom = void 0; // index change check
                    if (decode.indexChangeCheck(bytes, it)) {
                        decode.uint8(bytes, it);
                        indexChangedFrom = decode.number(bytes, it);
                        hasIndexChange = true;
                    }
                    var isNew = (!hasIndexChange && value[newIndex] === undefined) || (hasIndexChange && indexChangedFrom === undefined);
                    if (type.prototype instanceof Schema) {
                        var item = void 0;
                        if (isNew) {
                            item = this_1.createTypeInstance(bytes, it, type);
                        }
                        else if (indexChangedFrom !== undefined) {
                            item = valueRef_1[indexChangedFrom];
                        }
                        else {
                            item = valueRef_1[newIndex];
                        }
                        if (!item) {
                            item = this_1.createTypeInstance(bytes, it, type);
                            isNew = true;
                        }
                        item.decode(bytes, it);
                        value[newIndex] = item;
                    }
                    else {
                        value[newIndex] = decodePrimitiveType(type, bytes, it);
                    }
                    if (isNew) {
                        if (valueRef_1.onAdd) {
                            try {
                                valueRef_1.onAdd(value[newIndex], newIndex);
                            }
                            catch (e) {
                                Schema.onError(e);
                            }
                        }
                    }
                    else if (valueRef_1.onChange) {
                        try {
                            valueRef_1.onChange(value[newIndex], newIndex);
                        }
                        catch (e) {
                            Schema.onError(e);
                        }
                    }
                }
            }
            else if (type.map) {
                type = type.map;
                var valueRef = this_1[_field] || new MapSchema_1.MapSchema();
                value = valueRef.clone(true);
                var length = decode.number(bytes, it);
                hasChange = (length > 0);
                // FIXME: this may not be reliable. possibly need to encode this variable during
                // serializagion
                var hasIndexChange = false;
                var previousKeys = Object.keys(valueRef);
                for (var i = 0; i < length; i++) {
                    // `encodeAll` may indicate a higher number of indexes it actually encodes
                    // TODO: do not encode a higher number than actual encoded entries
                    if (bytes[it.offset] === undefined ||
                        bytes[it.offset] === spec_1.END_OF_STRUCTURE) {
                        break;
                    }
                    var isNilItem = decode.nilCheck(bytes, it) && ++it.offset;
                    // index change check
                    var previousKey = void 0;
                    if (decode.indexChangeCheck(bytes, it)) {
                        decode.uint8(bytes, it);
                        previousKey = previousKeys[decode.number(bytes, it)];
                        hasIndexChange = true;
                    }
                    var hasMapIndex = decode.numberCheck(bytes, it);
                    var isSchemaType = typeof (type) !== "string";
                    var newKey = (hasMapIndex)
                        ? previousKeys[decode.number(bytes, it)]
                        : decode.string(bytes, it);
                    var item = void 0;
                    var isNew = (!hasIndexChange && valueRef[newKey] === undefined) || (hasIndexChange && previousKey === undefined && hasMapIndex);
                    if (isNew && isSchemaType) {
                        item = this_1.createTypeInstance(bytes, it, type);
                    }
                    else if (previousKey !== undefined) {
                        item = valueRef[previousKey];
                    }
                    else {
                        item = valueRef[newKey];
                    }
                    if (isNilItem) {
                        if (item && item.onRemove) {
                            try {
                                item.onRemove();
                            }
                            catch (e) {
                                Schema.onError(e);
                            }
                        }
                        if (valueRef.onRemove) {
                            try {
                                valueRef.onRemove(item, newKey);
                            }
                            catch (e) {
                                Schema.onError(e);
                            }
                        }
                        delete value[newKey];
                        continue;
                    }
                    else if (!isSchemaType) {
                        value[newKey] = decodePrimitiveType(type, bytes, it);
                    }
                    else {
                        item.decode(bytes, it);
                        value[newKey] = item;
                    }
                    if (isNew) {
                        if (valueRef.onAdd) {
                            try {
                                valueRef.onAdd(value[newKey], newKey);
                            }
                            catch (e) {
                                Schema.onError(e);
                            }
                        }
                    }
                    else if (valueRef.onChange) {
                        try {
                            valueRef.onChange(value[newKey], newKey);
                        }
                        catch (e) {
                            Schema.onError(e);
                        }
                    }
                }
            }
            else {
                value = decodePrimitiveType(type, bytes, it);
                // FIXME: should not even have encoded if value haven't changed in the first place!
                // check FilterTest.ts: "should not trigger `onChange` if field haven't changed"
                hasChange = (value !== this_1[_field]);
            }
            if (hasChange && (this_1.onChange || this_1.$listeners[field])) {
                changes.push({
                    field: field,
                    value: value,
                    previousValue: this_1[_field]
                });
            }
            this_1[_field] = value;
        };
        var this_1 = this;
        while (it.offset < totalBytes) {
            var state_1 = _loop_1();
            if (state_1 === "break")
                break;
        }
        this._triggerChanges(changes);
        return this;
    };
    Schema.prototype.encode = function (root, encodeAll, client, bytes) {
        console.log(this.constructor.name, "encode");
        var _this = this;
        if (root === void 0) { root = this; }
        if (encodeAll === void 0) { encodeAll = false; }
        if (bytes === void 0) { bytes = []; }
        // skip if nothing has changed
        if (!this.$changes.changed && !encodeAll) {
            console.log(this.constructor.name, "nothing has changed");
            this._encodeEndOfStructure(this, root, bytes);
            return bytes;
        }
        console.log(this.constructor.name, "something has changed");

        var schema = this._schema;
        var indexes = this._indexes;
        var fieldsByIndex = this._fieldsByIndex;
        var filters = this._filters;
        var changes = Array.from((encodeAll) //  || client
            ? this.$changes.allChanges
            : this.$changes.changes).sort();
        var _loop_2 = function (i, l) {
            var field = fieldsByIndex[changes[i]] || changes[i];
            var _field = "_" + field;
            var type = schema[field];
            var filter = (filters && filters[field]);
            // const value = (filter && this.$allChanges[field]) || changes[field];
            var value = this_2[_field];
            var fieldIndex = indexes[field];
            if (value === undefined) {
                encode.uint8(bytes, spec_1.NIL);
                encode.number(bytes, fieldIndex);
            }
            else if (type._schema) {
                if (client && filter) {
                    // skip if not allowed by custom filter
                    if (!filter.call(this_2, client, value, root)) {
                        return "continue";
                    }
                }
                if (!value) {
                    // value has been removed
                    encode.uint8(bytes, spec_1.NIL);
                    encode.number(bytes, fieldIndex);
                }
                else {
                    // encode child object
                    encode.number(bytes, fieldIndex);
                    assertInstanceType(value, type, this_2, field);
                    this_2.tryEncodeTypeId(bytes, type, value.constructor);
                    value.encode(root, encodeAll, client, bytes);
                }
            }
            else if (Array.isArray(type)) {
                var $changes = value.$changes;
                if (client && filter) {
                    // skip if not allowed by custom filter
                    if (!filter.call(this_2, client, value, root)) {
                        return "continue";
                    }
                }
                encode.number(bytes, fieldIndex);
                // total number of items in the array
                encode.number(bytes, value.length);
                var arrayChanges = Array.from((encodeAll) //  || client
                    ? $changes.allChanges
                    : $changes.changes)
                    .filter(function (index) { return _this[_field][index] !== undefined; })
                    .sort(function (a, b) { return a - b; });
                // ensure number of changes doesn't exceed array length
                var numChanges = arrayChanges.length;
                // number of changed items
                encode.number(bytes, numChanges);
                var isChildSchema = typeof (type[0]) !== "string";
                // assert ArraySchema was provided
                assertInstanceType(this_2[_field], ArraySchema_1.ArraySchema, this_2, field);
                // encode Array of type
                for (var j = 0; j < numChanges; j++) {
                    var index = arrayChanges[j];
                    var item = this_2[_field][index];
                    /**
                     * TODO: filter array by items instead of the whole object
                     */
                    // if (client && filter) {
                    //     // skip if not allowed by custom filter
                    //     if (!filter.call(this, client, item, root)) {
                    //         continue;
                    //     }
                    // }
                    if (isChildSchema) { // is array of Schema
                        encode.number(bytes, index);
                        if (!encodeAll) {
                            var indexChange = $changes.getIndexChange(item);
                            if (indexChange !== undefined) {
                                encode.uint8(bytes, spec_1.INDEX_CHANGE);
                                encode.number(bytes, indexChange);
                            }
                        }
                        assertInstanceType(item, type[0], this_2, field);
                        this_2.tryEncodeTypeId(bytes, type[0], item.constructor);
                        item.encode(root, encodeAll, client, bytes);
                    }
                    else if (item !== undefined) { // is array of primitives
                        encode.number(bytes, index);
                        encodePrimitiveType(type[0], bytes, item, this_2, field);
                    }
                }
                if (!encodeAll && !client) {
                    $changes.discard();
                }
            }
            else if (type.map) {
                var $changes = value.$changes;
                if (client && filter) {
                    // skip if not allowed by custom filter
                    if (!filter.call(this_2, client, value, root)) {
                        return "continue";
                    }
                }
                // encode Map of type
                encode.number(bytes, fieldIndex);
                // TODO: during `encodeAll`, removed entries are not going to be encoded
                var keys = Array.from((encodeAll) //  || client
                    ? $changes.allChanges
                    : $changes.changes);
                encode.number(bytes, keys.length);
                // const previousKeys = Object.keys(this[_field]); // this is costly!
                var previousKeys = Array.from($changes.allChanges);
                var isChildSchema = typeof (type.map) !== "string";
                var numChanges = keys.length;
                // assert MapSchema was provided
                assertInstanceType(this_2[_field], MapSchema_1.MapSchema, this_2, field);
                for (var i_1 = 0; i_1 < numChanges; i_1++) {
                    var key = keys[i_1];
                    var item = this_2[_field][key];
                    var mapItemIndex = undefined;
                    /**
                     * TODO: filter map by items instead of the whole object
                     */
                    // if (client && filter) {
                    //     // skip if not allowed by custom filter
                    //     if (!filter.call(this, client, item, root)) {
                    //         continue;
                    //     }
                    // }
                    if (encodeAll) {
                        if (item === undefined) {
                            // previously deleted items are skipped during `encodeAll`
                            continue;
                        }
                    }
                    else {
                        // encode index change
                        var indexChange = $changes.getIndexChange(item);
                        if (item && indexChange !== undefined) {
                            encode.uint8(bytes, spec_1.INDEX_CHANGE);
                            encode.number(bytes, this_2[_field]._indexes.get(indexChange));
                        }
                        /**
                         * - Allow item replacement
                         * - Allow to use the index of a deleted item to encode as NIL
                         */
                        mapItemIndex = (!$changes.isDeleted(key) || !item)
                            ? this_2[_field]._indexes.get(key)
                            : undefined;
                    }
                    var isNil = (item === undefined);
                    /**
                     * Invert NIL to prevent collision with data starting with NIL byte
                     */
                    if (isNil) {
                        // TODO: remove item
                        // console.log("REMOVE KEY INDEX", { key });
                        // this[_field]._indexes.delete(key);
                        encode.uint8(bytes, spec_1.NIL);
                    }
                    if (mapItemIndex !== undefined) {
                        encode.number(bytes, mapItemIndex);
                    }
                    else {
                        encode.string(bytes, key);
                    }
                    if (item && isChildSchema) {
                        assertInstanceType(item, type.map, this_2, field);
                        this_2.tryEncodeTypeId(bytes, type.map, item.constructor);
                        item.encode(root, encodeAll, client, bytes);
                    }
                    else if (!isNil) {
                        encodePrimitiveType(type.map, bytes, item, this_2, field);
                    }
                }
                if (!encodeAll && !client) {
                    $changes.discard();
                    // TODO: track array/map indexes per client (for filtering)?
                    // TODO: do not iterate though all MapSchema indexes here.
                    this_2[_field]._updateIndexes(previousKeys);
                }
            }
            else {
                if (client && filter) {
                    // skip if not allowed by custom filter
                    if (!filter.call(this_2, client, value, root)) {
                        return "continue";
                    }
                }
                encode.number(bytes, fieldIndex);
                encodePrimitiveType(type, bytes, value, this_2, field);
            }
        };
        var this_2 = this;
        for (var i = 0, l = changes.length; i < l; i++) {
            _loop_2(i, l);
        }
        // flag end of Schema object structure
        this._encodeEndOfStructure(this, root, bytes);
        if (!encodeAll && !client) {
            this.$changes.discard();
        }

        // console.log(this.constructor.name, "encode", "bytes:", bytes);
        // console.log(this.constructor.name, "decode", JSON.stringify(this.myClone().decode(bytes)));

        return bytes;
    };
    Schema.prototype.myClone = function () {
        var cloned = new (this.constructor);
        var schema = this._schema;
        for (var field in schema) {
            if (typeof (this[field]) === "object" &&
                this[field]._schema) {
                // deep clone
                cloned[field] = this[field].myClone();
            }
            else {
                // primitive values
                cloned[field] = this[field];
            }
        }
        return cloned;
    };
    Schema.prototype.encodeFiltered = function (client, bytes) {
        return this.encode(this, false, client, bytes);
    };
    Schema.prototype.encodeAll = function (bytes) {
        return this.encode(this, true, undefined, bytes);
    };
    Schema.prototype.encodeAllFiltered = function (client, bytes) {
        return this.encode(this, true, client, bytes);
    };
    Schema.prototype.clone = function () {
        var cloned = new (this.constructor);
        var schema = this._schema;
        for (var field in schema) {
            if (typeof (this[field]) === "object" &&
                typeof (this[field].clone) === "function") {
                // deep clone
                cloned[field] = this[field].clone();
            }
            else {
                // primitive values
                cloned[field] = this[field];
            }
        }
        return cloned;
    };
    Schema.prototype.triggerAll = function () {
        var changes = [];
        var schema = this._schema;
        for (var field in schema) {
            if (this[field] !== undefined) {
                changes.push({
                    field: field,
                    value: this[field],
                    previousValue: undefined
                });
            }
        }
        try {
            this._triggerChanges(changes);
        }
        catch (e) {
            Schema.onError(e);
        }
    };
    Schema.prototype.toJSON = function () {
        var schema = this._schema;
        var deprecated = this._deprecated;
        var obj = {};
        for (var field in schema) {
            if (!deprecated[field] && this[field] !== null && typeof (this[field]) !== "undefined") {
                obj[field] = (typeof (this[field].toJSON) === "function")
                    ? this[field].toJSON()
                    : this["_" + field];
            }
        }
        return obj;
    };
    Schema.prototype.discardAllChanges = function () {
        var schema = this._schema;
        var changes = Array.from(this.$changes.changes);
        var fieldsByIndex = this._fieldsByIndex;
        for (var index in changes) {
            var field = fieldsByIndex[index];
            var type = schema[field];
            var value = this[field];
            // skip unchagned fields
            if (value === undefined) {
                continue;
            }
            if (type._schema) {
                value.discardAllChanges();
            }
            else if (Array.isArray(type)) {
                for (var i = 0, l = value.length; i < l; i++) {
                    var index_1 = value[i];
                    var item = this["_" + field][index_1];
                    if (typeof (type[0]) !== "string" && item) { // is array of Schema
                        item.discardAllChanges();
                    }
                }
                value.$changes.discard();
            }
            else if (type.map) {
                var keys = value;
                var mapKeys = Object.keys(this["_" + field]);
                for (var i = 0; i < keys.length; i++) {
                    var key = mapKeys[keys[i]] || keys[i];
                    var item = this["_" + field][key];
                    if (item instanceof Schema && item) {
                        item.discardAllChanges();
                    }
                }
                value.$changes.discard();
            }
        }
        this.$changes.discard();
    };
    Schema.prototype._encodeEndOfStructure = function (instance, root, bytes) {
        if (instance !== root) {
            bytes.push(spec_1.END_OF_STRUCTURE);
        }
    };
    Schema.prototype.tryEncodeTypeId = function (bytes, type, targetType) {
        // console.log(this.constructor.name, "tryEncodeTypeId", "type:", type);
        if (type._typeid !== targetType._typeid) {
            encode.uint8(bytes, spec_1.TYPE_ID);
            encode.uint8(bytes, targetType._typeid);
        } else {
          console.log("**********tryEncodeTypeId did nothing***********", "type:", type.name);
        }
    };
    Schema.prototype.createTypeInstance = function (bytes, it, type) {
        if (bytes[it.offset] === spec_1.TYPE_ID) {
            it.offset++;
            var anotherType = this.constructor._context.get(decode.uint8(bytes, it));
            return new anotherType();
        }
        else {
            return new type();
        }
    };
    Schema.prototype._triggerChanges = function (changes) {
        if (changes.length > 0) {
            for (var i = 0; i < changes.length; i++) {
                var change = changes[i];
                var listener = this.$listeners[change.field];
                if (listener) {
                    try {
                        listener.invoke(change.value, change.previousValue);
                    }
                    catch (e) {
                        Schema.onError(e);
                    }
                }
            }
            if (this.onChange) {
                try {
                    this.onChange(changes);
                }
                catch (e) {
                    Schema.onError(e);
                }
            }
        }
    };
    return Schema;
}());
exports.Schema = Schema;
//# sourceMappingURL=Schema.js.map

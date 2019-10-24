import { GraphQLScalarType } from 'graphql/type/definition';
import { GraphQLError } from 'graphql/error';
import { Kind } from 'graphql/language';


const MAC_REGEX = /^(?:[0-9A-Fa-f]{2}([:-]?)[0-9A-Fa-f]{2})(?:(?:\1|\.)(?:[0-9A-Fa-f]{2}([:-]?)[0-9A-Fa-f]{2})){2}$/;

const validate = (value: any) => {
    if (typeof value !== 'string') {
        throw new TypeError(`Value is not string: ${value}`);
    }

    if (!(MAC_REGEX.test(value))) {
        throw new TypeError(`Value is not a valid MAC address: ${value}`);
    }

    return value;
};

export default new GraphQLScalarType({
    name: `MAC`,

    description: `A field whose value is a IEEE 802 48-bit MAC address: https://en.wikipedia.org/wiki/MAC_address.`,

    serialize(value) {
        return validate(value);
    },

    parseValue(value) {
        return validate(value);
    },

    parseLiteral(ast) {
        if (ast.kind !== Kind.STRING) {
            throw new GraphQLError(`Can only validate strings as MAC addresses but got a: ${ast.kind}`);
        }

        return validate(ast.value);
    }
});

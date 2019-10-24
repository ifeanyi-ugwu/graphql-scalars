// https://github.com/abhiaiyer91/graphql-currency-scalars
import { GraphQLScalarType } from 'graphql/type/definition';
import { Kind } from 'graphql/language';

function generateCurrency(value: any) {
  if (typeof value !== 'number') {
    throw new TypeError(
      `Currency cannot represent non integer type ${JSON.stringify(value)}`
    );
  }

  const currencyInCents = parseInt(value.toString(), 10);

  return (currencyInCents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

function generateCents(value: string) {
  const digits = value.replace('$', '').replace(',', '');
  const number = parseFloat(digits);
  return number * 100;
}

/**
 * An Currency Scalar.
 *
 * Input:
 *    This scalar takes a currency string as input and
 *    formats it to currency in cents.
 *
 * Output:
 *    This scalar serializes currency in cents to
 *    currency strings.
 */

export default new GraphQLScalarType({
  name: 'USCurrency',
  description: 'A currency string, such as $21.25',
  serialize: generateCurrency,
  parseValue(value) {
    if (typeof value !== 'string') {
      throw new TypeError(
        `Currency cannot represent non string type ${JSON.stringify(value)}`
      );
    }

    return generateCents(value);
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      if (typeof ast.value === 'string') {
        return generateCents(ast.value);
      }
    }
    throw new TypeError(
      `Currency cannot represent an invalid currency-string ${JSON.stringify(ast)}.`
    );
  },
});

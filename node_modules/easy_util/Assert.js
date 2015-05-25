var Assert = function(){};

/**
 * a must equals to b
 * @param a
 * @param b
 */
Assert.prototype.eq = function(a, b)
{
    if(a != b)
    {
        throw new Error(a + ' is not equal to ' + b + '.');
    }
};

/**
 * a must not equals to b
 * @param a
 * @param b
 */
Assert.prototype.neq = function(a, b)
{
    if(a == b)
    {
        throw new Error(a + ' is equal to ' + b + '.');
    }
};

module.exports = new Assert();
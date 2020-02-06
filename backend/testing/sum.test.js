const sum = require('./tests/sum')
const concatName = require('./tests/concatName')

test('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(3)
})

test('concat name', () => {
    expect(concatName('Joe', 'Bloggs')).toBe('Joe Bloggs')
})



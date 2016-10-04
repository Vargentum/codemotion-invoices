import reducer, { initialState } from 'redux/modules/Invoices'

describe('(Redux) Invoices', () => {
  describe('(Reducer)', () => {
    it('sets up initial state', () => {
      expect(reducer(undefined, {})).to.eql(initialState)
    })
  })
})

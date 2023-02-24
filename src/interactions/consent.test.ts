import { consent } from './consent'

const mockArg: Gtag.ConsentArg = 'default'
const mockParams: Gtag.ConsentParams = { ad_storage: 'denied', analytics_storage: 'denied' }

describe("consent", () => {
  it("should not throw an error if gtag is not defined", () => {
    const action = () => consent({ arg: 'default', params: {} });
    expect(action).not.toThrow();
  });

  it("should call gtag with all the options", () => {
    window.gtag = jest.fn();
    consent({ arg: mockArg, params: mockParams });
    expect(window.gtag).toBeCalledTimes(1);
    expect(window.gtag).toBeCalledWith('consent', mockArg, mockParams);
  });
})


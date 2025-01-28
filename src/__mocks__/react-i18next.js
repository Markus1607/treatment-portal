const useMock = [(k) => k, {}];
useMock.t = (k) => k;
useMock.i18n = {};

module.exports = {
  initReactI18next: { type: '3rdParty', init: jest.fn() },
  useTranslation: () => useMock,
};

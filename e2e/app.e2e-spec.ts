import { ProjetoSalicPage } from './app.po';

describe('projeto-salic App', function() {
  let page: ProjetoSalicPage;

  beforeEach(() => {
    page = new ProjetoSalicPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});

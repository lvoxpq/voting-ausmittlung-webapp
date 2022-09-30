import { contestMock } from '../../http-mocks/contest.service.mock';
import { environment } from './environment';
import { AppPage } from '../../page-models/app';
import { user } from '../../roles/roles';

fixture`erfassung-login`.page(environment.appUrl).requestHooks(contestMock.listSummaries);

test('open page', t =>
  t
    .useRole(user(environment.appUrl, environment.appName))

    .expect(AppPage.title.textContent)
    .eql('VOTING Ausmittlung Erfassung')

    .expect(AppPage.tenant.textContent)
    .eql('e2e'));

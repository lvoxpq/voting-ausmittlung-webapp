import { contestMock } from '../../http-mocks/contest.service.mock';
import { AppPage } from '../../page-models/app';
import { user } from '../../roles/roles';
import { environment } from './environment';

fixture`monitoring-login`.page(environment.appUrl).requestHooks(contestMock.listSummaries);

test('open page', t =>
  t
    .useRole(user(environment.appUrl, environment.appName))

    .expect(AppPage.title.textContent)
    .eql('VOTING Ausmittlung Monitoring')

    .expect(AppPage.tenant.textContent)
    .eql('e2e'));

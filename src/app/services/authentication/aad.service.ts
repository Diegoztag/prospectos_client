import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { MsalBroadcastService, MsalGuardConfiguration, MsalService, MSAL_GUARD_CONFIG } from '@azure/msal-angular';
import { EventMessage, EventType, InteractionStatus, RedirectRequest } from '@azure/msal-browser';
import { Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

const GRAPH_URL = environment.authSources.AAD.graphUrl;
const GRAPH_PARAMS = 'displayName,givenName,surname,employeeId,mail,jobTitle,department,companyName';
const GRAPH_ENDPOINT = `${GRAPH_URL}/v1.0/me?$select=${GRAPH_PARAMS}`;

type ProfileType = {
  displayName?  : string,
  givenName?    : string,
  surname?      : string,
  employeeId?   : string,
  mail?         : string,
  jobTitle?     : string,
  department?   : string,
  companyName?  : string,
};

@Injectable()
export class AadService {

  private profile: ProfileType;
  private readonly _destroying$ = new Subject<void>();
  
  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private broadcastService: MsalBroadcastService,
    private authService: MsalService,
    private http: HttpClient
  ) {
  }
  
  private listenLogin(): Promise<string> {
    return new Promise(resolve => {
      this.broadcastService.msalSubject$
        .pipe(
          filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS),
          map(result => `${result.payload['tokenType']} ${result.payload['accessToken']}`)
        )
        .subscribe((result: string) => resolve(result))
    })
  }

  public loadProfile(): Promise<string> {
    return new Promise(resolve => {
      this.broadcastService.inProgress$
        .pipe(
          filter((status: InteractionStatus) => status === InteractionStatus.None),
          takeUntil(this._destroying$)
        )
        .subscribe(() => {
          if (this.authService.instance.getAllAccounts().length > 0) {
            this.getProfile().then(profile => resolve(profile.employeeId))
          }
        })
    })
  }

  public load() {
    return Promise.all([
      this.loadProfile(),
      this.listenLogin()
    ])
  }

  public login() {
    if (this.msalGuardConfig.authRequest) {
      this.authService.loginRedirect({ ...this.msalGuardConfig.authRequest } as RedirectRequest);
    } else {
      this.authService.loginRedirect();
    }
  }

  public logout() {
    this.authService.logoutRedirect({ postLogoutRedirectUri: 'http://localhost:4200' });
  }

  public getProfile(): Promise<ProfileType> {
    return new Promise((resolve) => {
      if (this.profile) resolve(this.profile)
      else {
        this.http.get(GRAPH_ENDPOINT).subscribe(profile => {
          this.profile = profile
          resolve(profile)
        });
      }
    })
  }

}

import { ConfigService } from './config.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  public apiRoot: string;
  public menuExist = new BehaviorSubject(false);

  public navItem$ = this.menuExist.asObservable();

  constructor(public http: HttpClient, private configService: ConfigService) {
    this.apiRoot = this.configService.config.apiMenu;
  }

  public getMenu(queryParams?: any): Observable<any> {
    return this.http.get(this.apiRoot, { params: queryParams }).pipe(
      map((resp: any) => {
        return resp.data.menu;
      })
    );
  }

  public setExistMenu(value: boolean) {
    this.menuExist.next(value);
  }
}

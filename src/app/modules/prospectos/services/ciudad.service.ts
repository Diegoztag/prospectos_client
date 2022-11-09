import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../../../services';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CiudadService {
  public apiRoot: string;

  constructor(public http: HttpClient, public configService: ConfigService) {
    this.apiRoot = configService.config.webApiBaseUrl + '/ciudads';
  }

  public obtener(parametros?: any): Observable<any> {
    return this.http.get(this.apiRoot, { params: parametros });
  }

  public obtenerPorId(id): Observable<any> {
    return this.http.get(`${this.apiRoot}/${id}`);
  }

  public guardar(ciudad): Observable<any> {
    return this.http.post(this.apiRoot, ciudad);
  }

  public actualizar(ciudad): Observable<any> {
    return this.http.put(`${this.apiRoot}/${ciudad.id}`, ciudad);
  }

  public eliminar(id: number, params?: any): Observable<any> {
    const options = {
      body: {
        id,
        params,
      },
    };
    // SIN BODI REQUEST
    // return this.http.delete(`${this.apiRoot}/${id}`);

    // CON BODY REQUEST
    return this.http.request('delete', `${this.apiRoot}/${id}`, options);
  }
}

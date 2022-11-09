import { Injectable } from '@angular/core';
import { IProspecto } from '../models/prospecto';
import { IDocumento } from '../models/documento';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../../../services';
import { Observable, tap, map } from 'rxjs';
import { saveAs } from 'file-saver'

@Injectable({
  providedIn: 'root',
})
export class ProspectosService {
  public apiRoot: string;

  constructor(public http: HttpClient, public configService: ConfigService) {
    this.apiRoot = configService.config.webApiBaseUrl + '/prospectos';
  }

  public obtener(parametros?: any): Observable<any> {
    return this.http.get(this.apiRoot, { params: parametros });
  }

  public obtenerPorId(id: number, queryParams?: any): Observable<any> {
    return this.http.get(`${this.apiRoot}/${id}`, { params: queryParams });
  }

  public guardar(prospecto: IProspecto): Observable<any> {
    return this.http.post(this.apiRoot, prospecto);
  }

  public guardarDoc(documento: IDocumento): Observable<any> {
    return this.http.post(`${this.apiRoot}/docs`, documento);
  }

  public obtenerArchivo(name: string, type:string) {
    return this.http.get(`${this.apiRoot}/files/${name}`, { responseType: 'blob' })
    .pipe(
      tap(content => {
        const blob = new Blob([content], {type});
        saveAs(blob, name);
      }),
      map(()=> true)
    );
  }

  public obtenerPdf(): Observable<any> {
    return this.http.get(`${this.apiRoot}/pdf`, { responseType: 'blob' });
  }
}

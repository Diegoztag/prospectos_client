import { Injectable } from '@angular/core';
import { IProspecto } from '../models/prospecto';
import { IDocumento } from '../models/documento';
import { IValidacion } from '../models/validar';
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
    this.apiRoot = configService.config.webApiBaseUrl;
  }

  public obtener(idu_promotor: number,parametros?: any): Observable<any> {
    return this.http.get(`${this.apiRoot}/prospectos/${idu_promotor}`, { params: parametros });
  }

  public obtenerPorId(id: number, queryParams?: any): Observable<any> {
    return this.http.get(`${this.apiRoot}/prospecto/${id}`, { params: queryParams });
  }

  public guardar(prospecto: IProspecto): Observable<any> {
    return this.http.post(`${this.apiRoot}/prospecto/`, prospecto);
  }

  public guardarDoc(documento: IDocumento): Observable<any> {
    return this.http.post(`${this.apiRoot}/prospecto/docs`, documento);
  }

  public obtenerArchivo(name: string, type:string) {
    return this.http.get(`${this.apiRoot}/prospecto/files/${name}`, { responseType: 'blob' })
    .pipe(
      tap(content => {
        const blob = new Blob([content], {type});
        saveAs(blob, name);
      }),
      map(()=> true)
      );
    }

    public obtenerPromotores(parametros?: any): Observable<any> {
      return this.http.get(`${this.apiRoot}/promotores` , { params: parametros });
    }

    public validar(id: number, validacion: IValidacion): Observable<any> {
      return this.http.put(`${this.apiRoot}/prospecto/${id}`, validacion);
    }
  }

import { CentroService } from './prospectos.service';
import { TestBed } from '@angular/core/testing';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ICentro } from '../models/prospecto_lista';
import { of } from 'rxjs';
import { ConfigService } from '../../../services/config.service';

const centrosService = {
    obtener: () => of(centros),
    eliminar: () => of(centros),
    obtenerPdf: () => of(centros)
}

const mockStripe = () => ({ get: () => undefined })
let configService: 'assets/settings/settings.json';

const centros: ICentro[] = [
    {
        id: 1,
        nomCentro: "230870",
        opcEstatus: 0,
        selected: true,
        ciudadId: 3,
        fecActualiza: "2019-06-05"
    },
    {
        id: 2,
        nomCentro: "2308asdf",
        opcEstatus: 1,
        selected: true,
        ciudadId: 1,
        fecActualiza: "2018-12-27"
    },
    {
        id: 3,
        nomCentro: "230830",
        opcEstatus: 2,
        selected: true,
        fecActualiza: "2018-12-27",
        ciudadId: 2
    }
]

describe('CentroService', () => {
    let service: CentroService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports:
                [
                    HttpClientTestingModule
                ],
            providers:
                [
                    // {provide: MenuService, useValue: menuExist}
                    { provide: CentroService, useValue: centrosService },
                    { provide: ConfigService, useFactory: configService }
                    // CentroService
                ],
            schemas:
                [
                    CUSTOM_ELEMENTS_SCHEMA,
                    NO_ERRORS_SCHEMA
                ]
        });
    });

    beforeEach(() => {
        service = TestBed.inject(CentroService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterAll(() => {
        httpMock.verify();
    });

    it('Verifica la creacion del servicio', () => {
        expect(service).toBeTruthy();
    });

    // it('Metodo de obtener', () => {

    //     service.obtener().subscribe((res: ICentro[]) => {
    //         expect(res).toEqual(centros);
    //     });

    //     // service.obtener().subscribe((resp: any) => {
    //     //     expect(resp.centrosService.length).toBe(3);
    //     //     expect(resp.centrosService).toEqual(centros);
    //     //     // expect(resp.length).toBe(1);
    //     // });

    //     // service.obtener();

    //     const req = httpMock. expectOne(configService);
    //     expect(req.request.method).toBe('GET');
    //     req.flush(centros);
    // });

});

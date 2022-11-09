import { ConfigService } from './config.service';
import { TestBed } from '@angular/core/testing';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { MenuService } from './menu.service';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

const menuExist = 
[
    {
        name: "Dashboard",
        url: "/dashboard",
        icon: "icon-speedometer"
    },
        {
            name: "Ejemplo",
            url: "/example",
            icon: "icon-wrench",
            badge: {
                "variant": "danger",
                "text": "NEW"
        }
    }
]


describe('MenuService', () => {
    let service: MenuService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports:
                [
                    HttpClientTestingModule
                ],
            providers:
                [
                    {provide: MenuService, useValue: menuExist}
                    // MenuService
                ],
            schemas:
                [
                    CUSTOM_ELEMENTS_SCHEMA,
                    NO_ERRORS_SCHEMA
                ]
        });
    });

    beforeEach(() => {
        service = TestBed.inject(MenuService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('Verifica la creacion del servicio', () => {
        expect(service).toBeTruthy();
    });

});

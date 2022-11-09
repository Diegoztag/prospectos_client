import { HttpClientModule } from '@angular/common/http';
import { BlockUIModule } from 'ng-block-ui';
import { NO_ERRORS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ExampleComponent } from './prospectos.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

@Pipe({ name: 'example', })
class ExamplePipe implements PipeTransform {
    transform(): any {
        return '';
    }
}

describe('example component', () => {
    let component: ExampleComponent;
    let fixture: ComponentFixture <ExampleComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                BlockUIModule.forRoot()
            ],
            declarations: [
                ExampleComponent,
                ExamplePipe
            ],
            schemas: [
                NO_ERRORS_SCHEMA
            ]
        }).compileComponents();
    }));


    beforeEach( () =>{
        fixture = TestBed.createComponent(ExampleComponent);
        component = fixture.componentInstance;
        //Hacemos que el componente empieze por el ngOnInit
        fixture.detectChanges();
    });

    it('Creacion del componente', () => {
        // fixture.detectChanges();
        expect(component).toBeTruthy();
    });
});

import { Component, OnInit, OnDestroy } from '@angular/core';
import { UntypedFormControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SecureStorageService } from 'src/app/services/secure-storage.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToasterService, Toast } from 'angular2-toaster';
import { ProspectosService } from '../services/prospectos.service';
import { IProspecto } from '../models/prospecto';
import { IValidacion } from '../models/validar';
import { Mensaje } from '../../../models/mensaje';
import Swal from 'sweetalert2';
import { ConfigService } from '../../../services';

@Component({
  selector: 'app-prospectos-form-evaluacion',
  templateUrl: './prospectos-form-evaluacion.component.html',
})
export class ProspectosFormEvaluacionComponent implements OnInit, OnDestroy {
  @BlockUI('prospecto-data') public blockUI: NgBlockUI;

  public prospecto: IProspecto;
  public title: string;
  public prospectoEvaluacionForm: UntypedFormGroup;
  public mensaje: Mensaje;
  public idu_prospecto: number;
  private sub: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public configService: ConfigService,
    private prospectosService: ProspectosService,
    private fb: UntypedFormBuilder,
    private toasterService: ToasterService,
    private secureStorage: SecureStorageService,
  ) {
    this.mensaje = new Mensaje(this.toasterService);
  }

  public ngOnInit() {
    this.prospectoEvaluacionForm = this.fb.group({
      idu_prospecto: new UntypedFormControl(this.idu_prospecto),
      idu_cat_estatus: new UntypedFormControl(1),
      des_observacion: new UntypedFormControl('SIN OBSERVACIÓN')
    });

    this.sub = this.route.params.subscribe((params) => {
      this.idu_prospecto = +params['id'];
      this.title = this.idu_prospecto ? 'Evaluar Prospecto' : 'Nuevo Prospecto';
      if (this.idu_prospecto) {
        this.blockUI.start('Loading...');
        this.prospectosService.obtenerPorId(this.idu_prospecto).subscribe((result) => {
          this.prospecto = result.data[0][0];
          this.inicializarFormulario(this.prospecto);
          this.blockUI.stop();
        });
      }
    });
  }

  public ngOnDestroy() {
    this.sub.unsubscribe();
  }

  public inicializarFormulario(data: IProspecto) {
    this.prospectoEvaluacionForm.setValue({
      idu_prospecto: this.idu_prospecto ? this.idu_prospecto : 0,
      idu_cat_estatus: data.idu_cat_estatus ? data.idu_cat_estatus : 1,
      des_observacion: data.des_observacion ? data.des_observacion : 'SIN OBSERVACIÓN',
    });
  }

  public resetForm() {
    this.prospectoEvaluacionForm.reset();
  }

  public regresar() {
    this.router.navigate(['/prospectos']);
  }

  public enviar() {
    let validacion: IValidacion = this.prospectoEvaluacionForm.value;
    this.prospectosService.validar(this.idu_prospecto, validacion).subscribe((res)=>{
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Éxito',
        text: 'Validación de Pospecto Guardada',
        showConfirmButton: false,
        timer: 1500
      })
      this.regresar();
    },(error)=>{
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Hubo un problema',
        text: 'No se Pudo Validar el Prospecto',
        showConfirmButton: false,
        timer: 1500});
    })
  }
}
